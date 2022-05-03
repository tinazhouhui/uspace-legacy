import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import EntryList from './components/EntryList/EntryList';
import EntryDetail from './components/EntryDetail/EntryDetail';
import CreateEntryForm from './forms/CreateEntryForm/CreateEntryForm';
import { Modal, MultiSelect } from '@mantine/core';
import Loading from '../../components/Loading/Loading';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { PostType, SpaceDataType } from '../../interfaces/Interfaces';
import { Tag } from 'tabler-icons-react';
import API_SPACE_SERVICE from '../../services/apiSpaceService';

function Space() {
  const [opened, setOpened] = useState<boolean>(false);
  const [spaceData, setSpaceData] = useState<SpaceDataType[]>([]);
  const [clickedPost, setClickedPost] = useState<number>(0);
  const spaceId = useParams().id; // returns id of current space
  const [posts, setPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [spaceOwnerId, setSpaceOwnerId] = useState<string>();
  const [tags, setTags] = useState<string[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { isLoading } = useAuth0();

  function getUniqueTags(posts: PostType[]) {
    // filter out duplicates with a set
      const tagsSet: Set<string> = new Set();

      // loop through posts O(n²)
      posts.forEach((post) => {

        if (post.tags === '') return []
        // loop through post tags
        post.tags.split(',').forEach((tag) => {
          // add tag to set if not empty
          if (tag !== '') tagsSet.add(tag.trim());
        });
      });

      return Array.from(tagsSet)
  }

  useEffect(() => {
    spaceId && API_SPACE_SERVICE.getSpaceData(spaceId)
        .then((spacesData) => {
          const space = spacesData[0];
          const posts = space.Post;
          setTags(getUniqueTags(posts));

          // sort posts by date before inserting into state
          posts.sort((a, b) => {
            // compare milliseconds
            return (
              new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
            );
          });

          setSpaceData(spacesData);
          setPosts(posts);
          // todo change with new models
          setSpaceOwnerId(space.User_Space_Role[0].user.id);
        })
  }, [spaceId])


  useEffect(() => {
    if (selectedTags.length > 0) filterPostsByTags();
  }, [selectedTags]);


  if (isLoading) {
    return (
      <div className="main-loading">
        <Loading />
      </div>
    );
  }

  // return an array of posts filtered by tags
  const filterPostsByTags = () => {
    const filteredPosts = posts.filter((post) => {
      // check if tags are included in posts tags array and add it to return
      return selectedTags.some((tag) => post.tags.includes(tag));
    });
    console.log(filteredPosts);

    setFilteredPosts(filteredPosts);
  };

  return (
    <>
      <Header setOpened={setOpened} spaceOwnerId={spaceOwnerId} />
      <main className="main">
        <div className="container">
          {tags && tags.length > 0 && (
            <div className="main-filter">
              <MultiSelect
                icon={<Tag size={14} />}
                label="Filter by Tags"
                data={tags}
                placeholder="Pick a tag"
                searchable
                onChange={setSelectedTags}
              />
            </div>
          )}
          <div className="main-wrapper">
            <div className="main-left">
              {posts && (
                <EntryList
                  posts={
                    filteredPosts.length > 0 && selectedTags.length > 0
                      ? filteredPosts
                      : posts
                  }
                  setClickedPost={setClickedPost}
                />
              )}
            </div>
            <div className="main-right">
              {spaceData && (
                <EntryDetail
                  posts={
                    filteredPosts.length > 0 && selectedTags.length > 0
                      ? filteredPosts
                      : posts
                  }
                  setPosts={setPosts}
                  spaceData={spaceData}
                  clickedPost={clickedPost}
                  spaceOwnerId={spaceOwnerId}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Post an Update"
      >
        <CreateEntryForm
          setPosts={setPosts}
          setOpened={setOpened}
          space_id={spaceData && spaceData[0]?.id}
          user_id={spaceData && spaceData[0]?.User_Space_Role[0].user.id}
        />
      </Modal>
    </>
  );
}

export default withAuthenticationRequired(Space, {
  onRedirecting: () => <Loading />,
});
