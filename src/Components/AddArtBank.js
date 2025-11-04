import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SuccessPage from "./Success";
import { selectUser } from "../features/auth/authSlice";
import AccessDenied from "./AccessDenied";
import { useSelector } from "react-redux";

const styles = {
  "@keyframes fadeIn": {
    "from": { opacity: 0 },
    "to": { opacity: 1 }
  },
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "40px 20px"
  },
  formContainer: {
    width: "90%",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    animation: "fadeIn 0.6s ease-out",
    overflow: "hidden"
  },
  formHeader: {
    padding: "30px 40px",
    borderBottom: "1px solid #e1e4e8",
    backgroundColor: "#f8fafc"
  },
  formTitle: {
    color: "#1a365d",
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 10px 0"
  },
  formSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0
  },
  formContent: {
    padding: "40px"
  },
  formSection: {
    marginBottom: "35px"
  },
  formGroup: {
    marginBottom: "24px"
  },
  label: {
    display: "block",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    color: "#334155",
    backgroundColor: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    outline: "none",
    "&:focus": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
    },
    "&:hover": {
      borderColor: "#cbd5e1"
    }
  },
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
    fontWeight: "500"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "40px"
  },
  button: {
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)"
    }
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#4f46e5"
    }
  },
  secondaryButton: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    "&:hover": {
      backgroundColor: "#e2e8f0"
    }
  },
  fileUploadContainer: {
    border: "2px dashed #e2e8f0",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    marginTop: "10px",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#6366f1",
      backgroundColor: "#f8fafc"
    }
  },
  fileList: {
    marginTop: "16px",
    listStyle: "none",
    padding: 0
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "8px",
    fontSize: "14px"
  },
  removeFileButton: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#fecaca"
    }
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
    backdropFilter: "blur(4px)"
  },
  loadingCard: {
    backgroundColor: "#ffffff",
    padding: "24px 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  loadingSpinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #f3f4f6",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "500"
  },
  progressBar: {
    height: "4px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    marginBottom: "40px"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: "2px",
    transition: "width 0.3s ease"
  }
};

