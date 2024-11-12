import React, { useState, useEffect } from 'react';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';

const EmployeeList = ({ onAddEmployee, onDelete }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);  // State for the employee to edit
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch("http://localhost:3000/login/list", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setEmployeeData(responseData.data);
        } else {
          setError(responseData.message);
        }
      } else {
        setError("Failed to fetch employee details.");
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  const handleAddEmployee = (newEmployee) => {
    onAddEmployee(newEmployee);
    fetchDetails();
    setShowCreateForm(false);
  };

  const handleEditEmployee = async (updatedEmployee) => {
    // Call API to update the employee data
    try {
      const response = await fetch(`http://localhost:3000/login/update/${updatedEmployee._id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
      if (response.ok) {
        fetchDetails();
        setEditEmployee(null); // Close the edit form
      } else {
        setError("Failed to update employee.");
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  const filteredEmployees = employeeData.filter((employee) =>
    employee.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {showCreateForm ? (
        <CreateEmployee onAddEmployee={handleAddEmployee} onCancel={() => setShowCreateForm(false)} />
      ) : editEmployee ? (
        <EditEmployee employee={editEmployee} onSave={handleEditEmployee} onCancel={() => setEditEmployee(null)} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setShowCreateForm(true)} style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              Create Employee
            </button>
            <input
              type="text"
              placeholder="Enter Search Keyword"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#add8e6' }}>
              <tr>
                <th>Unique ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee._id}</td>
                    <img src={employee.imgUpload} alt="profile" />                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.mobileNo}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.course}</td>
                    <td>{employee.createdAt}</td>
                    <td>
                      <button onClick={() => setEditEmployee(employee)}>Edit</button> {/* Set the employee to edit */}
                      <button onClick={() => onDelete(employee._id)} style={{ color: 'red' }}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: '10px' }}>
            <strong>Total Count: {filteredEmployees.length}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
