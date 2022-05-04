import './EntryDetail.scss';
import CommentSection from '../CommentSection/CommentSection';
import { PostType, SpaceDataType } from '../../../../interfaces/Interfaces';
import DOMPurify from 'dompurify';
import { Menu } from '@mantine/core';
import { Trash, Edit } from 'tabler-icons-react';
import API_POST_SERVICE from '../../../../services/apiPostService';
import _ from 'lodash';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Incoming {
  clickedPost: number;
  spaceData: any;
  spaceOwnerId?: string;
  posts: PostType;
  setPosts: Function;
  user: any;
}

function EntryDetail(props: Incoming) {
  const post = props.posts
  const mySpace= props.spaceData[0]
  const username = mySpace.user.username;
  const picture_url = mySpace.user.picture_url;
  // const comments = props.posts[props.clickedPost]?.Comment;

   // return empty if no posts exist
  if (!post) {
    return <></>;
  }

  const isOwner = props.user.sub === post.user_id

  let date = '';
  if (post) {
    date = new Date(post.created_at).toLocaleTimeString('en-EN', {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      day: '2-digit',
      month: 'short',
    });
  }
  //


  const deletePost = async () => {
    // // delete post from db
    // await API_POST_SERVICE.deletePostById(post.id);
    // // deep clone posts of space
    // const clonedPosts = _.cloneDeep(props.posts);
    // // find index of deleted post in state
    // const indexOfDeletedPost = clonedPosts.findIndex(
    //   (arrPost) => arrPost.id === post.id
    // );
    // // delete post from state
    // clonedPosts.splice(indexOfDeletedPost, 1);
    // // set posts without deleted one to state
    // props.setPosts(clonedPosts);
    console.log('post deleted', post);
  };

  const editPost = () => {
    console.log('post edited', post);
  };

  return (
    <div className="entry-detail">
      <div className="entry-detail-top">
        <div className="entry-detail-creator">
          <img
            className="entry-detail-creator-avatar"
            src={picture_url}
            alt="Avatar User"
          />
          <div className="entry-detail-creator-info">
            <div className="name">{username}</div>
            <div className="time">{date}</div>
          </div>
        </div>
        {isOwner && (
          <Menu placement="end">
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item icon={<Edit size={14} />} onClick={editPost}>
              Edit this Post
            </Menu.Item>
            <Menu.Item
              color="red"
              icon={<Trash size={14} />}
              onClick={deletePost}
            >
              Delete this Post
            </Menu.Item>
          </Menu>
        )}
      </div>
      <div className="entry-detail-content">
        <div
          className="entry-detail-title"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post && post.title),
          }}
        ></div>
        <div className="entry-detail-text">
          {post && (
            // insert rich text content
            // TODO: Check how to insert rich text safely without sanitizing here
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            ></div>
          )}
        </div>
      </div>
      {post &&
        post.tags.length > 1 && ( // if tags are empty, hide this
          <div className="entry-detail-tags">
            <div className="entry-detail-tags-title">Tags</div>
            <div className="entry-detail-tags-wrapper">
              {post &&
                // slice off last whitespace and split tags into array
                post.tags
                  .slice(0, -1)
                  .split(',')
                  .map((tag) => {
                    return (
                      <div key={tag} className="tag done">
                        {tag}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
      {/*<div className="entry-detail-comments">*/}
      {/*  <div className="entry-detail-comments-title">Comments</div>*/}
      {/*  <div className="entry-detail-comments-wrapper">*/}
      {/*    <CommentSection*/}
      {/*      comments={comments}*/}
      {/*      postId={post.id}*/}
      {/*      posts={props.posts}*/}
      {/*      setPosts={props.setPosts}*/}
      {/*      clickedPost={props.clickedPost}*/}
      {/*      spaceOwnerId={props.spaceOwnerId}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default EntryDetail;
