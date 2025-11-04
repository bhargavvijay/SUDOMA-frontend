import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editARTBankAsync } from "../features/ARTbank/bankSlice";
import { Link } from "react-router-dom";
import { Trash2, File, Plus } from 'lucide-react';

const EditBank = ({ bankDetails, setEditArtBank }) => {
  const dispatch = useDispatch();

  const [formDetails, setFormDetails] = useState({
    name: "",
    directorName: "",
    aadharNumber: "",
    panNumber: "",
    registrationId: "",
    address: "",
    donorSemenPrice: "",
    oocyteDonorPrice: "",
    surrogateMotherPrice: "",
    newDocuments: [],
    removedDocuments: [],
  });

  const [currentDocuments, setCurrentDocuments] = useState([]); // Store current documents
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const AADHAAR_REGEX = /^\d{12}$/;

  useEffect(() => {
    if (bankDetails) {
      setFormDetails({
        ...bankDetails,
        newDocuments: [],
        removedDocuments: [],
      });
      if (bankDetails.documents) {
        setCurrentDocuments(bankDetails.documents);
      }
    }
  }, [bankDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      newDocuments: [...prev.newDocuments, ...Array.from(files)],
    }));
  };

  const handleRemoveCurrentDocument = (index) => {
    const docToRemove = currentDocuments[index];
    setCurrentDocuments((prev) => prev.filter((_, i) => i !== index));
    setFormDetails((prev) => ({
      ...prev,
      removedDocuments: [...prev.removedDocuments, docToRemove],
    }));
  };

  const handleRemoveNewDocument = (index) => {
    setFormDetails((prev) => ({
      ...prev,
      newDocuments: prev.newDocuments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formDetails.name) newErrors.name = "ART bank name is required.";
    if (!formDetails.directorName)
      newErrors.directorName = "Director name is required.";
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber))
      newErrors.aadharNumber = "Aadhaar must be a 12-digit number.";
    if (!PAN_REGEX.test(formDetails.panNumber))
      newErrors.panNumber = "PAN must be valid (e.g., ABCDE1234F).";
    if (!formDetails.registrationId)
      newErrors.registrationId = "Registration ID is required.";
    if (!formDetails.address) newErrors.address = "Address is required.";
    if (!formDetails.donorSemenPrice)
      newErrors.donorSemenPrice = "Donor Semen Price is required.";
    if (!formDetails.oocyteDonorPrice)
      newErrors.oocyteDonorPrice = "Oocyte Donor Price is required.";
    if (!formDetails.surrogateMotherPrice)
      newErrors.surrogateMotherPrice = "Surrogate Mother Price is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const formData = new FormData();
        
        // Add text fields
        formData.append("name", formDetails.name);
        formData.append("directorName", formDetails.directorName);
        formData.append("aadharNumber", formDetails.aadharNumber);
        formData.append("panNumber", formDetails.panNumber);
        formData.append("registrationId", formDetails.registrationId);
        formData.append("address", formDetails.address);
        formData.append("donorSemenPrice", formDetails.donorSemenPrice);
        formData.append("oocyteDonorPrice", formDetails.oocyteDonorPrice);
        formData.append("surrogateMotherPrice", formDetails.surrogateMotherPrice);
  
        // Append the current document paths as a JSON string
        formData.append("existingDocuments", JSON.stringify(currentDocuments));
  
        // Only append removed documents if there are any
        if (formDetails.removedDocuments && formDetails.removedDocuments.length > 0) {
          formData.append("removedDocuments", JSON.stringify(formDetails.removedDocuments));
        } else {
          formData.append("removedDocuments", JSON.stringify([]));
        }
  
        // Log for debugging
        console.log("Current documents:", currentDocuments);
        console.log("Removed documents:", formDetails.removedDocuments);
        console.log("New documents:", formDetails.newDocuments);
  
        // Append new documents if any
        if (formDetails.newDocuments && formDetails.newDocuments.length > 0) {
          formDetails.newDocuments.forEach((file) => {
            formData.append("documents", file);
          });
        }
  
        // Add a log to see what's being sent
        for (let [key, value] of formData.entries()) {
          const isFile =
            typeof File !== "undefined" &&
            typeof value === "object" &&
            value !== null &&
            value.constructor &&
            value.constructor.name === "File";
        
          console.log(`${key}: ${isFile ? value.name : value}`);
        }
        
  
        const result = await dispatch(editARTBankAsync({ 
          id: formDetails.registrationId, 
          updatedData: formData 
        })).unwrap();
  
        setLoading(false);
        setSuccessMessage("ART Bank updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setEditArtBank(false);
        }, 3000);
      } catch (error) {
        setLoading(false);
        setErrors({ global: error.message || "Error updating ART Bank" });
        console.error("Error updating ART Bank:", error);
      }
    }
  };
  
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      padding: "20px",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingText: {
      color: "#fff",
      fontSize: "20px",
    },
    successMessage: {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: "#dff0d8",
      color: "#3c763d",
      padding: "15px",
      borderRadius: "5px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      zIndex: 1001,
    },
    formCard: {
      width: "80%",
      maxWidth: "1000px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      padding: "40px",
      overflowY: "auto",
      maxHeight: "90vh",
    },
    title: {
      color: "#333",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
    },
    errorText: {
      color: "red",
      fontSize: "14px",
      marginTop: "5px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    documentSection: {
      marginBottom: "20px",
    },
    documentList: {
      listStyle: "none",
      padding: 0,
      margin: "10px 0",
      border: "1px solid #eee",
      borderRadius: "5px",
    },
    documentItem: {
      padding: "10px 15px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    documentName: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    fileIcon: {
      color: "#555",
    },
    fileLink: {
      color: "#0066cc",
      textDecoration: "none",
    },
    removeButton: {
      backgroundColor: "transparent",
      color: "#ee3f65",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px",
    },
    fileInput: {
      width: "100%",
      padding: "12px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginTop: "10px",
    },
    uploadArea: {
      border: "2px dashed #ccc",
      borderRadius: "5px",
      padding: "20px",
      textAlign: "center",
      marginTop: "10px",
      cursor: "pointer",
    },
    uploadIcon: {
      fontSize: "24px",
      color: "#555",
      marginBottom: "10px",
    },
    uploadText: {
      color: "#555",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
    },
    backButton: {
      padding: "12px 20px",
      backgroundColor: "gray",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
    },
    saveButton: {
      padding: "12px 20px",
      backgroundColor: "#ee3f65",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
    },
    noDocuments: {
      textAlign: "center",
      padding: "20px",
      color: "#777",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      marginTop: "10px",
    },
    twoColumnGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
      gap: "20px",
    },
  };
  
  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <p style={styles.loadingText}>Saving...</p>
        </div>
      )}

      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h1 style={styles.title}>Edit ART Bank</h1>
          
          {errors.global && <p style={styles.errorText}>{errors.global}</p>}

          <div style={styles.twoColumnGrid}>
            {/* First Column */}
            <div>
              {/* Bank Information */}
              <div style={styles.formGroup}>
                <label style={styles.label}>ART Bank Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formDetails.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.name && <p style={styles.errorText}>{errors.name}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Director Name:</label>
                <input
                  type="text"
                  name="directorName"
                  value={formDetails.directorName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.directorName && <p style={styles.errorText}>{errors.directorName}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Aadhaar Number:</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formDetails.aadharNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.aadharNumber && <p style={styles.errorText}>{errors.aadharNumber}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>PAN Number:</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formDetails.panNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.panNumber && <p style={styles.errorText}>{errors.panNumber}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Registration ID:</label>
                <input
                  type="text"
                  name="registrationId"
                  value={formDetails.registrationId}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.registrationId && <p style={styles.errorText}>{errors.registrationId}</p>}
              </div>
            </div>

            {/* Second Column */}
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Address:</label>
                <textarea
                  name="address"
                  value={formDetails.address}
                  onChange={handleChange}
                  style={{ ...styles.input, minHeight: "100px" }}
                  required
                />
                {errors.address && <p style={styles.errorText}>{errors.address}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Donor Semen Price:</label>
                <input
                  type="number"
                  name="donorSemenPrice"
                  value={formDetails.donorSemenPrice}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.donorSemenPrice && <p style={styles.errorText}>{errors.donorSemenPrice}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Oocyte Donor Price:</label>
                <input
                  type="number"
                  name="oocyteDonorPrice"
                  value={formDetails.oocyteDonorPrice}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.oocyteDonorPrice && <p style={styles.errorText}>{errors.oocyteDonorPrice}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Surrogate Mother Price:</label>
                <input
                  type="number"
                  name="surrogateMotherPrice"
                  value={formDetails.surrogateMotherPrice}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                {errors.surrogateMotherPrice && <p style={styles.errorText}>{errors.surrogateMotherPrice}</p>}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div style={styles.documentSection}>
            <h3 style={{ fontSize: "18px", marginTop: "30px", marginBottom: "15px" }}>Current Documents</h3>
            
            {currentDocuments.length > 0 ? (
              <ul style={styles.documentList}>
                {currentDocuments.map((doc, index) => (
                  <li key={index} style={styles.documentItem}>
                    <div style={styles.documentName}>
                      <File size={18} style={styles.fileIcon} />
<a 
  href={`http://localhost:4000/api/documents/${encodeURIComponent(doc.split('\\').pop())}`} 
  style={styles.fileLink}
  target="_blank"
  rel="noopener noreferrer"
>
  {doc.split('\\').pop()}
</a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCurrentDocument(index)}
                      style={styles.removeButton}
                      aria-label="Remove document"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.noDocuments}>
                <p>No documents found</p>
                <p style={{ fontSize: "14px", marginTop: "5px" }}>Use the section below to upload new files</p>
              </div>
            )}
          </div>

          {/* Upload New Documents */}
          <div style={styles.documentSection}>
            <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Attach New Documents</h3>
            
            <label htmlFor="file-upload" style={styles.uploadArea}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Plus size={24} style={styles.uploadIcon} />
                <p style={styles.uploadText}>Click to browse or drag files here</p>
                <p style={{ fontSize: "14px", color: "#777", marginTop: "5px" }}>Supported formats: PDF, DOC, DOCX, PNG, JPG</p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            
            {formDetails.newDocuments.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "16px", marginBottom: "10px" }}>Files to Upload:</h4>
                <ul style={styles.documentList}>
                  {formDetails.newDocuments.map((file, index) => (
                    <li key={index} style={styles.documentItem}>
                      <div style={styles.documentName}>
                        <File size={18} style={styles.fileIcon} />
                        <span>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewDocument(index)}
                        style={styles.removeButton}
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => setEditArtBank(false)}
              style={styles.backButton}
            >
              Back
            </button>
            <button
              type="submit"
              style={styles.saveButton}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBank;