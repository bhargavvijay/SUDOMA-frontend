import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";
import DocumentUploader from "./DocumentUploader";
import { selectARTBanks } from "../features/ARTbank/bankSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllARTBanksAsync } from "../features/ARTbank/bankSlice";
import AadhaarVerification from "./AadhaarVerification";
import { Verified } from "lucide-react";

const AddSpermSample = ({collect}) => {
  let user = useSelector(selectUser);
  user = user.user;
  const accessToThisPage = user.permissions.spermSampleManagement.includes("add sperm sample");
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
    source: collect? "":"",
    aadhaarVerified: false,
    aadhaarData: {},
  });
  const [documents, setDocuments] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const AADHAAR_REGEX = /^\d{12}$/;

  const [showAadhaarVerificationPage, setShowAadhaarVerificationPage] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid aadhaarnumber! It must be exactly 12 digits.");
      return;
    }

    if (documents.length === 0 && uploadedDocs.length === 0) {
      alert("Please upload at least one document.");
      return;
    }
    setShowAadhaarVerificationPage(true);
  }

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

  const artBanks = useSelector(selectARTBanks);
  
  const handleRemoveUploadedDoc = async (docPath) => {
    try {
      // Assuming there's an API endpoint to delete a document
      const response = await fetch(`https://sudoma-backend-api.onrender.com/api/delete-document`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: docPath }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove from UI if successfully deleted from server
      setUploadedDocs(uploadedDocs.filter(doc => doc !== docPath));
      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  // Handle form submission
 // Fixed handleSubmit function for the React component
// Fixed handleSubmit function for the React component
const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      alert("Invalid aadhaarnumber! It must be exactly 12 digits.");
      return;
    }

    // FIXED: Check both new documents and uploaded docs
    if (documents.length === 0 && uploadedDocs.length === 0) {
      alert("Please upload at least one document.");
      return;
    }

    // Check if Aadhaar verification was successful
    if (!formDetails.aadhaarVerified) {
      alert("Aadhaar verification is required!");
      return;
    }

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Debug logging
      console.log('Documents to upload:', documents);
      console.log('Documents count:', documents.length);
      
      // Append all form fields
      Object.keys(formDetails).forEach(key => {
        // Special handling for the aadhaarData object
        if (key === 'aadhaarData' && typeof formDetails[key] === 'object') {
          formData.append(key, JSON.stringify(formDetails[key]));
        } else {
          formData.append(key, formDetails[key]);
        }
      });
      
      // FIXED: Ensure documents are properly appended
      if (documents && documents.length > 0) {
        documents.forEach((file, index) => {
          console.log(`Appending document ${index}:`, file.name, file.type, file.size);
          formData.append("documents", file);
        });
      } else {
        console.warn('No documents to upload');
      }

      // Debug: Log all FormData entries
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, 'File:', value.name, value.type, value.size);
        } else {
          console.log(key, value);
        }
      }

      console.log("Form Data being submitted:", {
        ...formDetails,
        documentsCount: documents.length
      });

      const response = await fetch("https://sudoma-backend-api.onrender.com/api/add-sperm-sample", {
        method: "POST",
        credentials: "include",
        body: formData, // Don't set Content-Type header with FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form");
      }

      // FIXED: Update uploaded docs list if there are document paths in the response
      if (result.data && result.data.documents) {
        setUploadedDocs(result.data.documents);
      }

      alert("Donor sample added successfully!");

      setShowAadhaarVerificationPage(false);

      // Reset form
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
        source: collect ? "ART bank 1" : "", // FIXED: Proper default for collect mode
        aadhaarVerified: false,
        aadhaarData: {},
      });
      setDocuments([]); // Clear documents array
      setUploadedDocs([]); // Clear uploaded docs
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to submit form: ${error.message}`);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllARTBanksAsync());
  }, [dispatch]);

  return (
    accessToThisPage ?
    !showAadhaarVerificationPage ?
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
          {collect? "Add Donor Sample":"Receive Donor Sample"}
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

          {/* Collection Method */}
          { !collect?
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
              {
                artBanks.map((bank) => (
                  <option key={bank._id} value={bank.name}>
                    {bank.name}
                  </option>
                ))
              }
            </select>
          </div>: null
          }
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

          {/* Document Upload */}
          <div style={{ marginBottom: "25px" }}>
            <DocumentUploader documents={documents} setDocuments={setDocuments} />
          </div>

          {/* Display uploaded documents */}
          {uploadedDocs.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>
                Previously Uploaded Documents:
              </h4>
              <div style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                {uploadedDocs.map((doc, index) => (
                  <div 
                    key={index} 
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: index < uploadedDocs.length - 1 ? '1px solid #eee' : 'none'
                    }}
                  >
                    <a 
                      href={`https://sudoma-backend-api.onrender.com/api/documents/${encodeURIComponent(doc.split('\\').pop())}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#0066cc',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ marginRight: '10px', color: '#666' }}>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </span>
                      {doc.split('\\').pop()}
                    </a>
                    <button 
                      onClick={() => handleRemoveUploadedDoc(doc)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            Continue To Verify Aadhaar
          </button>
        </form>
      </div>
    </div>
    :
    <AadhaarVerification
      handleSubmit={handleSubmit}
      setShowAadhaarVerificationPage={setShowAadhaarVerificationPage}
      formDetails={formDetails}
      setFormDetails={setFormDetails}
    />
    :
    <AccessDenied/>
  );
};

export default AddSpermSample;