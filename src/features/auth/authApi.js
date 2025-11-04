export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchUser(userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:4000/api/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function loginUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // For cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log(data);
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/check', {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.json();
        console.log(error);
        reject(error.message || 'Session invalid or expired');
      }
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}

// Password Reset Request
export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:4000/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset password email');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}

// Reset Password
export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`http://localhost:4000/api/reset-password/${data.id}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: data }),
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      const result = await response.json();
      resolve({ data: result });
    } catch (error) {
      reject(error.message || 'Network error');
    }
  });
}