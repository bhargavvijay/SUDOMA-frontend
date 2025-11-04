// Add a new ART Bank
export function addARTBank(artBankData) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      for (const key in artBankData) {
        formData.append(key, artBankData[key]);
      }

      const response = await fetch('http://localhost:4000/api/add-art-bank', {
        method: 'POST',
        body: formData,
        credentials: "include",
        // Sending FormData for file upload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add ART bank');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}

// Fetch all ART Banks
export function fetchAllARTBanks() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:4000/api/fetch-art-banks', {
        method: 'GET',
        credentials: 'include', // Include credentials for CORS requests
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch ART banks');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}

// Delete an ART Bank by ID
export function deleteARTBankById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`http://localhost:4000/api/remove-art-bank/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete ART bank');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}

// Edit/Update an ART Bank by ID
// export function editARTBankById(id, updatedData) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       console.log(`updatedData:${updatedData}`);
//       const formData = new FormData();
//       for (const key in updatedData) {
//         formData.append(key, updatedData[key]);
//       }      
//       console.log(formData)


//       const response = await fetch(`http://localhost:4000/api/edit-bank/${id}`, {
//         method: 'PATCH',
//         body: formData, // Send as FormData for partial updates
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to edit ART bank');
//       }

//       const data = await response.json();
//       resolve({ data });
//     } catch (error) {
//       reject(error.message || 'Network error');
//     }
//   });
// }
  
export function editARTBankById(id, updatedData) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Making request to edit ART bank with ID: ${id}`);
      
      const response = await fetch(`http://localhost:4000/api/edit-bank/${id}`, {
        method: 'PATCH',
        body: updatedData,
        credentials: "include",

      });

      // Read the response only once
      let responseData;
      
      if (!response.ok) {
        // Try to read the error response
        if (response.headers.get('content-type')?.includes('application/json')) {
          responseData = await response.json();
          throw new Error(responseData.message || 'Failed to edit ART bank');
        } else {
          const text = await response.text();
          throw new Error(`Server error: ${text}`);
        }
      }
      
      // Parse JSON response
      responseData = await response.json();
      resolve({ data: responseData });
    } catch (error) {
      console.error('Error editing ART bank:', error);
      reject(error);
    }
  });
}