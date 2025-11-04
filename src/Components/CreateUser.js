  import React, { useState, useMemo } from "react";
  import { useSelector } from "react-redux";import { selectUser } from "../features/auth/authSlice";import AccessDenied from "./AccessDenied";

  // Color scheme
  const colors = {
    primary: "#ee3f65",
    secondary: "#a6a8ab",
    darkGray: "#444444",
    mediumGray: "#777777",
    lightGray: "#f7f7f7",
    border: "#e5e5e5",
    white: "#ffffff",
    accent: "#f9edef",
    focus: "#d8ebff",
    error: "#f44336"
  };

  const permissionCategories = {
    "Art Bank Management": ["add art bank", "view art bank"],
    "Requisition Management": [
      "raise requisition sperm", "raise requisition oocyte", "raise requisition surrogate",
      "view sperm requisitions", "view oocyte requisitions", "view surrogate requisitions"
    ],
    "Sperm Sample Management": [
      "add sperm sample", "receive sperm sample", "issue sperm sample", "delete sperm sample",
      "view received sperm samples", "view issued sperm samples", "view collected sperm samples"
    ],
    "Oocyte Donor Management": [
      "recruit oocyte donor", "receive oocyte donor", "allocate oocyte donor", "delete oocyte donor",
      "view received oocyte donors", "view recruited oocyte donors", "view allocated oocyte donors"
    ],
    "Surrogate Management": [
      "recruit surrogate", "receive surrogate", "allocate surrogate", "delete surrogate",
      "view received surrogates", "view recruited surrogates", "view allocated surrogates"
    ],
    "Manage Users": [
      "add user", "delete user", "view users"]
  };

  const CreateUser = () => {
    let user=useSelector(selectUser);  user=user.user;  const accessToThisPage=user.permissions.manageUsers.includes("add user");
    const [formData, setFormData] = useState({
      customerID: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      permissions: {},
    });
    
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

    // Calculate total permissions
    const totalPermissions = useMemo(() => {
      return Object.values(permissionCategories).flat().length;
    }, []);
    
    // Calculate number of selected permissions
    const selectedPermissionsCount = useMemo(() => {
      return Object.values(formData.permissions).flat().length;
    }, [formData.permissions]);

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      
      // Clear messages when form is edited
      setSuccessMessage("");
      setErrorMessage("");
      
      // Check password match when either password field changes
      if (name === "password" || name === "confirmPassword") {
        if (name === "password") {
          setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === "");
        } else {
          setPasswordMatch(value === formData.password);
        }
      }
    };

    // Toggle category expansion
    const toggleCategory = (category) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    // Handle permission selection
    const handlePermissionChange = (module, permission) => {
      setFormData((prevData) => {
        const updatedPermissions = { ...prevData.permissions };
        if (!updatedPermissions[module]) {
          updatedPermissions[module] = [];
        }

        if (updatedPermissions[module].includes(permission)) {
          updatedPermissions[module] = updatedPermissions[module].filter(
            (perm) => perm !== permission
          );
        } else {
          updatedPermissions[module].push(permission);
        }

        return { ...prevData, permissions: updatedPermissions };
      });
      
      // Clear messages when form is edited
      setSuccessMessage("");
      setErrorMessage("");
    };
    
    // Toggle all permissions in a category
    const toggleAllInCategory = (module) => {
      setFormData((prevData) => {
        const updatedPermissions = { ...prevData.permissions };
        const allModulePermissions = permissionCategories[module];
        
        // Check if all permissions in this module are already selected
        const allSelected = allModulePermissions.every(perm => 
          updatedPermissions[module]?.includes(perm)
        );
        
        if (allSelected) {
          // Remove all permissions from this module
          updatedPermissions[module] = [];
        } else {
          // Add all permissions from this module
          updatedPermissions[module] = [...allModulePermissions];
        }
        
        return { ...prevData, permissions: updatedPermissions };
      });
    };
    
    // Toggle all permissions across all categories
    const toggleAllPermissions = () => {
      setFormData((prevData) => {
        const currentPermissionsCount = Object.values(prevData.permissions).flat().length;
        const updatedPermissions = {};
        
        if (currentPermissionsCount === totalPermissions) {
          // If all permissions are selected, deselect all
          return { ...prevData, permissions: {} };
        } else {
          // Otherwise, select all
          Object.entries(permissionCategories).forEach(([module, permissions]) => {
            updatedPermissions[module] = [...permissions];
          });
          return { ...prevData, permissions: updatedPermissions };
        }
      });
    };

    // Check if all permissions in a category are selected
    const areAllCategoryPermissionsSelected = (module) => {
      const allModulePermissions = permissionCategories[module];
      return allModulePermissions.every(perm => 
        formData.permissions[module]?.includes(perm)
      );
    };
    
    // Check if some permissions in a category are selected
    const areSomeCategoryPermissionsSelected = (module) => {
      const permissions = formData.permissions[module] || [];
      return permissions.length > 0 && permissions.length < permissionCategories[module].length;
    };
    
    // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setPasswordMatch(false);
      return;
    }

    console.log(formData);

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {    
      // Remove confirmPassword and map name to username
      const { customerID,email,name,password,permissions } = formData;
      const dataToSubmit = {customerID,email,username:name,password,permissions};
      console.log(dataToSubmit);

      // Call the /register route
      const response = await fetch("https://sudoma-backend-api.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
        credentials: 'include' // Add this line
      });

      console.log("Response:", response);

      if (response.ok) {
        setSuccessMessage("User created successfully!");
        setFormData({ 
          customerID: "", 
          email: "", 
          name: "", 
          password: "", 
          confirmPassword: "",
          permissions: {} 
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error creating the user. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };


    // Custom input styles
    const inputStyle = {
      display: "block",
      width: "100%",
      padding: "10px 12px",
      marginBottom: "16px",
      border: `1px solid ${colors.border}`,
      borderRadius: "4px",
      fontSize: "14px",
      transition: "border-color 0.2s, box-shadow 0.2s",
      outline: "none"
    };
    
    // Custom checkbox styles
    const checkboxStyle = {
      accentColor: colors.primary,
      width: "16px",
      height: "16px",
      cursor: "pointer"
    };

    return (
      accessToThisPage?
      <div style={{ 
        maxWidth: "800px", 
        margin: "20px auto", 
        padding: "30px", 
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`, 
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        fontFamily: "Arial, sans-serif",
        color: colors.darkGray
      }}>
        <h2 style={{ 
          color: colors.primary, 
          marginTop: 0,
          fontSize: "24px",
          borderBottom: `2px solid ${colors.border}`,
          paddingBottom: "12px",
          marginBottom: "24px"
        }}>
          Create User
        </h2>
        
        {successMessage && (
          <div style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#e6f7e6",
            border: "1px solid #c3e6c3",
            borderRadius: "4px",
            color: "#2e7d32"
          }}>
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "4px",
            color: "#c62828"
          }}>
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "6px", 
                fontSize: "14px", 
                fontWeight: "600" 
              }}>
                Customer ID
              </label>
              <input 
                type="text" 
                name="customerID" 
                value={formData.customerID} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${colors.focus}`}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "6px", 
                fontSize: "14px", 
                fontWeight: "600" 
              }}>
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${colors.focus}`}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "6px", 
                fontSize: "14px", 
                fontWeight: "600" 
              }}>
                Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${colors.focus}`}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "6px", 
                fontSize: "14px", 
                fontWeight: "600" 
              }}>
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                style={{
                  ...inputStyle,
                  border: !passwordMatch && formData.password ? `1px solid ${colors.error}` : `1px solid ${colors.border}`,
                  marginBottom: "8px"
                }}
                onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${colors.focus}`}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "6px", 
              fontSize: "14px", 
              fontWeight: "600" 
            }}>
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              style={{
                ...inputStyle,
                border: !passwordMatch && formData.confirmPassword ? `1px solid ${colors.error}` : `1px solid ${colors.border}`,
              }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${colors.focus}`}
              onBlur={e => e.target.style.boxShadow = "none"}
            />
            {!passwordMatch && formData.confirmPassword && (
              <div style={{ 
                color: colors.error, 
                fontSize: "12px", 
                marginTop: "-12px", 
                marginBottom: "16px" 
              }}>
                Passwords do not match
              </div>
            )}
          </div>

          <div style={{ 
            marginTop: "20px", 
            marginBottom: "24px", 
            backgroundColor: colors.lightGray,
            padding: "14px 16px",
            borderRadius: "6px"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              marginBottom: "14px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: "16px", 
                  fontWeight: "600",
                  color: colors.darkGray 
                }}>
                  Permissions
                </h3>
                <span style={{ 
                  fontSize: "13px", 
                  color: colors.secondary,
                  marginLeft: "12px", 
                  fontWeight: "400" 
                }}>
                  {selectedPermissionsCount} of {totalPermissions} selected
                </span>
              </div>
              
              <button 
                type="button" 
                onClick={toggleAllPermissions}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "13px",
                  color: colors.primary,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "500"
                }}
              >
                {selectedPermissionsCount === totalPermissions ? "Deselect All" : "Select All"}
              </button>
            </div>
            
            <div style={{ maxHeight: "400px", overflowY: "auto", padding: "4px" }}>
              {Object.entries(permissionCategories).map(([module, permissions]) => (
                <div 
                  key={module} 
                  style={{ 
                    marginBottom: "12px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "6px",
                    backgroundColor: colors.white
                  }}
                >
                  <div 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 14px",
                      backgroundColor: areAllCategoryPermissionsSelected(module) ? colors.accent : colors.white,
                      borderBottom: expandedCategories[module] ? `1px solid ${colors.border}` : "none",
                      cursor: "pointer",
                      borderRadius: expandedCategories[module] ? "6px 6px 0 0" : "6px",
                      transition: "background-color 0.2s ease"
                    }}
                    onClick={() => toggleCategory(module)}
                  >
                    <div style={{ marginRight: "14px", display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={areAllCategoryPermissionsSelected(module)}
                        ref={el => {
                          if (el) {
                            el.indeterminate = areSomeCategoryPermissionsSelected(module);
                          }
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleAllInCategory(module);
                        }}
                        style={checkboxStyle}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: areAllCategoryPermissionsSelected(module) ? colors.primary : colors.darkGray,
                      }}>
                        {module}
                      </span>
                      <span style={{
                        marginLeft: "10px",
                        fontSize: "13px",
                        color: colors.secondary,
                      }}>
                        {(formData.permissions[module] || []).length} / {permissions.length}
                      </span>
                    </div>
                    
                    <span style={{ color: colors.secondary, fontSize: "10px" }}>
                      {expandedCategories[module] ? "▼" : "►"}
                    </span>
                  </div>
                  
                  {expandedCategories[module] && (
                    <div style={{ 
                      padding: "12px 14px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "10px",
                    }}>
                      {permissions.map((permission) => {
                        const isChecked = formData.permissions[module]?.includes(permission) || false;
                        return (
                          <div 
                            key={permission}
                            style={{ 
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 10px",
                              borderRadius: "4px",
                              backgroundColor: isChecked ? colors.accent : colors.lightGray,
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`perm-${module}-${permission}`}
                              checked={isChecked}
                              onChange={() => handlePermissionChange(module, permission)}
                              style={{ ...checkboxStyle, marginRight: "10px" }}
                            />
                            <label 
                              htmlFor={`perm-${module}-${permission}`}
                              style={{ 
                                cursor: "pointer",
                                fontSize: "13px",
                                color: isChecked ? colors.darkGray : colors.mediumGray,
                                textTransform: "capitalize"
                              }}
                            >
                              {permission}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            marginTop: "20px",
            gap: "12px"
          }}>
            <button 
              type="button" 
              style={{
                padding: "10px 18px",
                backgroundColor: colors.white,
                color: colors.mediumGray,
                border: `1px solid ${colors.border}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
              onClick={() => {
                setFormData({ 
                  customerID: "", 
                  email: "", 
                  name: "", 
                  password: "", 
                  confirmPassword: "",
                  permissions: {} 
                });
                setSuccessMessage("");
                setErrorMessage("");
                setPasswordMatch(true);
              }}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                padding: "10px 24px",
                backgroundColor: colors.primary,
                color: colors.white,
                border: "none",
                borderRadius: "4px",
                cursor: isLoading ? "default" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "120px"
              }}
            >
              {isLoading ? (
                <span>Creating...</span>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </form>
      </div>:<AccessDenied />
    );
  };

  export default CreateUser;