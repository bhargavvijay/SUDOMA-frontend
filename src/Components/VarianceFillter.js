import React from "react";

const VarianceFilter = ({ heightVariance, setHeightVariance,handleFindMatches, weightVariance, setWeightVariance, selectedRequisition }) => {
  const height = selectedRequisition.height;
  const weight = selectedRequisition.weight;

  const handleHeightVarianceChange = (e) => {
    setHeightVariance(Number(e.target.value));
  };

  const handleWeightVarianceChange = (e) => {
    setWeightVariance(Number(e.target.value));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters with:", {
      heightVariance,
      weightVariance
    });
    handleFindMatches(selectedRequisition);
  };

  // Predefined variance options
  const varianceOptions = [];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        overflow: "hidden", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "",
        margin: "0 auto"
      }}>
        <div style={{ 
          backgroundColor: "grey", 
          color: "white", 
          padding: "15px" 
        }}>
          <h5 style={{ margin: "0 0 5px 0" }}>
            Selected Requisition:
          </h5>
          <p style={{ margin: "5px 0" }}>
            Height: {height} cm | Weight: {weight} kg | Blood Group: {selectedRequisition.bloodGroup}   
          </p>
        </div>
        
        <div style={{ 
          padding: "15px",
          backgroundColor: "#f8f9fa"
        }}>
          <h6 style={{ 
            borderBottom: "1px solid #ee3f65", 
            paddingBottom: "10px", 
            marginTop: "0" 
          }}>
            Filter by Variance
          </h6>
          
          <div style={{ marginBottom: "15px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "10px" ,
            }}>
              <label><strong>Height Variance (cm):</strong></label>
              <div>
                <input
                  type="number"
                  value={heightVariance}
                  onChange={handleHeightVarianceChange}
                  style={{ 
                    width: "60px", 
                    textAlign: "center", 
                    padding: "5px", 
                    marginRight: "10px" ,
                    marginLeft: "10px"
                  }}
                />
                <span>({Math.round(height - heightVariance)} - {Math.round(height + heightVariance)} cm)</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              {varianceOptions.map(value => (
                <label key={`height-${value}`} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}>
                  <input
                    type="radio"
                    name="heightVariance"
                    value={value}
                    checked={heightVariance === value}
                    onChange={handleHeightVarianceChange}
                    style={{ marginRight: "5px" ,marginLeft: "10px"}}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "10px" 
            }}>
              <label><strong>Weight Variance (kg):</strong></label>
              <div>
                <input
                  type="number"
                  value={weightVariance}
                  onChange={handleWeightVarianceChange}
                  style={{ 
                    width: "60px", 
                    textAlign: "center", 
                    padding: "5px", 
                    marginLeft: "10px" ,
                    marginRight: "10px" 
                  }}
                />
                <span>({Math.round(weight - weightVariance)} - {Math.round(weight + weightVariance)} kg)</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              {varianceOptions.map(value => (
                <label key={`weight-${value}`} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}>
                  <input
                    type="radio"
                    name="weightVariance"
                    value={value}
                    checked={weightVariance === value}
                    onChange={handleWeightVarianceChange}
                    style={{ marginRight: "5px" }}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleApplyFilters}
            style={{ 
              backgroundColor: "#ee3f65", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              padding: "8px 15px", 
              cursor: "pointer" 
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default VarianceFilter;