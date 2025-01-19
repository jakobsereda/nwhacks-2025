import React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import Map from "./images/landing-map.png";
import Group from "./images/people.png";
import Heart from "./images/Heart.png";

import { Link } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
}

const Landing: React.FC = () => {
  const [ showModal, setShowModal ] = useState(false);
  const [ formData, setFormData ] = useState<FormData>({ name: "", email: "" });
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ successMessage, setSuccessMessage ] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      setSuccessMessage("User created successfully!");
      setFormData({ name: "", email: "" });
      setShowModal(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="banner">
        <h1>Out&About</h1>
        <div className="login-button">
            <h2>
              <Link to="/Home">Log In</Link>
            </h2>
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
              Find activities <br/>
              you'll love
            </h1>

            <div id="signup-button">
              <button onClick={() => setShowModal(true)}>Sign Up</button>
            </div>
          </div>
        </div>
        <img src={Map} alt="Map Pic" className="general-image" />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="button" onClick={() => setShowModal(false)}>
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
