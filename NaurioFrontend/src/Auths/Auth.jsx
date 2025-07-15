import axios from 'axios';

const API_BASE = "http://localhost:8080/api/auth";

// ============================
// ✅ Login User
// ============================
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });

    // Store token in localStorage
    localStorage.setItem('token', res.data.token);

    // Optionally store user if your backend sends it (check this!)
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed',
    };
  }
};

// ============================
// ✅ Register User
// ============================
export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/register`, {
      fullName: name,
      email,
      password,
    });

    // Store token in localStorage
    localStorage.setItem('token', res.data.token);

    // Optionally store user if backend sends it
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Signup failed',
    };
  }
};

// ============================
// ✅ Logout
// ============================
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


// ✅ Check Login Status

export const isloggedIn = () => {
  return !!localStorage.getItem('token');
};


// ✅ Get User Profile (by ID)

export const getUserProfile = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch user",
    };
  }
};


// 🔄 Optional: Update User Profile

export const updateUserProfile = async (id, updateData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(`http://localhost:8080/api/users/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Optionally update local user data
    localStorage.setItem("user", JSON.stringify(res.data));


    

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update profile",
    };
  }
};
