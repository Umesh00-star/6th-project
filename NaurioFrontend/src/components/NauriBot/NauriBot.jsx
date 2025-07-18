import React from 'react';
import { motion } from 'framer-motion';
import './NauriBot.css'; // Make sure to create this or paste the CSS below in your existing NauriBot.css
import { Link } from 'react-router-dom';


function NauriBot() {
  const handleChatClick = () => {
    alert('Hi! NauriBot here. How can I help you today? 🤖');
  };

  return (
    <section className="nauri-section">
      <motion.div
        className="nauri-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2>Meet NauriBot</h2>
        <p>The most responsive AI bot in Ecommerce - Here to help you shop smarter, faster!</p>
        <Link to="/Bot" className="nauri-button" >
          Chat with NauriBot
        </Link>
      </motion.div>
    </section>
  );
}

export default NauriBot;
