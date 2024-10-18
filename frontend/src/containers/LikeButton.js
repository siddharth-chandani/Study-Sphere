
import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const LikeButton = ( {email,embedId,saved} ) => {

  const [liked, setLiked] = useState(saved);
console.log(liked)
  const save = () => {


    
    const Data={
        email:email,
        embedId:embedId,
        stat:liked?'unsave':'save'
      }
      console.log(Data)
    
          axios.post(`${process.env.REACT_APP_API_URL}/api/save`,Data)
          .then(response => {
            console.log(response.data)
              if(response.data['message']==='Changes Made Successfully.'){
                setLiked(!liked);      
              } else {
                console.error('Failed to update the like status');
              }
            })
            .catch(error => {
              console.error('There was an error making the POST request!', error);
            });
    


            console.log(Data)

  };

  return (
    <div onClick={save} style={{ cursor: 'pointer' }}>
      {liked ? <FaHeart className='heart solid-heart'/> : <FaRegHeart className='heart regular-heart' />}
    </div>
  );
};

export default LikeButton;
