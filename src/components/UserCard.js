// src/components/UserCard.js
import React from 'react';

const UserCard = ({ user }) => {
    return (
        <div className="border rounded p-4 m-2 shadow w-64">
            <h3 className="text-lg font-bold">
                {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
        </div>
    );
};

export default UserCard;
