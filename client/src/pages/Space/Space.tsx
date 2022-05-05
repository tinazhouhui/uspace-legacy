import {useEffect, useState} from 'react';
import Header from '../../components/Header/Header';
import EntryList from './components/EntryList/EntryList';
import EntryDetail from './components/EntryDetail/EntryDetail';
import CreateEntryForm from './forms/CreateEntryForm/CreateEntryForm';
import {Modal, MultiSelect} from '@mantine/core';
import Loading from '../../components/Loading/Loading';
import {withAuthenticationRequired} from '@auth0/auth0-react';
import {useParams} from 'react-router-dom';
import {PostType} from '../../interfaces/Interfaces';
import {Tag} from 'tabler-icons-react';
import {useSpaces} from '../Home/components/Spaces/Spaces';
import {useUser} from '../../App';

function Space() {
    const [opened, setOpened] = useState<boolean>(false);
    const [clickedPost, setClickedPost] = useState<number>(0);
    const spaceId = useParams().id; // returns id of current space
    const [posts, setPosts] = useState<PostType[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
    const [spaceOwnerId, setSpaceOwnerId] = useState<string>();
    const [tags, setTags] = useState<string[]>(['hello']);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const user = useUser();
    const {data, status} = useSpaces(user.sub!);

    const getMySpace = () => {
        const all = [...data?.allSpaces[0], ...data?.allSpaces[1]]
        return all.filter(space => space.space_id === parseInt(spaceId!))
    }

    const mySpace = getMySpace();


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
        const uniqueTags = getUniqueTags(mySpace[0].post)
        setTags(uniqueTags)
    }, [])

    useEffect(() => {
        setPosts(mySpace[0].post)
    }, [data])


    useEffect(() => {
        filterPostsByTags();
    }, [selectedTags]);

    useEffect(() => {
        setSpaceOwnerId(mySpace[0].owner)
    }, [spaceId])


    if (status === 'loading') {
        return (
            <div className="main-loading">
                <Loading/>
            </div>
        );
    }

    // return an array of posts filtered by tags
    const filterPostsByTags = () => {
        const mySpace: any = getMySpace()
        const filteredPosts = mySpace[0].post.filter((post: any) => {
            // check if tags are included in posts tags array and add it to return
            return selectedTags.some((tag) => post.tags.includes(tag));
        });

        setFilteredPosts(filteredPosts);
    };

    return (
        <>
            <Header setOpened={setOpened} spaceOwnerId={spaceOwnerId} userId={user.sub}/>
            <main className="main">
                <div className="container">
                    {tags && tags.length > 0 && (
                        <div className="main-filter">
                            <MultiSelect
                                icon={<Tag size={14}/>}
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
                                        filteredPosts.length > 0
                                            ? filteredPosts
                                            : posts
                                    }
                                    setClickedPost={setClickedPost}
                                />
                            )}
                        </div>
                        <div className="main-right">
                            <EntryDetail
                                posts={posts[clickedPost]}
                                setPosts={setPosts}
                                spaceData={mySpace}
                                clickedPost={clickedPost}
                                spaceOwnerId={spaceOwnerId}
                                user={user}
                            />
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
                    space_id={mySpace && mySpace[0]?.space_id}
                    user_id={mySpace && mySpace[0]?.user.sub}
                />
            </Modal>
        </>
    );
}

export default withAuthenticationRequired(Space, {
    onRedirecting: () => <Loading/>,
});
