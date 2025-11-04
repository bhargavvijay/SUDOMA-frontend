import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllARTBanksAsync } from "../features/ARTbank/bankSlice";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

const DonorSpecificationsForm = () => {
  const banks = useSelector((state) => state.artBank.banks);
  let user = useSelector(selectUser)
  user = user.user;
  const accessToThisPage = user.permissions.requisitionManagement.includes("raise requisition sperm");
  const [formDetails, setFormDetails] = useState({
    bloodGroup: "",
    rhFactor: "Positive",
    height: "",
    weight: "",
    bmi: "",
    eyeColor: "",
    hairColor: "",
    complexion: "",
    artBank: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormDetails(prev => {
      const updatedDetails = { ...prev, [name]: value };
      
      // Calculate BMI automatically when height or weight changes
      if (name === 'height' || name === 'weight') {
        if (updatedDetails.height && updatedDetails.weight) {
          // BMI formula: weight (kg) / (height (m))²
          const heightInMeters = updatedDetails.height / 100;
          const bmi = (updatedDetails.weight / (heightInMeters * heightInMeters)).toFixed(1);
          updatedDetails.bmi = bmi;
        }
      }
      
      return updatedDetails;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['bloodGroup', 'height', 'weight', 'eyeColor', 'hairColor', 'complexion', 'artBank'];
    const missingFields = requiredFields.filter(field => !formDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    try {
      // Map the form fields to match the API endpoint's expected fields
      const payload = {
        bloodGroup: formDetails.bloodGroup + (formDetails.rhFactor === "Negative" ? "-" : "+"),
        height: formDetails.height,
        weight: formDetails.weight,
        eyeColor: formDetails.eyeColor,
        skinColor: formDetails.complexion, // Note the field name difference
        hairColor: formDetails.hairColor,
        artBank: formDetails.artBank
      };
      
      const response = await fetch('https://sudoma-backend-api.onrender.com/api/add-sperm-requisition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit donor details');
      }
      
      const result = await response.json();
      alert('Donor specifications submitted successfully!');
      
      // Reset form after successful submission
      setFormDetails({
        bloodGroup: "",
        rhFactor: "Positive",
        height: "",
        weight: "",
        bmi: "",
        eyeColor: "",
        hairColor: "",
        complexion: "",
        artBank: "",
      });
      
    } catch (error) {
      console.error('Error submitting donor details:', error);
      alert(`Failed to submit donor details: ${error.message}`);
    }
  };

  useEffect(() => {
    dispatch(fetchAllARTBanksAsync());
  }, [dispatch]);

  if (!accessToThisPage) {
    return <AccessDenied />;
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "flex-start", // Changed from center to allow scrolling
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px 0", // Add padding to ensure space at top and bottom
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          margin: "20px 0", // Add margin to ensure space around form
        }}
      >
        <div
          style={{
            backgroundColor: "#ee3f65",
            color: "#ffffff",
            textAlign: "center",
            padding: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            position: "sticky", // Make header sticky
            top: 0,
            zIndex: 10,
          }}
        >
          Donor Specifications Form
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Blood Group:
            </label>
            <select
              name="bloodGroup"
              value={formDetails.bloodGroup}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select Blood Group</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="O">O</option>
              <option value="AB">AB</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Rh Factor:
            </label>
            <select
              name="rhFactor"
              value={formDetails.rhFactor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Height (cm):
            </label>
            <input
              type="number"
              name="height"
              value={formDetails.height}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Weight (kg):
            </label>
            <input
              type="number"
              name="weight"
              value={formDetails.weight}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              BMI:
            </label>
            <input
              type="text"
              name="bmi"
              value={formDetails.bmi}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Eye Color:
            </label>
            <select
              name="eyeColor"
              value={formDetails.eyeColor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select Eye Color</option>
              <option value="Black">Black</option>
              <option value="Brown">Brown</option>
              <option value="Green">Green</option>
              <option value="Blue">Blue</option>
              <option value="Grey">Grey</option>
              <option value="Hazzle">Hazzle</option>
              <option value="Amber">Amber</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Hair Color:
            </label>
            <select
              name="hairColor"
              value={formDetails.hairColor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select Hair Color</option>
              <option value="Black">Black</option>
              <option value="Dark Brown">Dark Brown</option>
              <option value="Light Brown">Light Brown</option>
              <option value="Dark Blonde">Dark Blonde</option>
              <option value="Light Blonde">Light Blonde</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              Complexion:
            </label>
            <select
              name="complexion"
              value={formDetails.complexion}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select Complexion</option>
              <option value="Very Fair">Very Fair</option>
              <option value="Fair Skin">Fair Skin</option>
              <option value="Medium Skin">Medium Skin</option>
              <option value="Light Brown">Light Brown</option>
              <option value="Dark Brown">Dark Brown</option>
              <option value="Black Skin">Black Skin</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#333333", marginBottom: "8px" }}>
              ART Bank:
            </label>
            <select
              name="artBank"
              value={formDetails.artBank}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select ART Bank</option>
              {banks.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#ee3f65",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e02050"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ee3f65"}
          >
            Submit Donor Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorSpecificationsForm;