import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchAllARTBanksAsync } from "../features/ARTbank/bankSlice";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export const OocyteRequisitionForm = () => {

  let user=useSelector(selectUser);
  user=user.user;
  const accessToThisPage = user.permissions.requisitionManagement.includes("raise requisition oocyte");

  const [formDetails, setFormDetails] = useState({
    bloodGroup: "",
    rhFactor: "Positive",
    height: "",
    weight: "",
    bmi: "",
    eyeColor: "",
    skinColor: "",
    hairColor: "",
    state: "",
    artBank: "",
  });

  const dispatch=useDispatch();

  const banks = useSelector((state) => state.artBank.banks);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSubmit = {
        bloodGroup:formDetails.bloodGroup+(formDetails.formDetails==="Positive"?"+":"-"),
        height:formDetails.height,
        weight:formDetails.weight,
        eyeColor:formDetails.eyeColor,
        skinColor:formDetails.skinColor,
        hairColor:formDetails.hairColor,
        state:formDetails.state,
        artBank:formDetails.artBank,
    };
  
    try {
      console.log("Submitting data:", dataToSubmit);
  
      const response = await fetch("https://sudoma-backend-api.onrender.com/api/raise-oocyte-requisition", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
  
      const result = await response.json();
      alert("Oocyte requisition submitted successfully!");
      setFormDetails({
        bloodGroup: "",
        rhFactor: "Positive",
        height: "",
        weight: "",
        bmi: "",
        eyeColor: "",
        skinColor: "",
        hairColor: "",
        state: "",
        artBank: "",
      });
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to submit form. Please try again.");
    }
  };
  
  

  useEffect(()=>{
    dispatch(fetchAllARTBanksAsync())
  },[])

  return (
    accessToThisPage?
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
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
          }}
        >
          Oocyte Requisition Form
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
              <option value="Black">Black</option>
              <option value="Brown">Brown</option>
              <option value="Green">Green</option>
              <option value="Blue">Blue</option>
              <option value="Grey">Grey</option>
              <option value="Hazzle">Hazzle</option>
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
              <option value="Very Fair">Very Fair</option>
              <option value="Fair Skin">Fair Skin</option>
              <option value="Medium Skin">Medium Skin</option>
              <option value="Light Brown">Light Brown</option>
              <option value="Dark Brown">Dark Brown</option>
              <option value="Black Skin">Black Skin</option>
            </select>
          </div>

          {/* Hair Color */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Hair Color:</label>
            <select
              name="hairColor"
              value={formDetails.hairColor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
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

          {/* State */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>State:</label>
            <select
              name="state"
              value={formDetails.state}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select State</option>
              {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
                "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
                "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
                "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
                "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
                "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
                "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
                "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"]
                .map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
            </select>
          </div>

          {/* ART Bank */}
          <div style={{ marginBottom: "15px" }}>
            
            <label style={{ fontWeight: "bold" }}>ART Bank:</label>
            <select
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
            >
              <option value="">Select ART Bank</option>
              {banks.map((bank, index) => (
                <option key={index} value={bank.name}>{bank.name}</option>
              ))}
            </select>
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
    <AccessDenied/>
  );
};

export default OocyteRequisitionForm;
