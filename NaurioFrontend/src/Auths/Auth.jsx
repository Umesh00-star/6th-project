import axios from 'axios';

const API_BASE = "http://localhost:8080/api";

//  Login User

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const {token, user} =res.data;
    // Store token in localStorage
    // localStorage.setItem('token', res.data.token);

    // // Optionally store user if your backend sends it (check this!)
    // if (res.data.user) {
    //   localStorage.setItem('user', JSON.stringify(res.data.user));
    // }

     if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));

        return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed"
    };
  }
};


//  Register User

export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      fullName: name,
      email,
      password,
    });

    // Store token in localStorage
    // localStorage.setItem('token', res.data.token);

    // Optionally store user if backend sends it
    // if (res.data.user) {
    //   localStorage.setItem('user', JSON.stringify(res.data.user));
    // }

     const { token, user } = res.data;

    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message ||" Signup failed"
    };
  }
};


//  Logout

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


// Check Login Status

// export const isloggedIn = () => {
//   return !!localStorage.getItem('token');
// };

export const isloggedIn = () => !!localStorage.getItem("token");


// ✅ Get User Profile (by ID)

export const getUserProfile = async (id) => {
  try {
    const token = localStorage.getItem("token");

    // const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        const res = await axios.get(`${API_BASE}/users/${id}`, {
    headers: {
        Authorization: `Bearer ${token}`
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch user"
    };
  }
};


//  Update User Profile

export const updateUserProfile = async (id, updateData) => {
  try {
    const token = localStorage.getItem("token");

    // const res = await axios.put(`http://localhost:8080/api/users/${id}`, updateData, {
     const res = await axios.put(`${API_BASE}/users/${id}`, updateData, { 
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
