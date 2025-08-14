import React, { useEffect } from "react";
import { useAuth } from "../../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import './ProfileStyle/Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    // Redirect to home if user logs out
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const goToSettings = () => {
        navigate("/settings");
    };

    return (
        <div className="profile-container" style={{ padding: '2rem' }}>
            <h2>{user?.name || 'User'}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><button onClick={goToSettings}>Settings</button></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </div>
    );
};

export default Profile;
