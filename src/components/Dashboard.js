// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    // Fetch user data from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://reqres.in/api/users?page=2');
                const data = await response.json();
                setUsers(data.data); // `data.data` contains the user array
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Open the modal for adding a new user
    const handleAddUser = () => {
        setEditingUser(null); // Set editingUser to null for adding a new user
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
        });
        setIsModalOpen(true);
    };

    // Open the modal for editing an existing user
    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData(user);
        setIsModalOpen(true);
    };

    // Handle form submission (both adding and editing users)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            // Update existing user
            setUsers(users.map(user => user.id === editingUser.id ? { ...editingUser, ...formData } : user));
        } else {
            // Add new user
            const newUser = {
                id: users.length + 1,
                ...formData
            };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="container mx-auto p-4">
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mb-4"
                onClick={handleAddUser}
            >
                Add User
            </button>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="flex flex-wrap mt-4">
                    {users.map((user) => (
                        <div key={user.id} onClick={() => handleEditUser(user)} className="cursor-pointer">
                            <UserCard user={user} />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding/editing a user */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editingUser ? 'Edit User' : 'Add User'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">First Name</label>
                                <input
                                    className="border p-2 w-full"
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Last Name</label>
                                <input
                                    className="border p-2 w-full"
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    className="border p-2 w-full"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700 mr-2"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                                >
                                    {editingUser ? 'Update User' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
