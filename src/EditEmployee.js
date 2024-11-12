import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const EditEmployee = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState(employee);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(employee);  // Initialize form data from employee prop
  }, [employee]);
  console.log("ivde employee id",employee);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        course: checked
          ? [...prevData.course, value]
          : prevData.course.filter((course) => course !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Image upload and compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      try {
        const options = {
          maxSizeMB: 0.01,
          maxWidthOrHeight: 200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevData) => ({ ...prevData, imgUpload: reader.result }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error during image compression:', error);
      }
    } else {
      alert('Please upload a JPG or PNG file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.name || !formData.email || !formData.mobileNo || !formData.designation || !formData.gender) {
      setError('All fields are required');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
  
    if (!/^\d+$/.test(formData.mobileNo)) {
      setError('Please enter a valid mobile number.');
      return;
    }
  
    setError(null);
  
    try {
      const response = await fetch('http://localhost:3000/login/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setError(null);  // Clear any previous errors
          onSave(formData);  // Call onSave to update the parent component's state
          alert("Employee updated successfully!");  // Optional: show success alert
        } else {
          setError("Failed to update employee: " + data.message);
        }
      } else {
        setError("Server error: " + response.statusText);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setError('Network error: Could not complete the request.');
    }
  };
  


  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Mobile No:
          <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
        </label>
        <label>
          Designation:
          <select name="designation" value={formData.designation} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </label>
        <label>
          Gender:
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={handleChange}
            />{" "}
            M
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={handleChange}
            />{" "}
            F
          </label>
        </label>
        <label>
          Course:
          <label>
            <input
              type="checkbox"
              name="course"
              value="MCA"
              checked={formData.course.includes("MCA")}
              onChange={handleChange}
            />{" "}
            MCA
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              name="course"
              value="BCA"
              checked={formData.course.includes("BCA")}
              onChange={handleChange}
            />{" "}
            BCA
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              name="course"
              value="BSC"
              checked={formData.course.includes("BSC")}
              onChange={handleChange}
            />{" "}
            BSC
          </label>
        </label>
        <label>
          Image Upload:
          <input
            type="file"
            name="imgUpload"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
          />
          {formData.imgUpload && (
            <div style={{ marginTop: "10px" }}>
              <p>Image Preview:</p>
              <img src={formData.imgUpload} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          )}
        </label>
        <button type="submit">update</button>
        
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EditEmployee;
