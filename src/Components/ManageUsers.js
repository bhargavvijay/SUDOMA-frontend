import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import AccessDenied from './AccessDenied';
import { fetchUserAsync } from '../features/auth/authSlice';

export default function ManageUsers() {

  const dispatch = useDispatch();

  const user=useSelector(selectUser).user;
  const accessToThisPage = user.permissions.manageUsers.includes("view users");
  const tempuser=user;
  const canEditUsers = user.permissions.manageUsers.includes("add user");

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Color scheme
  const colors = {
    primary: "#ee3f65",
    secondary: "#a6a8ab",
    darkGray: "#444444",
    mediumGray: "#777777",
    lightGray: "#f7f7f7",
    border: "#e5e5e5",
    white: "#ffffff",
    accent: "#f9edef"
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://sudoma-backend-api.onrender.com/api/users',{
        
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`https://sudoma-backend-api.onrender.com/api/delete-user/${userId}`, {
          method: 'DELETE',
          credentials: "include",

        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user._id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setShowEditModal(true);
    }
  };

  const handleCloseEdit = () => {
    console.log("Closing edit modal");
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser) => {
    console.log("Saving user:");
    try {
      const response = await fetch(`https://sudoma-backend-api.onrender.com/api/update-user/${updatedUser._id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update the users list with the updated user
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      
      // Close the edit modal
      handleCloseEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  // User details modal component
  const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    // Get all permission categories
    const permissionCategories = Object.keys(user.permissions || {});

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: `2px solid ${colors.border}`,
            paddingBottom: '12px'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: colors.primary,
              fontSize: '20px' 
            }}>
              User Details
            </h3>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: colors.mediumGray
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '16px',
              color: colors.darkGray,
              marginBottom: '12px',
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: '8px'
            }}>
              Basic Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', margin: '8px 0', color: colors.secondary }}>Customer ID</p>
                <p style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  margin: '0 0 12px 0' 
                }}>
                  {user.customerID}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', margin: '8px 0', color: colors.secondary }}>Username</p>
                <p style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  margin: '0 0 12px 0' 
                }}>
                  {user.username}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', margin: '8px 0', color: colors.secondary }}>Email</p>
                <p style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  margin: '0 0 12px 0' 
                }}>
                  {user.email}
                </p>
              </div>
              {user.role && (
                <div>
                  <p style={{ fontSize: '14px', margin: '8px 0', color: colors.secondary }}>Role</p>
                  <p style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    margin: '0 0 12px 0' 
                  }}>
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 style={{ 
              fontSize: '16px',
              color: colors.darkGray,
              marginBottom: '12px',
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: '8px'
            }}>
              Permissions
            </h4>
            
            {permissionCategories.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {permissionCategories.map(category => (
                  <div key={category} style={{ marginBottom: '16px' }}>
                    <h5 style={{ 
                      fontSize: '15px',
                      color: colors.primary,
                      margin: '0 0 8px 0',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h5>
                    
                    {user.permissions[category].length > 0 ? (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '8px'
                      }}>
                        {user.permissions[category].map(permission => (
                          <div key={permission} style={{
                            padding: '6px 10px',
                            backgroundColor: colors.accent,
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}>
                            {permission}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ 
                        fontSize: '14px', 
                        color: colors.mediumGray, 
                        fontStyle: 'italic',
                        margin: '4px 0' 
                      }}>
                        No permissions assigned
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ 
                fontSize: '14px', 
                color: colors.mediumGray, 
                fontStyle: 'italic' 
              }}>
                No permissions found
              </p>
            )}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button 
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AccessDeniedModal = ({ onClose }) => {
    // Color scheme (matching your existing theme)
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
  
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          width: "400px",
          padding: "30px", 
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
          color: colors.darkGray,
          textAlign: "center"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#ffebee",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 20px auto"
          }}>
            <span style={{
              fontSize: "40px",
              color: colors.error,
              fontWeight: "bold"
            }}>!</span>
          </div>
  
          <h2 style={{ 
            color: colors.darkGray, 
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "22px"
          }}>
            Access Denied
          </h2>
          
          <p style={{
            fontSize: "15px",
            color: colors.mediumGray,
            lineHeight: "1.5",
            marginBottom: "24px"
          }}>
            You don't have permission to perform this action. 
            Please contact your administrator for assistance.
          </p>
  
          <button 
            onClick={onClose}
            style={{
              padding: "10px 24px",
              backgroundColor: colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              width: "140px"
            }}
          >
            Okay
          </button>
        </div>
      </div>
    );
  };

  // Edit User Modal component

  const EditUserModal = ({ user, onClose, onSave }) => {

    const dispatch=useDispatch();

    console.log("User to edit:", user.permissions);
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
  
    // Permission categories (using the same structure from CreateUser)
    const permissionCategories = {
      "Art Bank Management": ["add art bank", "view art bank","edit art bank","delete art bank"],
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
      "Manage Users": ["add user", "delete user", "view users","edit user"]
    };
  
    // Mapping between display keys and database keys
    const permissionKeyMap = {
      "Art Bank Management": "artBankManagement",
      "Requisition Management": "requisitionManagement",
      "Sperm Sample Management": "spermSampleManagement",
      "Oocyte Donor Management": "oocyteDonorManagement",
      "Surrogate Management": "surrogateManagement",
      "Manage Users": "manageUsers"
    };
  
    // FIXED: Improved permissions initialization function
    const initializePermissions = () => {
      console.log("User permissions data:", user?.permissions);
      
      if (user && user.permissions) {
        const formattedPermissions = {};
        
        // Iterate through our defined permission categories
        Object.entries(permissionKeyMap).forEach(([displayKey, camelKey]) => {
          // Check if this camelKey exists in the user's permissions
          if (user.permissions[camelKey] && Array.isArray(user.permissions[camelKey])) {
            // Copy the permissions array for this category
            formattedPermissions[displayKey] = [...user.permissions[camelKey]];
          } else {
            // Initialize as empty array if category doesn't exist
            formattedPermissions[displayKey] = [];
          }
        });
        
        return formattedPermissions;
      }
      
      // If user has no permissions object or it's empty, initialize with empty arrays
      const emptyPermissions = {};
      Object.keys(permissionKeyMap).forEach(displayKey => {
        emptyPermissions[displayKey] = [];
      });
      return emptyPermissions;
    };
  
    // Initialize all hooks
    const [formData, setFormData] = useState({
      customerID: user?.customerID || "",
      email: user?.email || "",
      name: user?.username || "", // Map username to name field for consistency
      password: "",
      confirmPassword: "",
      permissions: initializePermissions(),
    });
  
    // Calculate total permissions
    const totalPermissions = useMemo(() => {
      return Object.values(permissionCategories).flat().length;
    }, []);
    
    // Calculate number of selected permissions
    const selectedPermissionsCount = useMemo(() => {
      // Count total permissions from all categories
      let count = 0;
      Object.entries(formData.permissions).forEach(([module, permissions]) => {
        if (Array.isArray(permissions)) {
          count += permissions.length;
        }
      });
      return count;
    }, [formData.permissions]);
  
    // Initialize with all categories expanded for better UX
    const initExpandedCategories = () => {
      const expanded = {};
      Object.keys(permissionCategories).forEach(category => {
        expanded[category] = true;
      });
      return expanded;
    };
  
    const [expandedCategories, setExpandedCategories] = useState(initExpandedCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [changePassword, setChangePassword] = useState(false);
    
    // Return null if user is null - But AFTER all hooks are declared
    if (!user) return null;
  
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
  
    // FIXED: Handle permission selection
    const handlePermissionChange = (module, permission) => {
      console.log(`Toggling permission: ${module} - ${permission}`);
      
      setFormData(prevData => {
        // Create a deep copy of the permissions object
        const updatedPermissions = JSON.parse(JSON.stringify(prevData.permissions));
        
        // Ensure the module exists in the permissions object
        if (!updatedPermissions[module]) {
          updatedPermissions[module] = [];
        }
        
        // Check if the permission is already selected
        const permIndex = updatedPermissions[module].indexOf(permission);
        
        if (permIndex !== -1) {
          // Remove the permission if it exists
          updatedPermissions[module].splice(permIndex, 1);
        } else {
          // Add the permission if it doesn't exist
          updatedPermissions[module].push(permission);
        }
        
        console.log("Updated permissions:", updatedPermissions);
        
        return {
          ...prevData,
          permissions: updatedPermissions
        };
      });
      
      // Clear messages when form is edited
      setSuccessMessage("");
      setErrorMessage("");
    };
    
    // Toggle all permissions in a category
    const toggleAllInCategory = (module) => {
      setFormData((prevData) => {
        // Create a deep copy of the permissions object
        const updatedPermissions = JSON.parse(JSON.stringify(prevData.permissions));
        
        // Ensure the module exists in the permissions object
        if (!updatedPermissions[module]) {
          updatedPermissions[module] = [];
        }
        
        const allModulePermissions = permissionCategories[module];
        
        // Check if all permissions in this module are already selected
        const allSelected = allModulePermissions.every(perm => 
          updatedPermissions[module].includes(perm)
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
        const updatedPermissions = {};
        
        if (selectedPermissionsCount === totalPermissions) {
          // If all permissions are selected, deselect all
          Object.keys(permissionCategories).forEach(module => {
            updatedPermissions[module] = [];
          });
        } else {
          // Otherwise, select all
          Object.entries(permissionCategories).forEach(([module, permissions]) => {
            updatedPermissions[module] = [...permissions];
          });
        }
        
        return { ...prevData, permissions: updatedPermissions };
      });
    };
  
    // Check if all permissions in a category are selected
    const areAllCategoryPermissionsSelected = (module) => {
      const allModulePermissions = permissionCategories[module];
      const currentPermissions = formData.permissions[module] || [];
      
      return allModulePermissions.length > 0 && 
             currentPermissions.length === allModulePermissions.length && 
             allModulePermissions.every(perm => currentPermissions.includes(perm));
    };
    
    // Check if some permissions in a category are selected
    const areSomeCategoryPermissionsSelected = (module) => {
      const currentPermissions = formData.permissions[module] || [];
      return currentPermissions.length > 0 && 
             currentPermissions.length < permissionCategories[module].length;
    };
    
    // Handle form submission
    // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate passwords match if changing password
  if (changePassword && formData.password !== formData.confirmPassword) {
    setErrorMessage("Passwords do not match.");
    setPasswordMatch(false);
    return;
  }

  setIsLoading(true);
  setSuccessMessage("");
  setErrorMessage("");

  try {
    // Transform permissions back to camelCase format
    const transformedPermissions = {};
    Object.entries(formData.permissions).forEach(([displayKey, permissions]) => {
      const camelKey = permissionKeyMap[displayKey];
      if (camelKey) {
        transformedPermissions[camelKey] = permissions;
      }
    });

    // Prepare data for submission
    const dataToSubmit = {
      customerID: formData.customerID,
      email: formData.email,
      username: formData.name,
      permissions: transformedPermissions,
      id: user.id || user._id,
      changePassword: changePassword
    };

    // Only include password if it's being changed and not empty
    if (changePassword && formData.password && formData.password.trim() !== '') {
      dataToSubmit.password = formData.password;
    }

    console.log("Submitting data:", dataToSubmit);

    // API Call to update the user
    const response = await fetch(`https://sudoma-backend-api.onrender.com/api/update-user/${dataToSubmit.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update user");
    }

    setSuccessMessage("User updated successfully!");

    console.log("user_id",user._id)

    // Call onSave to update the parent component's state
    if (onSave) {
      onSave({
        ...user,
        ...dataToSubmit
      });
    }
  } catch (error) {
    console.error("Error:", error);
    setErrorMessage(error.message || "Error updating user. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
    
    // Toggle password change option
    const handleTogglePasswordChange = () => {
      setChangePassword(!changePassword);
      if (!changePassword) {
        setFormData({
          ...formData,
          password: "",
          confirmPassword: ""
        });
        setPasswordMatch(true);
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
      canEditUsers?
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          maxWidth: "800px", 
          width: "90%", 
          maxHeight: "90vh",
          overflow: "auto",
          margin: "0 auto", 
          padding: "30px", 
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
          color: colors.darkGray
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: `2px solid ${colors.border}`,
            paddingBottom: '12px'
          }}>
            <h2 style={{ 
              color: colors.primary, 
              marginTop: 0,
              marginBottom: 0,
              fontSize: "24px"
            }}>
              Edit User
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: colors.mediumGray
              }}
            >
              ×
            </button>
          </div>
          
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
                  style={{...inputStyle, backgroundColor: colors.lightGray}}
                  disabled
                />
                <p style={{ fontSize: '12px', color: colors.mediumGray, margin: '4px 0', marginTop: "-12px" }}>
                  Customer ID cannot be changed
                </p>
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
            
            <div style={{ marginBottom: "24px" }}>
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
            
            <div style={{ 
              marginBottom: "24px",
              display: "flex",
              alignItems: "center"
            }}>
              <input
                type="checkbox"
                id="change-password"
                checked={changePassword}
                onChange={handleTogglePasswordChange}
                style={{...checkboxStyle, marginRight: "10px"}}
              />
              <label
                htmlFor="change-password"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Change Password
              </label>
            </div>
            
            {changePassword && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "6px", 
                    fontSize: "14px", 
                    fontWeight: "600" 
                  }}>
                    New Password
                  </label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required={changePassword}
                    style={{
                      ...inputStyle,
                      border: !passwordMatch && formData.password ? `1px solid ${colors.error}` : `1px solid ${colors.border}`,
                    }}
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
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required={changePassword}
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
              </div>
            )}
  
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
              
              <div style={{ maxHeight: "300px", overflowY: "auto", padding: "4px" }}>
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
                          // Add debugging here to confirm the check state
                          const isChecked = Array.isArray(formData.permissions[module]) && 
                                           formData.permissions[module].includes(permission);
                        
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
                onClick={onClose}
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
                  <span>Saving...</span>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>:
      <AccessDeniedModal onClose={onClose} />
    );
  };
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading users...</div>;
  }

  if (error) {
    return <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      color: 'red', 
      backgroundColor: '#ffebee',
      borderRadius: '4px'
    }}>Error: {error}</div>;
  }

  return (
    accessToThisPage?
    <div style={{ 
      maxWidth: "1000px", 
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
        Manage Users
      </h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: colors.lightGray,
              borderBottom: `2px solid ${colors.border}`
            }}>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left',
                fontWeight: '600'
              }}>Customer ID</th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left',
                fontWeight: '600'
              }}>Username</th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left',
                fontWeight: '600'
              }}>Email</th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center',
                fontWeight: '600'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id} style={{ 
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <td style={{ padding: '12px 16px' }}>{user.customerID}</td>
                  <td style={{ padding: '12px 16px' }}>{user.username}</td>
                  <td style={{ padding: '12px 16px' }}>{user.email}</td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <button 
                      onClick={() => handleView(user)}
                      style={{
                        padding: '6px 12px',
                        background: colors.lightGray,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: colors.darkGray,
                        fontSize: '13px'
                      }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(user._id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e3f2fd',
                        border: '1px solid #90caf9',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#1976d2',
                        fontSize: '13px'
                      }}
                    >
                      Edit
                    </button>
                    {tempuser.permissions.manageUsers.includes('delete user')?
                    <button 
                      onClick={() => handleDelete(user._id)}
                      style={{
                        padding: '6px 12px',
                        background: '#ffebee',
                        border: '1px solid #ffcdd2',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#c62828',
                        fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>:null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  color: colors.mediumGray
                }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetails && selectedUser && 
        <UserDetailsModal user={selectedUser} onClose={handleCloseDetails} />
      }
      
      {showEditModal && editingUser && 
        <EditUserModal 
          user={editingUser} 
          onClose={handleCloseEdit} 
          onSave={handleSaveUser} 
        />
      }
    </div>:
    <AccessDenied />
  );
} 