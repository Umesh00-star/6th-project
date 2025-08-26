import React, { useState, useEffect } from "react";
import { useAuth } from "../../Authentication/AuthLogic";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../Authentication/Auth";
import Shops from "../../Owners/Shops";
import './ProfileStyle/Update.css';


const UpdateProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full user data on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);
      const res = await getUserProfile(user.id);

      if (res.success) {
        const data = res.data;
        setName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setIsSeller(data.role === "shop");
        setShopName(data.shop?.name || "");
        setShopDesc(data.shop?.description || "");
      } else {
        setError(res.message || "Failed to load profile.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      fullName: name,
      email,
      phone,
      role: isSeller ? "shop" : "user",
      shop: isSeller ? { name: shopName, description: shopDesc } : null,
    };

    const res = await updateUserProfile(user.id, updateData);


if (res.success) {
  updateUser(res.data);

  if (res.data.role === "shop") {
    navigate("/shops"); // or whatever your route is
  } else {
    navigate("/profiles");
  }
}

     else {
      alert(res.message || "Failed to update profile.");
    }
  };

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="update-profile-container" style={{ padding: "2rem" }}>

      <h2>Update Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
         {/* <input
          value={name}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Address"
          required
        /> */}

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