export const AddArtBank = () => {

  let user=useSelector(selectUser);
  user=user.user;
  console.log(user)

  const accessToThisPage = user.permissions.artBankManagement.includes("add art bank");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("addArtBank");
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
    documents: null,
  });

  console.log(currentPage)

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const AADHAAR_REGEX = /^\d{12}$/;

  // Style constants
  const colors = {
    purple: '#9B7B93',
    pink: '#FF4B6E',
    lightGray: '#B4B4B4',
    darkGray: '#666666',
    charcoal: '#444444'
  };

  const styles = {
    pageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      padding: "20px",
    },
    formContainer: {
      width: "80%",
      maxWidth: "1000px",
      backgroundColor: "#fff",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      padding: "40px",
    },
    heading: {
      color: colors.charcoal,
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "30px",
      textAlign: "center",
      borderBottom: `2px solid ${colors.pink}`,
      paddingBottom: "15px",
    },
    formGroup: {
      marginBottom: "25px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: colors.charcoal,
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: `1px solid ${colors.lightGray}`,
      marginTop: "5px",
      transition: "all 0.3s ease",
    },
    errorText: {
      color: colors.pink,
      fontSize: "14px",
      marginTop: "5px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
      gap: "20px",
    },
    primaryButton: {
      padding: "12px 24px",
      backgroundColor: colors.pink,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      flex: 1,
    },
    secondaryButton: {
      padding: "12px 24px",
      backgroundColor: colors.purple,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      flex: 1,
    },
    fileList: {
      marginTop: "10px",
      listStyle: "none",
      padding: 0,
    },
    fileItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 12px",
      backgroundColor: "#f5f5f5",
      borderRadius: "6px",
      marginBottom: "8px",
    },
    removeFileButton: {
      backgroundColor: colors.pink,
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "4px 8px",
      cursor: "pointer",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingText: {
      backgroundColor: colors.purple,
      color: "#fff",
      padding: "20px 40px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
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
      documents: [...(prev.documents || []), ...Array.from(files)],
    }));
  };

  const handleRemoveDocument = (index) => {
    setFormDetails((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateAddArtBankForm = () => {
    const newErrors = {};

    if (!formDetails.name) newErrors.name = "ART bank name is required.";
    if (!formDetails.directorName) newErrors.directorName = "Director name is required.";
    if (!AADHAAR_REGEX.test(formDetails.aadharNumber)) {
      newErrors.aadharNumber = "Aadhaar must be a 12-digit number.";
    }
    if (!PAN_REGEX.test(formDetails.panNumber)) {
      newErrors.panNumber = "PAN must be valid (e.g., ABCDE1234F).";
    }
    if (!formDetails.registrationId) newErrors.registrationId = "Registration ID is required.";
    if (!formDetails.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddArtBankSubmit = (e) => {
    e.preventDefault();
    if (validateAddArtBankForm()) {
      setCurrentPage("additionalDetails");
    }
  };

  const handleAdditionalDetailsSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formDetails.donorSemenPrice) newErrors.donorSemenPrice = "Donor Semen Price is required.";
    if (!formDetails.oocyteDonorPrice) newErrors.oocyteDonorPrice = "Oocyte Donor Price is required.";
    if (!formDetails.surrogateMotherPrice) newErrors.surrogateMotherPrice = "Surrogate Mother Price is required.";
    if (!formDetails.documents || formDetails.documents.length === 0) {
      newErrors.documents = "At least one document must be uploaded.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        Object.keys(formDetails).forEach(key => {
          if (key !== 'documents') {
            formData.append(key, formDetails[key]);
          }
        });

        formDetails.documents.forEach((file) => {
          formData.append("documents", file);
        });

        const response = await fetch("http://localhost:4000/api/add-art-bank", {
          method: "POST",
          body: formData,
          credentials: 'include' // Add this line
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/view-art-banks");
        }, 2000);
      } catch (error) {
        setErrors({ global: error.message || "Server Error" });
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return <SuccessPage />;
  }
  return (
    accessToThisPage? 
    <div style={styles.pageContainer}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingSpinner}></div>
            <span style={styles.loadingText}>Processing...</span>
          </div>
        </div>
      )}

      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <h1 style={styles.formTitle}>
            {currentPage === "addArtBank" ? "Add ART Bank" : "Additional Details"}
          </h1>
          <p style={styles.formSubtitle}>
            {currentPage === "addArtBank" 
              ? "Please fill in the basic information for the ART bank registration"
              : "Complete the registration by providing additional required details"}
          </p>
        </div>

        <div style={styles.formContent}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: currentPage === "addArtBank" ? "50%" : "100%"
              }}
            />
          </div>

          {currentPage === "addArtBank" ? (
            <form onSubmit={handleAddArtBankSubmit}>
              <div style={styles.formSection}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name of the ART bank</label>
                  <input
                    type="text"
                    name="name"
                    value={formDetails.name}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter ART bank name"
                  />
                  {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Director name as per Aadhar</label>
                  <input
                    type="text"
                    name="directorName"
                    value={formDetails.directorName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter director's name"
                  />
                  {errors.directorName && (
                    <p style={styles.errorText}>{errors.directorName}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formDetails.aadharNumber}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter 12-digit Aadhaar Number"
                  />
                  {errors.aadharNumber && (
                    <p style={styles.errorText}>{errors.aadharNumber}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>ART bank PAN number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formDetails.panNumber}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter PAN number"
                  />
                  {errors.panNumber && (
                    <p style={styles.errorText}>{errors.panNumber}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Registration ID of ART bank</label>
                  <input
                    type="text"
                    name="registrationId"
                    value={formDetails.registrationId}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter registration ID"
                  />
                  {errors.registrationId && (
                    <p style={styles.errorText}>{errors.registrationId}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formDetails.address}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p style={styles.errorText}>{errors.address}</p>
                  )}
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  Continue to Additional Details
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdditionalDetailsSubmit}>
              <div style={styles.formSection}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price for supply of Semen Donor</label>
                  <input
                    type="number"
                    name="donorSemenPrice"
                    value={formDetails.donorSemenPrice}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter price in INR"
                  />
                  {errors.donorSemenPrice && (
                    <p style={styles.errorText}>{errors.donorSemenPrice}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price for supply of Oocyte Donor</label>
                  <input
                    type="number"
                    name="oocyteDonorPrice"
                    value={formDetails.oocyteDonorPrice}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter price in INR"
                  />
                  {errors.oocyteDonorPrice && (
                    <p style={styles.errorText}>{errors.oocyteDonorPrice}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price for supply of Surrogate Mother</label>
                  <input
                    type="number"
                    name="surrogateMotherPrice"
                    value={formDetails.surrogateMotherPrice}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter price in INR"
                  />
                  {errors.surrogateMotherPrice && (
                    <p style={styles.errorText}>{errors.surrogateMotherPrice}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Required Documents</label>
                  <div style={styles.fileUploadContainer}>
                    <input
                      type="file"
                      name="documents"
                      onChange={handleFileChange}
                      multiple
                      style={{ display: "none" }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" style={{
                      cursor: "pointer",
                      color: "#6366f1",
                      fontWeight: "500"
                    }}>
                      Click to upload documents
                    </label>
                  </div>
                  {errors.documents && (
                    <p style={styles.errorText}>{errors.documents}</p>
                  )}
                  
                  {formDetails.documents && formDetails.documents.length > 0 && (
                    <ul style={styles.fileList}>
                      {formDetails.documents.map((file, index) => (
                        <li key={index} style={styles.fileItem}>
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            style={styles.removeFileButton}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={(e) => {e.preventDefault();setCurrentPage("addArtBank");}}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Back to Basic Details
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  Submit Registration
                </button>
              </div>
              
              {errors.global && (
                <p style={{ ...styles.errorText, textAlign: "center", marginTop: "20px" }}>
                  {errors.global}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
    :<AccessDenied/>
  );
};