import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState([false]);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:2000/users").then((res) => {
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // handling select user
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filterUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filterUsers);
  };

  // handling delete user
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      `are you sure want to delete this user? `
    );

    if (isConfirmed) {
      await axios.delete(`http://localhost:2000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
    }
  };
  // handling add new user/record

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" }); //to make the input field empty

    setIsModalOpen(true);
  };

  //handling close modal

  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  //handle data

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.id) {
      await axios
        .patch(`http://localhost:2000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios.post("http://localhost:2000/users", userData).then((res) => {
        console.log(res);
      });
    }

    closeModal();
    setUserData({ name: "", age: "", city: "" }); //to make the input field empty
  };

  //handle update record

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>crud app made with react and node</h3>

        <div className="input-search">
          <input
            type="search"
            className="search"
            placeholder="Search Here"
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            ADD NEW RECORD
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Id </th>
              <th>Name </th>
              <th>Age </th>
              <th>City </th>
              <th>Edit </th>
              <th>Delete </th>
            </tr>
          </thead>
          <tbody>
            {filterUsers &&
              filterUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button
                        className="btn green"
                        onClick={() => handleUpdateRecord(user)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn red"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>

              <h2>{userData.id ? "Update Record" : "Add New Record"}</h2>

              <h2>User Records</h2>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userData.name}
                  onChange={handleData}
                />
              </div>

              <div className="input-group">
                <label htmlFor="age">age</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={userData.age}
                  onChange={handleData}
                />
              </div>

              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={handleData}
                />
              </div>

              <button className="btn green" onClick={handleSubmit} >
                {userData.id ? "Update Record":" Add New Record"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
