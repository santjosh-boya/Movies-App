import {FaGoogle, FaInstagram, FaTwitter, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="social-icon-container">
      <FaGoogle className="social-icon" />
      <FaTwitter className="social-icon" />
      <FaInstagram className="social-icon" />
      <FaYoutube className="social-icon" />
    </div>
    <p className="footer-description">Contact Us</p>
  </div>
)

export default Footer
