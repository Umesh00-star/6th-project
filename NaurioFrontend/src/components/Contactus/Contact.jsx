import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission (you can hook this to an API)
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ fullName: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">📬 Contact Us</h2>

      {submitted && (
        <p className="success-message">Thanks for reaching out! We'll get back to you soon.</p>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your Full Name"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email Address"
          required
        />

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
