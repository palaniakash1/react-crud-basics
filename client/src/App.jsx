import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  Users, Search, UserPlus, Edit, Trash2, X, 
  MapPin, Calendar, CheckCircle, AlertCircle,
  Database, Sparkles, ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const addToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === "age") {
          aVal = parseInt(aVal) || 0;
          bVal = parseInt(bVal) || 0;
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    setFilterUsers(filtered);
  }, [searchQuery, users, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} />;
    return sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setLoading(true);
      try {
        const res = await axios.delete(`${API_URL}/users/${userToDelete}`);
        setUsers(res.data);
        setFilterUsers(res.data);
        addToast("User deleted successfully", "success");
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to delete user");
      } finally {
        setLoading(false);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
    getAllUsers();
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!userData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!userData.age.toString().trim()) {
      errors.age = "Age is required";
    }
    if (!userData.city.trim()) {
      errors.city = "City is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (userData.id) {
        await axios.patch(`${API_URL}/users/${userData.id}`, userData);
        addToast("User updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/users`, userData);
        addToast("User added successfully", "success");
      }
      closeModal();
      setUserData({ name: "", age: "", city: "" });
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton" style={{ width: "40px", height: "24px" }}></div>
      </div>
      <div className="skeleton skeleton-text" style={{ width: "70%", height: "20px", marginBottom: "12px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "50%", marginBottom: "8px" }}></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );

  return (
    <div className="container">
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <header className="header">
        <div className="header-top">
          <div className="logo-section">
            <div className="logo-icon">
              <Database size={24} />
            </div>
            <div>
              <h1>User Management</h1>
              <p className="header-subtitle">Enterprise CRUD Application</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAddRecord}>
            <UserPlus size={18} />
            Add New User
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={20} />
            </div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon search">
              <Search size={20} />
            </div>
            <div className="stat-value">{filterUsers.length}</div>
            <div className="stat-label">Showing Results</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <Sparkles size={20} />
            </div>
            <div className="stat-value">
              {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (parseInt(u.age) || 0), 0) / users.length) : 0}
            </div>
            <div className="stat-label">Avg. Age</div>
          </div>
        </div>

        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="search"
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="sort-section">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortConfig.key === "name" ? "active" : ""}`}
                onClick={() => handleSort("name")}
              >
                Name {getSortIcon("name")}
              </button>
              <button 
                className={`sort-btn ${sortConfig.key === "age" ? "active" : ""}`}
                onClick={() => handleSort("age")}
              >
                Age {getSortIcon("age")}
              </button>
              <button 
                className={`sort-btn ${sortConfig.key === "city" ? "active" : ""}`}
                onClick={() => handleSort("city")}
              >
                City {getSortIcon("city")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="cards-container">
        {loading && !isModalOpen && !isDeleteModalOpen && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && filterUsers.length === 0 && (
          <div className="state-container" style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state-icon">
              <Users size={36} />
            </div>
            <h3 className="empty-title">No users found</h3>
            <p className="empty-description">
              {searchQuery || sortConfig.key
                ? "Try adjusting your search or sort criteria" 
                : "Get started by adding your first user"}
            </p>
            {!searchQuery && !sortConfig.key && (
              <button className="btn btn-primary" onClick={handleAddRecord}>
                <UserPlus size={18} />
                Add First User
              </button>
            )}
          </div>
        )}

        {!loading && filterUsers.map((user, index) => (
          <div 
            key={user.id} 
            className="user-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="user-card-header">
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <span className="user-id">#{user.id}</span>
            </div>
            <h3 className="user-name">{user.name}</h3>
            <div className="user-details">
              <div className="user-detail">
                <Calendar size={16} />
                <span>{user.age} years old</span>
              </div>
              <div className="user-detail">
                <MapPin size={16} />
                <span>{user.city}</span>
              </div>
            </div>
            <div className="user-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleUpdateRecord(user)}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDeleteClick(user.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{userData.id ? "Edit User" : "Add New User"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userData.name}
                    onChange={handleData}
                    className={formErrors.name ? "error-input" : ""}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={userData.age}
                    onChange={handleData}
                    className={formErrors.age ? "error-input" : ""}
                    placeholder="Enter age"
                  />
                  {formErrors.age && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {formErrors.age}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={userData.city}
                    onChange={handleData}
                    className={formErrors.city ? "error-input" : ""}
                    placeholder="Enter city"
                  />
                  {formErrors.city && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {formErrors.city}
                    </span>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : userData.id
                      ? "Update User"
                      : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <div className="delete-icon-wrapper">
                <div className="delete-icon-inner">
                  <Trash2 size={28} />
                </div>
              </div>
              <h2>Delete User</h2>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="delete-actions">
                <button 
                  className="btn btn-cancel-delete" 
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-confirm-delete" 
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
