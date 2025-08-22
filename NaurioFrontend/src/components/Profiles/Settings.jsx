import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authentication/AuthLogic";
import UpdateProfile from "./UpdateProfile";

const Settings = () => {
    const  {user, updateuser, deleteuser} = useAuth();
    const navigate = useNavigate();

    // const handleUpdateProfile = () => {
    //     navigate("/update-profile");
    // };


    const handleUpdateProfile = () => {
        navigate("/UpdateProfile");
    };


    const handleDeleteAccount = () =>
    {
        if (window.confirm ("Are you sure you want to delete your Account?")) 
        {
            deleteuser(user.id); // implementation in the authlogic
            navigate("/signup");
        }
    };

    return (
        <div style={{padding:"2rem"}}>
            <h2>Settings</h2>
            <ul style={{ listStyle:"none", padding: 0}}>

                <li style={{ marginBottom:"1rem"}}>
                <button onClick={handleUpdateProfile}> Update </button>
                </li>
            </ul>
           <li>
  <button
    onClick={async () => {
      if (!user || !user.id) {
        alert("User not found.");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (confirmDelete) {
        try {
          await deleteuser(user.id); // This will be added in step 2
          alert("Account deleted successfully.");
          navigate("/signup"); // Redirect to signup page
        } catch (err) {
          console.error("Failed to delete account:", err);
          alert("Failed to delete account. Please try again.");
        }
      }
    }}
    style={{ color: "red" }}
  >
    Delete
  </button>
</li>

        </div>
    );

};


export default Settings;