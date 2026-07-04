import React from 'react'
import "./Footer.css";

const Footer = () => {
  return (
  <footer className="footer">
  <div className="footer-container">

    <div className="footer-section">
      <h2>EventHub</h2>
      <p>Manage and book amazing events easily.</p>
    </div>

    <div className="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/event">Events</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contectus">Contact</a></li>
        <li><a href="/gallary">Gallery</a></li>
      </ul>
    </div>

    <div className="footer-section">
      <h3>Contact</h3>
      <p>Email: info@eventhub.com</p>
      <p>Phone: +91 9876543210</p>
    </div>

    <div className="footer-section">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <i className="fab fa-facebook"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-linkedin"></i>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 EventHub. All Rights Reserved.
  </div>
</footer>
  )
}

export default Footer