import React, { useContext, useState } from 'react';
import './CommentSection.scss';
import AvatarGirl from '../../assets/img/avatar-girl.jpg';
import AvatarDude from '../../assets/img/avatar-dude.jpg';
import { SpaceContext } from '../../pages/Space';
import { SpaceDataType } from '../../interfaces/Interfaces';
import DOMPurify from 'dompurify';
import Comment from '../Comment/Comment';

function CommentSection() {
  const [comment, setComment] = useState('');
  const spaceData = useContext<SpaceDataType[]>(SpaceContext);
  const comments = spaceData[0]?.Post[0].Comment;
  console.log(comments);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.length) return; // prevent empty submits
    setComment('');
    console.log(comment);
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setComment(event.currentTarget.value);
  };

  return (
    <div className="comments">
      <div className="comments-wrapper">
        {comments && comments.map(comment => <Comment key={comment.id} data={comment} />)}
      </div>
      <div className="comments-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={comment}
            onChange={handleInput}
            name="comment"
          />
          <button type="submit"></button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;
