import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-light px-5 mt-auto"> {/* Add mt-auto class to push footer to bottom */}
      <div className=" py-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Contact Us</h2>
            <div className="contact-info">
              <div className="contact-item d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                <p className="m-0">123 Main Street, City, Country</p>
              </div>
              <div className="contact-item d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                <p className="m-0">(123) 456-7890</p>
              </div>
              <div className="contact-item d-flex align-items-center">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                <p className="m-0">info@cafename.com</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h2>Connect With Us</h2>
            <div className="social-icons">
              <a href="https://www.facebook.com/cafename" target="_blank" rel="noopener noreferrer" className="me-3">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://www.twitter.com/cafename" target="_blank" rel="noopener noreferrer" className="me-3">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.instagram.com/cafename" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-3 bg-success">
        <div className="text-center">
          <p className="m-0">&copy; 2024 LiveLifeOrganics. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
