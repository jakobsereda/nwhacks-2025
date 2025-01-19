import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Map from "./images/landing-map.png";
import Group from "./images/people.png";
import Heart from "./images/Heart.png";

interface FormData {
  name: string;
  email?: string;
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      setSuccessMessage("User created successfully!");
      setFormData({ name: "", email: "" });
      setShowSignUpModal(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleLoginSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
      localStorage.setItem("userId", data.user_id);

      setSuccessMessage("Login successful!");
      setShowLoginModal(false);
      navigate("/Home");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="banner">
        <h1 className="banner-title">Out&About</h1>
        <div id="login-button">
          <button onClick={() => setShowLoginModal(true)}>Log In</button>
        </div>
      </div>

      <div id="landing-body">
        <div id="landing-body-text">
          <h2>See what events are happening near you!</h2>

          <div id="icon-row">
            <img src={Group} alt="people-icon" id="icon" />
            <h3>Meet New Friends</h3>
          </div>

          <div id="icon-row">
            <img src={Heart} alt="people-icon" id="icon" />
            <h3>Join the local community</h3>
          </div>

          <div id="cta-section">
            <h1>
              Find activities <br />
              you'll love
            </h1>

            <div id="signup-button">
              <button onClick={() => setShowSignUpModal(true)}>Sign Up</button>
            </div>
          </div>
        </div>
        <img src={Map} alt="Map Pic" className="general-image" />
      </div>

      {showSignUpModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowSignUpModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Log In</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Log In</button>
                <button type="button" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Landing;
