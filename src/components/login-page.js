import React, { useState, useEffect, useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import "../styling/login-page.css";
import { Link } from "react-router-dom";
import { Application } from "../App";
import logo from "../logo4.png";
import Loading from "./loading";
import { API_URL, APP_URL } from "../url";

const LoginPage = ({ setLoginSuccess, setError, error }) => {
  const { setShowPlaybar } = useContext(Application);

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(true);

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const fetchLoginInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });
      const data = await response.json();
      if (!data.msg) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoginSuccess(true);
      } else {
        setError(data.msg);
        setLoginSuccess(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLoginInfo();
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    let demoEmail = "DemoEmail@demo.com";
    let demoPassword = "demoPassword";

    const emailAddressInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    let i = 0;

    const emailTyper = () => {
      if (i < demoEmail.length) {
        emailAddressInput.value += demoEmail[i];
        i++;
        setTimeout(emailTyper, 100);
      }
    };

    emailTyper();

    let j = 0;
    const passwordTyper = () => {
      if (j < demoPassword.length) {
        passwordInput.value += demoPassword[j];
        j++;
        setTimeout(passwordTyper, 100);
      }
    };

    setTimeout(() => {
      passwordTyper();
    }, 2200);
    setTimeout(() => {
      const fetchDemoLoginInfo = async () => {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "DemoEmail@demo.com",
              password: "demoPassword",
            }),
          });
          const data = await response.json();
          if (!data.msg) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setLoginSuccess(true);
          } else {
            setError(data.msg);
            setLoginSuccess(false);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchDemoLoginInfo();
    }, 3600);
  };

  useEffect(() => {
    setLoading(true);
    // if (localStorage.getItem("token")) {
    //   window.location = `${APP_URL}/home`;
    // }
    setShowPlaybar(false);
    setError("");
    setLoading(false);
  }, [setError, setShowPlaybar]);

  return loading ? (
    <Loading />
  ) : (
    <div className="login-page-container">
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

      <div className="login-container">
        <div className="welcome-message">
          <p>To continue, log in to Chillify.</p>
        </div>
        <form className="login-form">
          {error.length > 0 ? (
            <div className="display-error-container">
              <div className="display-error">{error}</div>
            </div>
          ) : (
            ""
          )}
          <div className="email">
            <label>Email</label>
            <input
              className="highlight-input"
              id="login-email"
              type="email"
              value={emailValue}
              name="login-email"
              autoComplete="off"
              onChange={handleEmailChange}
            />
          </div>
          <div className="password">
            <label>Password</label>
            <input
              className="highlight-input"
              id="login-password"
              type="password"
              value={passwordValue}
              name="login-password"
              autoComplete="off"
              onChange={handlePasswordChange}
            />
          </div>
          <div className="button-container">
            <button
              className="login-button"
              type="submit"
              onClick={(e) => handleLogin(e)}
            >
              Login
            </button>
            <div className="seperator">
              <div className="seperator-left"></div>
              <div>
                <p>OR</p>
              </div>
              <div className="seperator-right"></div>
            </div>
            <button
              className="login-button"
              type="submit"
              onClick={(e) => handleDemoLogin(e)}
            >
              Demo Login
            </button>
          </div>
        </form>
        <div className="register-info">
          <div className="register-text">Don't have an account?</div>
          <Link to="/register" className="signup-link">
            <div className="register-button">Sign up for Chillify</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
