import PropTypes from 'prop-types';
import Navbar from './Navbar';
import DonateFloatingButton from './DonateFloatingButton';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialDonationStatus = params.get("donation");

  const [donationStatus, setDonationStatus] = useState(initialDonationStatus);

  const showNavbar = location.pathname !== '/login';

  useEffect(() => {
    if (initialDonationStatus === "success") {
      const timer = setTimeout(() => {
        // Remove query param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("donation");
        window.history.replaceState({}, "", url.toString());

        // Hide the banner
        setDonationStatus(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [initialDonationStatus]);

  return (
    <div className="layout">
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
        <DonateFloatingButton />

        {donationStatus === "success" && (
          <div className="thank-you-banner">
            ❤️ Thank you for your donation! We appreciate your support.
          </div>
        )}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
