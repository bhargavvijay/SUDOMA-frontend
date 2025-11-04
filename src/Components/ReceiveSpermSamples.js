import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllARTBanksAsync } from "../features/ARTbank/bankSlice";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";
import DocumentUploader from "./DocumentUploader"; // Import the DocumentUploader component

const ReceiveSpermSamples = () => {
  const banks = useSelector((state) => state.artBank.banks);
  const dispatch = useDispatch();

  let user = useSelector(selectUser);
  user = user.user;
  const accessToThisPage = user.permissions.spermSampleManagement.includes("receive sperm sample");

  const [formDetails, setFormDetails] = useState({
    donorName: "",
    age: "",
    address: "",
    viralMarkerStatus: "Non-Reactive",
    viralMarkers: "none",
    aadharNumber: "",
    numberOfVials: "",
    collectionMethod: "",
    collectionPlace: "",
    sampleQuantity: "",
    collectionDate: "",
    storagePlace: "",
    expiryDate: "",
    bloodGroup: "",
    height: "",
    weight: "",
    bmi: "",
    eyeColor: "",
    skinColor: "",
    hairColor: "",
    source: "",
  });
  
  // Add state for file uploads
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const AADHAAR_REGEX = /^\d{12}$/;
  
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

    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid aadhaarnumber! It must be exactly 12 digits.");
      return;
    }
    
    setUploading(true);
    
    try {
      // Create a FormData object to send both form fields and files
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.keys(formDetails).forEach(key => {
        formData.append(key, formDetails[key]);
      });
      
      // Add all documents to formData
      documents.forEach((file, index) => {
        formData.append("documents", file);
      });

      const response = await fetch("http://localhost:4000/api/receive-sperm-sample", {
        method: "POST",
        credentials: "include",
        body: formData, // Don't set Content-Type header, browser will set it with boundary for multipart/form-data
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      alert("Sperm sample received successfully!");
      setFormDetails({
        donorName: "",
        age: "",
        address: "",
        viralMarkerStatus: "Non-Reactive",
        viralMarkers: "none",
        aadharNumber: "",
        numberOfVials: "",
        collectionMethod: "",
        collectionPlace: "",
        sampleQuantity: "",
        collectionDate: "",
        storagePlace: "",
        expiryDate: "",
        bloodGroup: "",
        height: "",
        weight: "",
        bmi: "",
        eyeColor: "",
        skinColor: "",
        hairColor: "",
        source: "",
      });
      setDocuments([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllARTBanksAsync());
  }, [dispatch]); // Added dispatch to dependency array

  return (
    accessToThisPage ?
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
          Add Donor Sample
        </h1>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }} encType="multipart/form-data">
          {/* Donor Name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Donor Name:</label>
            <input
              type="text"
              name="donorName"
              value={formDetails.donorName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Age */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Age :</label>
            <input
              type="number"
              name="age"
              value={formDetails.age}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Address :</label>
            <input
              type="text"
              name="address"
              value={formDetails.address}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Viral Markers Status */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Viral Markers status:</label><br />
            <label style={{padding: "10px"}}>
              <input
                type="radio"
                name="viralMarkerStatus"
                value="Non-Reactive"
                checked={formDetails.viralMarkerStatus === "Non-Reactive"}
                onChange={handleChange}
              />
              Non-Reactive
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="viralMarkerStatus"
                value="Reactive"
                checked={formDetails.viralMarkerStatus === "Reactive"}
                onChange={handleChange}
              />
              Reactive
            </label>
          </div>

          {/* If Reactive, Show Viral Markers Dropdown */}
          {formDetails.viralMarkerStatus === "Reactive" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Select Viral Marker:</label>
              <select
                name="viralMarkers"
                value={formDetails.viralMarkers}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Select Marker</option>
                <option value="HIV">HIV</option>
                <option value="HCV">HCV</option>
                <option value="HBsAg">HBsAg</option>
              </select>
            </div>
          )}

          {/* aadhaarNumber */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>aadhaarNumber:</label>
            <input
              type="text"
              name="aadharNumber"
              value={formDetails.aadharNumber}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Number of Vials */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Number of Vials :</label>
            <input
              type="number"
              name="numberOfVials"
              value={formDetails.numberOfVials}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Collection Method */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Collection Method:</label>
            <select
              name="collectionMethod"
              value={formDetails.collectionMethod}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            >
              <option value="">Select Method</option>
              <option value="Method1">Method1</option>
              <option value="Method2">Method2</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Collection Place */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Collection Place:</label>
            <input
              type="text"
              name="collectionPlace"
              value={formDetails.collectionPlace}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Sample Quantity */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Sample Quantity (ml):</label>
            <input
              type="number"
              name="sampleQuantity"
              value={formDetails.sampleQuantity}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Collection Date */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Collection Date:</label>
            <input
              type="date"
              name="collectionDate"
              value={formDetails.collectionDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Storage Place */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Storage Place:</label>
            <input
              type="text"
              name="storagePlace"
              value={formDetails.storagePlace}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          {/* Expiry Date */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              value={formDetails.expiryDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

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
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
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
              required
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
              required
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
              required
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
              required
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
              required
            >
              <option value="">Select Hair Color</option>
              <option value="Black">Black</option>
              <option value="Dark Brown">Dark Brown</option>
              <option value="Light Brown">Light Brown</option>
              <option value="Dark Blonde">Dark Blonde</option>
              <option value="Light Blonde">Light Blonde</option>
            </select>
          </div>

          {/* Source */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Source:</label>
            <select
              name="source"
              value={formDetails.source}
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
                <option key={index} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Use the DocumentUploader component instead of the previous file input */}
          <div style={{ marginBottom: "30px" }}>
            <DocumentUploader documents={documents} setDocuments={setDocuments} />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: uploading ? "#cccccc" : "#ee3f65",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div> :
    <AccessDenied/>
  );
};

export default ReceiveSpermSamples;