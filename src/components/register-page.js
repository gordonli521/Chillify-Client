import "../styling/register-page.css";
import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Application } from "../App";
import logo from "../logo4.png";
import Loading from "./loading";
import { API_URL, APP_URL } from "../url";

const RegisterPage = ({ setRegisterSuccess }) => {
  const { setShowPlaybar } = useContext(Application);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const handlePassword2 = (e) => {
    e.preventDefault();
    setPassword2(e.target.value);
  };

  const fetchRegisterInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password2,
        }),
      });
      const data = await response.json();
      if (data.msg === "success") {
        setRegisterSuccess(true);
      } else {
        setError(data.msg);
        setRegisterSuccess(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    fetchRegisterInfo();
  };

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      window.location = `${APP_URL}/home`;
    }
    setShowPlaybar(false);
    setError("");
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="register-page-container">
      <Link to="/">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="login-title">
            <h1>Chillify</h1>
          </div>
        </div>
      </Link>

      <div className="register-container">
        <div className="signup-message">
          <p>Sign up for free to start listening.</p>
        </div>
        <form className="form" onSubmit={handleRegister}>
          {error.length > 0 ? (
            <div className="display-error-container">
              <div className="display-error">{error}</div>
            </div>
          ) : (
            ""
          )}
          <div className="name">
            <label>Name: </label>
            <input
              className="highlight-input"
              type="text"
              value={name}
              id="name"
              name="name"
              autoComplete="off"
              required
              onChange={handleName}
            />
          </div>
          <div className="email">
            <label>Email: </label>
            <input
              className="highlight-input"
              type="email"
              value={email}
              id="email"
              name="email"
              autoComplete="off"
              required
              onChange={handleEmail}
            />
          </div>
          <div className="password">
            <label>Password: </label>
            <input
              className="highlight-input"
              type="password"
              value={password}
              id="password"
              name="password"
              autoComplete="off"
              required
              onChange={handlePassword}
            />
          </div>
          <div className="password">
            <label>Confirm password: </label>
            <input
              className="highlight-input"
              type="password"
              value={password2}
              id="password2"
              name="password2"
              autoComplete="off"
              required
              onChange={handlePassword2}
            />
          </div>
          <div className="button-container">
            <button className="submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
        <div className="login-info">
          <div className="login-text">Have an account?</div>
          <Link to="/login" className="register-login-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
