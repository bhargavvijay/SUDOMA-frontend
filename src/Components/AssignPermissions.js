import React, { useState, useMemo } from "react";

// Color scheme
const colors = {
  primary: "#ee3f65",
  secondary: "#a6a8ab",
  darkGray: "#444444",
  mediumGray: "#777777",
  lightGray: "#f7f7f7",
  border: "#e5e5e5",
  white: "#ffffff",
  accent: "#f9edef" // Light version of primary for subtle highlights
};

// Group related permissions into categories for better organization
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
  ]
};

const AssignPermissions = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [permissions, setPermissions] = useState({});
  const allPages = useMemo(() => 
    Object.values(permissionCategories).flat(), 
    []
  );

  // Calculate if all permissions are selected
  const areAllSelected = useMemo(() => {
    return allPages.every(page => permissions[page]);
  }, [permissions, allPages]);

  // Calculate if some permissions are selected (for indeterminate state)
  const areSomeSelected = useMemo(() => {
    return allPages.some(page => permissions[page]) && !areAllSelected;
  }, [permissions, allPages, areAllSelected]);

  // Toggle individual permission
  const handlePermissionChange = (page) => {
    setPermissions(prev => ({
      ...prev,
      [page]: !prev[page]
    }));
  };

  // Toggle all permissions
  const handleSelectAll = () => {
    const newState = !areAllSelected;
    const updatedPermissions = {};
    allPages.forEach(page => updatedPermissions[page] = newState);
    setPermissions(updatedPermissions);
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle all permissions in a category
  const toggleCategoryPermissions = (category) => {
    const categoryPages = permissionCategories[category];
    const allCategorySelected = categoryPages.every(page => permissions[page]);
    
    const updatedPermissions = { ...permissions };
    categoryPages.forEach(page => {
      updatedPermissions[page] = !allCategorySelected;
    });
    
    setPermissions(updatedPermissions);
  };

  // Check if all permissions in a category are selected
  const isCategoryAllSelected = (category) => {
    return permissionCategories[category].every(page => permissions[page]);
  };

  // Check if some permissions in a category are selected
  const isCategorySomeSelected = (category) => {
    const categoryPages = permissionCategories[category];
    return categoryPages.some(page => permissions[page]) && 
           !categoryPages.every(page => permissions[page]);
  };

  const handleSave = () => {
    console.log("Permissions saved:", permissions);
    alert("Permissions saved successfully!");
  };

  // Custom checkbox styles with subtle primary color accent
  const checkboxStyle = {
    accentColor: colors.primary,
    width: "16px",
    height: "16px",
    cursor: "pointer"
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: colors.darkGray
    }}>
      <h1 style={{
        color: colors.darkGray,
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: "12px",
        marginBottom: "24px"
      }}>
        Permissions Manager
      </h1>
      
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        padding: "12px 16px",
        backgroundColor: colors.lightGray,
        borderRadius: "6px",
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            id="selectAll"
            checked={areAllSelected}
            ref={el => {
              if (el) {
                el.indeterminate = areSomeSelected;
              }
            }}
            onChange={handleSelectAll}
            style={{ ...checkboxStyle, marginRight: "12px" }}
          />
          <label htmlFor="selectAll" style={{ 
            cursor: "pointer", 
            fontWeight: "600",
            color: areAllSelected ? colors.primary : colors.darkGray
          }}>
            {areAllSelected ? "Deselect All" : "Select All"} Permissions
          </label>
        </div>
        
        <button
          onClick={handleSave}
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
          Save Permissions
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {Object.entries(permissionCategories).map(([category, pages]) => (
          <div 
            key={category}
            style={{ 
              marginBottom: "16px",
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              overflow: "hidden"
            }}
          >
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 16px",
                backgroundColor: isCategoryAllSelected(category) ? colors.accent : colors.lightGray,
                cursor: "pointer",
                userSelect: "none",
                borderBottom: expandedCategories[category] ? `1px solid ${colors.border}` : "none",
                transition: "background-color 0.2s ease"
              }}
              onClick={() => toggleCategory(category)}
            >
              <div style={{ marginRight: "14px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={isCategoryAllSelected(category)}
                  ref={el => {
                    if (el) {
                      el.indeterminate = isCategorySomeSelected(category);
                    }
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleCategoryPermissions(category);
                  }}
                  style={checkboxStyle}
                />
              </div>
              
              <h3 style={{ 
                margin: 0, 
                flex: 1,
                fontWeight: "600",
                fontSize: "16px",
                color: isCategoryAllSelected(category) ? colors.primary : colors.darkGray
              }}>
                {category}
              </h3>
              
              <span style={{ 
                color: colors.secondary,
                fontSize: "13px",
                marginRight: "12px",
                fontWeight: "500"
              }}>
                {permissionCategories[category].filter(page => permissions[page]).length} / {permissionCategories[category].length}
              </span>
              
              <span style={{ color: colors.secondary, fontSize: "10px" }}>
                {expandedCategories[category] ? "▼" : "►"}
              </span>
            </div>
            
            {expandedCategories[category] && (
              <div style={{ 
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "12px",
                backgroundColor: colors.white
              }}>
                {pages.map((page) => {
                  const isSelected = permissions[page] || false;
                  return (
                    <div 
                      key={page}
                      style={{ 
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        borderRadius: "4px",
                        backgroundColor: isSelected ? colors.accent : colors.white,
                        border: `1px solid ${isSelected ? colors.primary : colors.border}`,
                        transition: "all 0.2s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`perm-${page}`}
                        checked={isSelected}
                        onChange={() => handlePermissionChange(page)}
                        style={{ ...checkboxStyle, marginRight: "10px" }}
                      />
                      <label 
                        htmlFor={`perm-${page}`}
                        style={{ 
                          cursor: "pointer",
                          flex: 1,
                          textTransform: "capitalize",
                          fontSize: "14px",
                          color: isSelected ? colors.darkGray : colors.mediumGray
                        }}
                      >
                        {page}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: "30px",
        padding: "20px 0",
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: `2px solid ${colors.primary}`,
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.color = colors.white;
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = colors.white;
            e.currentTarget.style.color = colors.primary;
          }}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default AssignPermissions;