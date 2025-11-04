import React, { useState } from "react";
import AadhaarVerification from "./AadhaarVerification";

export const SpermDonorSpecificationsForm = () => {
  const [formDetails, setFormDetails] = useState({
    bloodGroup: "",
    rhFactor: "Positive",
    height: "",
    weight: "",
    bmi: "",
    eyeColor: "",
    skinColor: "",
    artBank: "",
  });

  const [showDeatilsPage, setShowDetailsPage] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Automatically calculate BMI
    if (name === "height" || name === "weight") {
      const { height, weight } = {
        ...formDetails,
        [name]: value,
      };
      if (height && weight) {
        const heightInMeters = height / 100;
        const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        setFormDetails((prev) => ({ ...prev, bmi: calculatedBMI }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formDetails);
  };

  return (
    <>
    {showDeatilsPage?
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        <h1
          style={{
            backgroundColor: "#ee3f65",
            color: "white",
            textAlign: "center",
            padding: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            borderRadius: "12px 12px 0 0",
          }}
        >
          Donor Specifications Form
        </h1>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {/* Blood Group */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Blood Group:</label>
            <select
              name="bloodGroup"
              value={formDetails.bloodGroup}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select Blood Group</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="O">O</option>
              <option value="AB">AB</option>
            </select>
          </div>

          {/* Rh Factor */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Rh Factor:</label>
            <select
              name="rhFactor"
              value={formDetails.rhFactor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Height */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Height (cm):</label>
            <input
              type="number"
              name="height"
              value={formDetails.height}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* Weight */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formDetails.weight}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* BMI */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>BMI:</label>
            <input
              type="text"
              name="bmi"
              value={formDetails.bmi}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#e9ecef",
              }}
            />
          </div>

          {/* Eye Color */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Eye Color:</label>
            <select
              name="eyeColor"
              value={formDetails.eyeColor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select Eye Color</option>
              <option value="Brown">Brown</option>
              <option value="Green">Green</option>
              <option value="Blue">Blue</option>
              <option value="Grey">Grey</option>
              <option value="Hazel">Hazel</option>
              <option value="Amber">Amber</option>
            </select>
          </div>

          {/* Skin Color */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Skin Color:</label>
            <select
              name="skinColor"
              value={formDetails.skinColor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select Skin Color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Light Brown">Light Brown</option>
            </select>
          </div>

          {/* ART Bank */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>ART Bank:</label>
            <input
              type="text"
              name="artBank"
              value={formDetails.artBank}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#ee3f65",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>:
    <AadhaarVerification/>
    }
    </>
  );
};

export default DonorSpecificationsForm;
