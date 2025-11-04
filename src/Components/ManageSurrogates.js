import React from "react";
import { Link } from "react-router-dom";

export const ManageSurrogates = () => {
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    overflow: "hidden",
  };

  const headerStyle = {
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center",
    padding: "25px",
    fontSize: "26px",
    fontWeight: "bold",
  };

  const menuItemStyle = {
    padding: "20px",
    borderBottom: "1px solid #ecf0f1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
  };

  const menuItemHoverStyle = {
    backgroundColor: "#f7f9fa",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const primaryLabelStyle = {
    color: "#2c3e50",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
  };

  const secondaryLabelStyle = {
    color: "#7f8c8d",
    fontSize: "14px",
  };

  const arrowStyle = {
    fontSize: "20px",
    color: "#3498db",
  };

  const menuItems = [
    { 
      path: "/recruit-surrogate", 
      label: "Recruit Surrogate", 
      description: "Register a new surrogate" 
    },
    { 
      path: "/receive-surrogate", 
      label: "Receive Surrogate", 
      description: "Receiving incoming surrogates" 
    },
    { 
      path: "/allocate-surrogate", 
      label: "Allocate Surrogate", 
      description: "Process and allocate surrogates" 
    },
    { 
      path: "/delete-surrogate", 
      label: "Delete Surrogate", 
      description: "Remove surrogate from inventory" 
    },
    { 
      path: "/view-received-surrogates", 
      label: "View Received Surrogates", 
      description: "List of all received surrogates" 
    },
    { 
      path: "/view-recruited-surrogates", 
      label: "View Recruited Surrogates", 
      description: "List of all recruited surrogates" 
    },
    { 
      path: "/view-allocated-surrogates", 
      label: "View Allocated Surrogates", 
      description: "List of all allocated surrogates" 
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Accessible Header */}
        <div 
          style={headerStyle}
          role="banner"
        >
          Manage Surrogates
        </div>

        {/* Navigation Menu */}
        <nav aria-label="Surrogate Management">
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              style={{
                ...menuItemStyle,
                ...(index === menuItems.length - 1 ? { borderBottom: 'none' } : {})
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label={`Navigate to ${item.label}`}
            >
              <div style={labelStyle}>
                <span style={primaryLabelStyle}>{item.label}</span>
                <span style={secondaryLabelStyle}>{item.description}</span>
              </div>
              <span style={arrowStyle}>➔</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ManageSurrogates;