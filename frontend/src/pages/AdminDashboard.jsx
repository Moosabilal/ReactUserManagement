import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { logoutUser } from '../features/authSlice';
import {useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUsers, deleteUser, fetchUsers, updateUsers } from '../features/userSlice';

const AdminDashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {users} = useSelector((state)=>state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [formData, setFormData] = useState({id: null, name: '',email: '',role: 'user',password:''});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleForm = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev,[name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateUsers({ id: formData._id, formData })).then(() => {
        setIsEditing(false);
        setFormData({ id: null, name: '', email: '', role: 'user'});
      });
    }else{
      dispatch(createUsers({ id: formData._id, formData })).then(() => {
        setFormData({ id: null, name: '', email: '', role: 'user',password:''});
      });
    }
  };

  const handleEdit = (user) => {
    setFormData({_id: user._id,name: user.name,email: user.email,role: user.role});
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsFormVisible(true);
  };
  
  const handleCancel = () => {
    setFormData({id: null,name: '',email: '',role: 'user'});
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().startsWith(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    dispatch(logoutUser()).then(()=>{
      navigate('/login');
    })
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm font-medium ms-230">
        Logout
      </button>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={toggleForm}
      >
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit User" : "Create New User"}
        </h2>
        {isFormVisible ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {isEditing ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      )}
    </div>
      
      <div className="bg-white rounded shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Users List</h2>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role||'user'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-4 text-center text-gray-500">
            {searchTerm ? 'No users found matching your search.' : 'No users available.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;