import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from './userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email };
    if (user) {
      dispatch(updateUser({ ...userData, id: user.id })).then(() => navigate('/users'));
    } else {
      dispatch(addUser(userData)).then(() => navigate('/users'));
    }
  };

  return (
    <div>
      <h2>{user ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">{user ? 'Update' : 'Add'} User</button>
      </form>
    </div>
  );
};

export default UserForm;
