import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";
import DocumentUploader from "./DocumentUploader";
import { fetchAllARTBanksAsync, selectARTBanks } from "../features/ARTbank/bankSlice";
import AadhaarVerification from "./AadhaarVerification";
const RecruitOocyteDonor = ({collect}) => {
  let user = useSelector(selectUser);
  user = user.user;
  const accessToThisPage = user.permissions.oocyteDonorManagement
    .includes("recruit oocyte donor");
  
  const [documents, setDocuments] = useState([]);
  const [formDetails, setFormDetails] = useState({
    donorName: "",
    age: "",
    address: "",
    aadharNumber: "",
    maritalStatus: "",
    husbandName: "",
    numberOfBabies: "",
    ageOfFirstBaby: "",
    abortion: "",
    numberOfAbortion: "",
    bloodGroup: "",
    height: "",
    weight: "",
    bmi: "",
    eyeColor: "",
    skinColor: "",
    hairColor: "",
    source: collect?"ART bank 1":"",
    aadhaarVerified: false,
    aadhaarData: null,
  });

  const [showAadharVerification, setShowAadharVerification] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();

    const AADHAAR_REGEX = /^\d{12}$/;

    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid aadhaarnumber! It must be exactly 12 digits.");
      return;
    }

    if (documents.length === 0) {
      alert("Please upload at least one document!");
      return;
    }

    setShowAadharVerification(true);
  
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log("formDetails", formDetails.source);

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

    const AADHAAR_REGEX = /^\d{12}$/;
    
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid aadhaarnumber! It must be exactly 12 digits.");
      return;
    }

    if (documents.length === 0) {
      alert("Please upload at least one document!");
      return;
    }

    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      
      // Add all form fields to FormData
      const dataToSubmit = {
        donorName: formDetails.donorName,
        age: formDetails.age,
        address: formDetails.address,
        aadharNumber: formDetails.aadharNumber,
        maritalStatus: formDetails.maritalStatus,
        husbandName: formDetails.husbandName,
        numberOfBabies: Number(formDetails.numberOfBabies) || 0,
        ageOfFirstBaby: formDetails.ageOfFirstBaby,
        abortion: formDetails.abortion,
        numberOfAbortion: Number(formDetails.numberOfAbortion) || 0,
        bloodGroup: formDetails.bloodGroup,
        height: formDetails.height,
        weight: formDetails.weight,
        eyeColor: formDetails.eyeColor,
        skinColor: formDetails.skinColor,
        hairColor: formDetails.hairColor,
        source:formDetails.source,
        aadhaarVerified: formDetails.aadhaarVerified,
        aadhaarData: formDetails.aadhaarData,
      };
      
      // Append form data as JSON string
      formData.append('donorData', JSON.stringify(dataToSubmit));
      
      // Append all documents
      documents.forEach((file, index) => {
        formData.append('documents', file);
      });

      const response = await fetch("http://localhost:4000/api/add-oocyte-sample", {
        method: "POST",
        body: formData,
        credentials: "include",
        // Don't set Content-Type header, browser will set it with boundary parameter
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }
      
      alert("Oocyte Donor added successfully!");

        // setShowAadharVerification(false);
      
      // Reset form
      setFormDetails({
        donorName: "",
        age: "",
        address: "",
        aadharNumber: "",
        maritalStatus: "",
        husbandName: "",
        numberOfBabies: "",
        ageOfFirstBaby: "",
        abortion: "",
        numberOfAbortion: "",
        bloodGroup: "",
        height: "",
        weight: "",
        bmi: "",
        eyeColor: "",
        skinColor: "",
        hairColor: "",
        source: "",
      });
      
      // Reset documents
      setDocuments([]);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const artBanks = useSelector(selectARTBanks);
  const dispatch = useDispatch();

  console.log(artBanks)

  useEffect(()=>{
      dispatch(fetchAllARTBanksAsync());
  },[dispatch])

  return (
  accessToThisPage ? !showAadharVerification ?
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
          {collect?"Recruit Oocyte Donor":"Receive Oocyte Donor"}
        </h1>

        <form onSubmit={handleContinue} style={{ padding: "20px" }}>
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

          {/* Marital Status */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Marital status:</label><br />
            <label style={{padding: "10px"}}>
              <input
                type="radio"
                name="maritalStatus"
                value="Unmarried"
                checked={formDetails.maritalStatus === "Unmarried"}
                onChange={handleChange}
              />
              Unmarried
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="maritalStatus"
                value="Married"
                checked={formDetails.maritalStatus === "Married"}
                onChange={handleChange}
              />
              Married
            </label>
          </div>

          {/* If Married, Show Husband Name */}
          {formDetails.maritalStatus === "Married" && (
            <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Husband Name:</label>
            <input
              type="text"
              name="husbandName"
              value={formDetails.husbandName}
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
          )}

          {/* Number Of Babies */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Number of Babies :</label>
            <input
              type="number"
              name="numberOfBabies"
              value={formDetails.numberOfBabies}
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

          {/* If Number of Babies is more than 0, Show Age of first baby */}
          {formDetails.numberOfBabies > 0 && (
            <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Age of First Baby :</label>
            <input
              type="number"
              name="ageOfFirstBaby"
              value={formDetails.ageOfFirstBaby}
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
          )}

          {/* Abortion Status */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Abortion status:</label><br />
            <label style={{padding: "10px"}}>
              <input
                type="radio"
                name="abortion"
                value="No"
                checked={formDetails.abortion === "No"}
                onChange={handleChange}
              />
              No
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="abortion"
                value="Yes"
                checked={formDetails.abortion === "Yes"}
                onChange={handleChange}
              />
              Yes
            </label>
          </div>

          {/* If Abortion Status is Yes, Show Number Of Abortion */}
          {formDetails.abortion === "Yes" && (
            <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Number of Abortion:</label>
            <input
              type="number"
              name="numberOfAbortion"
              value={formDetails.numberOfAbortion}
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
          )}

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

          {!collect?
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
              required
            >
              <option value="">Select Source</option>
              {artBanks.map((bank) => (
  <option key={bank.name} value={bank.name}>{bank.name}</option>
))}

            </select>
          </div>: null
      }
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

          {/* Document Uploader Component */}
          <div style={{ marginBottom: "25px" }}>
            <DocumentUploader documents={documents} setDocuments={setDocuments} />
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
            Continue to verify aadhaar 
          </button>
        </form>
      </div>
    </div> :
    <AadhaarVerification 
      handleSubmit={handleSubmit} 
      setShowAadhaarVerificationPage={setShowAadharVerification} 
      formDetails={formDetails}
      setFormDetails={setFormDetails}
    />:
    <AccessDenied/>
  );
};

export default RecruitOocyteDonor;