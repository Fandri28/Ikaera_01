// ajoutcomment.tsx
import React, { useState } from 'react';
import axios from 'axios';

const AjouterComment: React.FC<{ id: string; userId: string; fetchComments: () => void }> = ({ id, userId, fetchComments }) => {
  const [newComment, setNewComment] = useState('');
  const urlapi = "http://localhost:5000";
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('User not found. Please log in.');
      return;
    }

    const currentDate = new Date().toISOString();

    const commentData = {
      Idproduit: id,
      Iduser: userId,
      Commentaire: newComment,
      date: currentDate,
      Action: 'visible',
    };

    try {
      const response = await axios.post(`${urlapi}/api/comments`, commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Comment added:', response.data.comment);
        setNewComment(''); // Clear input
        fetchComments();
        setSuccess(`bravo vous ete inscrit`)

      } else {
        throw new Error('Failed to add the comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add the comment. Please try again.');
    }
  };

  return (
    <>
      <textarea
        className="w-full p-2 border-none focus:outline-none text-black"
        placeholder="Votre commentaire"
        value={newComment}
        onChange={handleCommentChange}
        required // Champ obligatoire
      />
      <button 
      onClick={(e)=>{
        e.preventDefault(); // Prevent form submission

          handleSubmit(e);
      } }
      
      
      className= " text-blue-800 bg-blue-400 rounded px-4 py-2 flex items-center">
  <i className="bi bi-send text-xl mr-1"></i>
 
</button>

    </>
  );
};

export default AjouterComment;
