import React from "react";
import { Link } from "react-router-dom";

export const ManageDonorRequirement = () => {
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "700px", // Increased max-width for a more balanced layout
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const headerStyle = {
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center",
    padding: "20px", // Increased padding for a more prominent header
    fontSize: "24px", // Increased font size for better readability
    fontWeight: "bold",
  };

  const menuItemStyle = {
    padding: "18px 20px", // Increased padding for better spacing
    borderBottom: "1px solid #e9ecef",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textDecoration: "none", // Remove underline from links
    transition: "background-color 0.2s",
  };

  const menuItemHoverStyle = {
    backgroundColor: "#f1f3f5",
  };

  const labelStyle = {
    fontSize: "18px", // Kept font size consistent
    color: "#333",
    fontWeight: "bold",
  };

  const descriptionStyle = {
    fontSize: "15px", // Increased font size for better readability
    color: "#6c757d",
    marginTop: "6px", // Increased margin for better spacing
  };

  const iconStyle = {
    color: "#6c757d",
    fontSize: "24px",
  };

  const menuItems = [
    {
      path: "/raise-requisition",
      label: "Raise Requisition",
      description: "Create a new donor requirement",
    },
    {
      path: "/view-requisitions/sperm",
      label: "View Sperm Requisitions",
      description: "View and manage sperm donor requests",
    },
    {
      path: "/view-requisitions/ocyte",
      label: "View Oocyte Requisitions",
      description: "View and manage egg donor requests",
    },
    {
      path: "/view-requisitions/surrogate",
      label: "View Surrogate Requisitions",
      description: "View and manage surrogate requests",
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>Manage Donor Requirement</div>

        <div>
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              style={menuItemStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <div>
                <div style={labelStyle}>{item.label}</div>
                <div style={descriptionStyle}>{item.description}</div>
              </div>
              <div style={iconStyle}>➔</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageDonorRequirement;
