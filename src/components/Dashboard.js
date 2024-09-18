import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, addUser, updateUser } from '../userSlice';
import UserCard from './UserCard';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        job: '',
    });

    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            job: '',
        });
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            job: user.job,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            dispatch(updateUser({ id: editingUser.id, ...formData }));
        } else {
            const resultAction = await dispatch(addUser(formData));
            if (addUser.fulfilled.match(resultAction)) {
                const newUser = resultAction.payload;
                dispatch(updateUser(newUser));
            }
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editingUser ? 'Edit User' : 'Add User'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    className="border p-2 w-full"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Job</label>
                                <input
                                    className="border p-2 w-full"
                                    type="text"
                                    name="job"
                                    value={formData.job}
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
