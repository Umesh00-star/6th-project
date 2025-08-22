import axios from 'axios';

const API_BASE = "http://localhost:8080/api";




//  Login Shop

export const loginShop = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/shop/login`, { email, password });
      const {token, shop} =res.data;
    // Store token in localStorage
    // localStorage.setItem('token', res.data.token);

    // // Optionally store user if your backend sends it (check this!)
    // if (res.data.user) {
    //   localStorage.setItem('user', JSON.stringify(res.data.user));
    // }

     if (token) localStorage.setItem("shop_token", token);
    if (shop) localStorage.setItem("shop", JSON.stringify(shop));

        return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed"
    };
  }
};


//  Register User

export const registerShop= async (name, email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/shop/register`, {
      name: name,
      email,
      password,
    });

    // Store token in localStorage
    // localStorage.setItem('token', res.data.token);

    // Optionally store user if backend sends it
    // if (res.data.user) {
    //   localStorage.setItem('user', JSON.stringify(res.data.user));
    // }

     const { token, shop } = res.data;

    if (token) localStorage.setItem("shop_token", token);
    if (shop) localStorage.setItem("shop", JSON.stringify(shop));

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
  localStorage.removeItem('shop_token');
  localStorage.removeItem('shop');
};


// Check Login Status

// export const isloggedIn = () => {
//   return !!localStorage.getItem('token');
// };

export const isloggedIn = () => !!localStorage.getItem("shop_token");


// ✅ Get User Profile (by ID)

export const getShopProfile = async (id) => {
  try {
    const token = localStorage.getItem("shop_token");

    // const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        const res = await axios.get(`${API_BASE}/shops/${id}`, {
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

export const updateShopProfile = async (id, updateData) => {
  try {
    const token = localStorage.getItem("shop_token");

    // const res = await axios.put(`http://localhost:8080/api/users/${id}`, updateData, {
     const res = await axios.put(`${API_BASE}/shops/${id}`, updateData, { 
    headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  

    // Optionally update local user data
    localStorage.setItem("shop", JSON.stringify(res.data));

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update profile",
    };
  }
};
