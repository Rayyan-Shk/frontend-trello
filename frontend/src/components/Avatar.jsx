import React from 'react';

const Avatar = ({ username }) => {
  const firstLetter = username.charAt(0).toUpperCase();
  
  return (
    <div className="avatar">
      {firstLetter}
    </div>
  );
};

export default Avatar;