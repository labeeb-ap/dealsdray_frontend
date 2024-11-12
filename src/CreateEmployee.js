import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    mobileNo: "",
    designation: "",
    gender: "",
    course: [],
    imgUpload: "",
  });
  const [error, setError] = useState(null);

  // Function to handle image upload and compress the image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      try {
        // Compression options
        const options = {
          maxSizeMB: 0.01, // Target size is less than 10KB, so 0.01MB = 10KB
          maxWidthOrHeight: 200, // Resizing for further compression, adjust as needed
          useWebWorker: true, // Use web worker for faster compression
        };

        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed file size: ${compressedFile.size / 1024} KB`);

        // Convert compressed image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, imgUpload: reader.result }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    } else {
      alert("Please upload a JPG or PNG file.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value]
          : prev.course.filter((course) => course !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!formData.name || !formData.email || !formData.mobileNo || !formData.designation || !formData.gender) {
      setError("All fields are required");
      return;
    }

    // Validation for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validation for numeric mobile number
    if (!/^\d+$/.test(formData.mobileNo)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    // Reset error message
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/login/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        if (data.success) {
            alert("Employee created successfully!");
        } else {
          setError("Submission failed: " + data.message);
        }
      } else {
        setError("Server error: " + response.statusText);
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError("Network error: Could not complete the request.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "10px" }}>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Mobile Number */}
        <div style={{ marginBottom: "10px" }}>
          <label>Mobile No: </label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Designation */}
        <div style={{ marginBottom: "10px" }}>
          <label>Designation: </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Gender */}
        <div style={{ marginBottom: "10px" }}>
          <label>Gender: </label>
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
        </div>

        {/* Courses */}
        <div style={{ marginBottom: "10px" }}>
          <label>Course: </label>
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
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "10px" }}>
          <label>Img Upload: </label>
          <input
            type="file"
            name="imgUpload"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            style={{ width: "100%", padding: "8px" }}
          />
          {formData.imgUpload && (
            <div style={{ marginTop: "10px" }}>
              <p>Image Preview:</p>
              <img
                src={formData.imgUpload}
                alt="Preview"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <p style={{ fontSize: "12px", color: "#555" }}>
                Base64 String: {formData.imgUpload.substring(0, 50)}... (truncated)
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
            }}
          >
            Submit
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EmployeeEdit;
