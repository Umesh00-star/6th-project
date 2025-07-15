import axios from 'axios';

function DeleteAccountButton({ userId }) {
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      alert("Account deleted.");
      // Optionally redirect or log out the user
      // window.location.href = "/login"; // Redirect to login page after delete
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Error deleting account");
    }
  };

  return <button onClick={handleDelete}>Delete My Account</button>;
}

export default DeleteAccountButton;
