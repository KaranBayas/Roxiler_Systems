import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { userService, storeService } from '../services/api';
import '../styles/AdminDashboard.css';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '' });
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
  });
  const { addToast } = useToast();

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else fetchStores();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({ page: 1, limit: 100 });
      setUsers(response.data.data);
    } catch (error) {
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores({ page: 1, limit: 100 });
      setStores(response.data.data);
    } catch (error) {
      addToast('Failed to fetch stores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      addToast('User created successfully', 'success');
      setNewUser({ email: '', name: '', password: '' });
      fetchUsers();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await storeService.createStore(newStore);
      addToast('Store created successfully', 'success');
      setNewStore({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        description: '',
      });
      fetchStores();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create store', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await userService.deleteUser(userId);
      addToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (error) {
      addToast('Failed to delete user', 'error');
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await storeService.deleteStore(storeId);
      addToast('Store deleted successfully', 'success');
      fetchStores();
    } catch (error) {
      addToast('Failed to delete store', 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`tab ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Manage Stores
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="form-section">
            <h2>Add New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
                <button type="submit">Add User</button>
              </div>
            </form>
          </div>

          <div className="list-section">
            <h2>Users List ({users.length})</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="tab-content">
          <div className="form-section">
            <h2>Add New Store</h2>
            <form onSubmit={handleCreateStore}>
              <div className="form-column">
                <input
                  type="text"
                  placeholder="Store Name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  required
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={newStore.city}
                    onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newStore.state}
                    onChange={(e) => setNewStore({ ...newStore, state: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={newStore.zipCode}
                    onChange={(e) => setNewStore({ ...newStore, zipCode: e.target.value })}
                    required
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={newStore.description}
                  onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                />
                <button type="submit">Add Store</button>
              </div>
            </form>
          </div>

          <div className="list-section">
            <h2>Stores List ({stores.length})</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.id}</td>
                      <td>{store.name}</td>
                      <td>{store.city}</td>
                      <td>{store.state}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
