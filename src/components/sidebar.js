import "semantic-ui-css/semantic.min.css";
import "../styling/sidebar.css";
import { NavLink } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../logo4.png";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <Link to="/home">
          <div className="logo-and-title">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="navbar-title">
              <h1>Chillify</h1>
            </div>
          </div>
        </Link>
        <NavLink to="/home" className="home-icon" activeClassName="selected">
          <div className="icon">
            <AiOutlineHome />
          </div>
          <div className="sidebar-text">
            <h3>Home</h3>
          </div>
        </NavLink>
        <NavLink
          to="/search"
          className="search-icon"
          activeClassName="selected"
        >
          <div className="icon">
            <AiOutlineSearch />
          </div>
          <div className="sidebar-text">
            <h3>Search</h3>
          </div>
        </NavLink>
        <NavLink
          to="/favorites"
          className="favorites-icon"
          activeClassName="selected"
        >
          <div className="icon">
            <AiOutlineHeart />
          </div>
          <div className="sidebar-text">
            <h3>Favorites</h3>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
