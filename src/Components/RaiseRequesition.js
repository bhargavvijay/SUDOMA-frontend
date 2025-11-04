import React from "react";
import { Link } from "react-router-dom";

export const RaiseRequisition = () => {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
            backgroundColor: "#ee3f65",
            padding: "10px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          Raise Requisition
        </h1>
        <ul style={{ padding: "10px", margin: "0" }}>
          <li style={{ marginBottom: "10px", listStyle: "none" }}>
            <Link
              to="/raise-requisition/sperm"
              style={{
                textDecoration: "none",
                color: "#ee3f65",
                fontSize: "18px",
                fontWeight: "500",
                display: "block",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e7f1ff")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
            >
              Sperm
            </Link>
          </li>
          <li style={{ marginBottom: "10px", listStyle: "none" }}>
            <Link
              to="/raise-requisition/ocyte"
              style={{
                textDecoration: "none",
                color: "#ee3f65",
                fontSize: "18px",
                fontWeight: "500",
                display: "block",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e7f1ff")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
            >
              Oocyte
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
            <Link
              to="/raise-requisition/surrogate"
              style={{
                textDecoration: "none",
                color: "#ee3f65",
                fontSize: "18px",
                fontWeight: "500",
                display: "block",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e7f1ff")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
            >
              Surrogate
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
