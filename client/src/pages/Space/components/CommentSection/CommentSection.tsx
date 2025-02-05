import React, { useState } from 'react';
import './CommentSection.scss';
import {
  CommentType,
  PostType,
} from '../../../../interfaces/Interfaces';
import DOMPurify from 'dompurify';
import Comment from '../Comment/Comment';
import { useAuth0 } from '@auth0/auth0-react';
import _ from 'lodash';
import API_USER_SERVICE from '../../../../services/apiUserService';
import API_COMMENT_SERVICE from '../../../../services/apiCommentService';

interface Incoming {
  clickedPost: number;
  comments: CommentType[];
  spaceOwnerId?: string;
  postId: number;
  posts: PostType[];
  setPosts: Function;
}

// todo remove unused props
function CommentSection({clickedPost, comments, spaceOwnerId, postId, posts, setPosts}: Incoming) {
  const [newComment, setNewComment] = useState('');
  // todo move to state
  const { user } = useAuth0();

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setNewComment(event.currentTarget.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saveComment = DOMPurify.sanitize(newComment);
    setNewComment(''); // reset input

    // prevent users from submitting whitespace and empty forms
    if (!saveComment.length || saveComment.trim() === '') return; // prevent empty submits

    if (postId && user) {
      const commentData = {
        content: saveComment,
        user_id: user.sub!,
        post_id: postId,
      };

      // post comment to DB
      API_COMMENT_SERVICE.createComment(commentData)
          .then((comment) => {
              // deep clone all posts
              const clonedPosts = _.cloneDeep(posts);
              // find post to add the new comment to
              const postToAddCommentTo = clonedPosts.find(
                (post) => post.id === commentData.post_id
              );

              // push comment to right post
              postToAddCommentTo?.Comment.push(comment);
              // overwrite posts state with the cloned posts incl. the new comment
              setPosts(clonedPosts);
          })
          .catch((error) => console.error(error))
    }
  };

  return (
    <div className="comments">
      <div className="comments-wrapper">
        {comments &&
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              spaceOwnerId={spaceOwnerId}
            />
          ))}
      </div>
      <div className="comments-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={handleInput}
            name="comment"
          />
          <button type="submit"/>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;
