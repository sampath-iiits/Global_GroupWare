import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.log('Error deleting user:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editUser.id}`, formData);
      const updatedUsers = users.map(user => (user.id === editUser.id ? { ...user, ...formData } : user));
      setUsers(updatedUsers);
      setEditUser(null);
    } catch (err) {
      console.log('Error updating user:', err);
    }
  };

  return (
    <div className="users-container">
      <h2>Users List</h2>
      <div className="edit-form-container">
        <div className="users-list">
          {users.map(user => (
            <div className="user-card" key={user.id}>
              <img src={user.avatar} alt={user.first_name} />
              <p>{user.first_name} {user.last_name}</p>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        </div>

        {editUser && (
          <div className="edit-form">
            <h3>Edit User</h3>
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <button onClick={handleUpdate}>Update</button>
          </div>
        )}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>Previous</button>
        <button onClick={nextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Users;
