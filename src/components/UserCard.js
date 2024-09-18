import React from 'react';

const UserCard = ({ user }) => (
  <div className="border p-4 m-2 rounded shadow w-60">
    <h3 className="text-lg text-blue-400 font-bold w-20">{user.name}</h3>
    <p>Job :- {user.job}</p>
    <p>ID: {user.id}</p>
    <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
  </div>
);

export default UserCard;    
