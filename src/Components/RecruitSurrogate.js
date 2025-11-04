import React, { useState } from "react";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";
import DocumentUploader from "./DocumentUploader"; // Import the document uploader component
import { fetchAllARTBanksAsync, selectARTBanks } from "../features/ARTbank/bankSlice";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import AadhaarVerification from "./AadhaarVerification";
const RecruitSurrogate = ({collect}) => {
  let user = useSelector(selectUser);
  user = user.user;
  const accessToThisPage = user.permissions.surrogateManagement.includes("recruit surrogate");
  
  // State for documents
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
    source: collect?"ART bank 1":"",
    aadhaarVerified: false,
    aadhaarData: null,
  });

  const [showAadhaarVerification, setShowAadhaarVerification] = useState(false);


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
    const AADHAAR_REGEX = /^\d{12}$/;
    
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid Aadhaar number! It must be exactly 12 digits.");
      return;
    }
    
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();

      console.log("Form Details:", formDetails.aadhaarVerified);
      
      // Add all form fields to FormData
      Object.keys(formDetails).forEach(key => {
        // Special handling for the aadhaarData object
        if (key === 'aadhaarData' && typeof formDetails[key] === 'object') {
          formData.append(key, JSON.stringify(formDetails[key]));
        } else {
          formData.append(key, formDetails[key]);
        }
      });


      
      // Add all document files to FormData
      documents.forEach(file => {
        formData.append('documents', file);
      });
      
      const response = await fetch("https://sudoma-backend-api.onrender.com/api/add-surrogate", {
        method: "POST",
        body: formData,
        credentials: "include",
        // Don't set Content-Type header when using FormData
        // The browser will automatically set it to 'multipart/form-data'
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      alert("Surrogate added successfully!");

      setShowAadhaarVerification(false);

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
        source: collect?"ART bank 1":"",
        aadhaarVerified: false,
        aadhaarData: null,
      });
      setDocuments([]); // Clear documents after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();

    const AADHAAR_REGEX = /^\d{12}$/;
    
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid Aadhaar number! It must be exactly 12 digits.");
      return;
    }
    setShowAadhaarVerification(true);
    
  }

    const artBanks = useSelector(selectARTBanks);
    const dispatch = useDispatch();
  
    console.log(artBanks)
  
    useEffect(()=>{
        dispatch(fetchAllARTBanksAsync());
    },[dispatch])

  return (
    accessToThisPage ? !showAadhaarVerification? (
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
            Recruit Surrogate
          </h1>

          <form onSubmit={handleContinue} style={{ padding: "20px" }}>
            {/* Existing form fields */}
            {/* Donor Name */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Surrogate Name:</label>
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
              <label style={{ fontWeight: "bold" }}>Age:</label>
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
              <label style={{ fontWeight: "bold" }}>Address:</label>
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
              <label style={{ fontWeight: "bold" }}>Aadhaar Number:</label>
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
              <label style={{ fontWeight: "bold" }}>Number of Babies:</label>
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
                <label style={{ fontWeight: "bold" }}>Age of First Baby:</label>
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

            {!collect?<div style={{ marginBottom: "15px" }}>
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
            </div>:null}

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

            {/* Document Uploader Component */}
            <div style={{ marginBottom: "25px", marginTop: "30px" }}>
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
                marginTop: "20px"
              }}
            >
              Continue to Aadhaar Verification
            </button>
          </form>
        </div>
      </div>
    ):
    <AadhaarVerification 
      handleSubmit={handleSubmit}
      setShowAadhaarVerificationPage={setShowAadhaarVerification}
      formDetails={formDetails}
      setFormDetails={setFormDetails}
    /> : <AccessDenied/>
  );
};

export default RecruitSurrogate;