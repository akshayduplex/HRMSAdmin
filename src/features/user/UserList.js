import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from './userSlice';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    navigate(`/user/${user.id}/edit`, { state: { user } });
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div>
      <h2>User List</h2>
      <button onClick={() => navigate('/user/new')}>Add User</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
