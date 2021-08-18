import "../styling/home-page.css";
import { Link } from "react-router-dom";
import { Application } from "../App";
import { useContext, useState, useEffect } from "react";
import logo from "../logo4.png";
import Loading from "./loading";
import { APP_URL } from "../url";

const MainPage = () => {
  const { setShowPlaybar } = useContext(Application);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      window.location = `${APP_URL}/home`;
    }
    setShowPlaybar(false);
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="main-page-container">
      <div className="main-header">
        <div className="main-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="main-text">
          <div className="website-title">
            <h1>Chillify</h1>
          </div>
          <div className="description">
            <p>Listen to a variety of music just for you.</p>
          </div>
        </div>
      </div>
      <div className="text">
        <button className="main-login-button">
          <Link to="/login" className="login-link">
            Login
          </Link>
        </button>
      </div>
    </div>
  );
};

export default MainPage;
