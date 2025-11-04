import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchAllARTBanksAsync } from "../features/ARTbank/bankSlice";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";

export const SurrogacyDonarSpecificationsForm = () => {

  let user=useSelector(selectUser);
  user=user.user;
  const accessToThisPage = user.permissions.requisitionManagement.includes("raise requisition surrogate");

  const dispatch=useDispatch();

  const [formDetails, setFormDetails] = useState({
    bloodGroup: "",
    rhFactor: "",
    height: "",
    weight: "",
    bmi: "",
    state: "",
    artBank: "",
  });

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
    const handleDataToSubmit={
      bloodGroup:formDetails.bloodGroup+(formDetails.rhFactor==="Positive"?"+":"-"),
      height:formDetails.height,
      weight:formDetails.weight,
      state:formDetails.state,
      artBank:formDetails.artBank
    }

    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/add-surrogacy-requistion", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(handleDataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      alert("Surrogacy requisition submitted successfully!");
      setFormDetails({
        bloodGroup: "",
        rhFactor: "",
        height: "",
        weight: "",
        bmi: "",
        state: "",
        artBank: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  useEffect(()=>{
    dispatch(fetchAllARTBanksAsync());
  })

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
          maxWidth: "600px",
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
          Surrogacy Requisition Form
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
              <option value="">Select Rh Factor</option>
              <option value="+">Positive</option>
              <option value="-">Negative</option>
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

export default SurrogacyDonarSpecificationsForm;
