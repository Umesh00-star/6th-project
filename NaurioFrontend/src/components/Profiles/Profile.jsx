import React from "react";
import { useAuth } from "../../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";

const Profile = () => {
    const { user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToSettings = () => {
        navigate("/settings");
    };

return (
    <div style ={{padding:'2erm'}}>
        <h2>{user?.name || 'User'}</h2>

        <ul style={{listStyle:'none',padding:0}}>
            <li><button onClick = {goToSettings}>Settings</button></li>
            <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
    </div>
);

};


export default Profile;