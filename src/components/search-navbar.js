import "semantic-ui-css/semantic.min.css";
import "../styling/search-navbar.css";
import {
  AiOutlineUser,
  AiOutlineCaretDown,
  AiOutlineSearch,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";

const SearchNavbar = ({ searchTerm, setSearchTerm, handleSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [name, setName] = useState("");
  const history = useHistory();

  const handleButton = (e) => {
    setIsModalOpen(!isModalOpen);
    setClicked(!clicked);
    e.stopPropagation();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClicked(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location = "http://localhost:3000/login";
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setName(userInfo.name);

    document.body.addEventListener("click", closeModal);
    const rightNav = document.querySelector(".right-nav");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        if (rightNav !== null) {
          return rightNav.classList.add("darken");
        }
      } else {
        if (rightNav !== null) {
          return rightNav.classList.remove("darken");
        }
      }
    });
    return () => {
      document.body.removeEventListener("click", closeModal);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="right-nav">
        <div className="back-btn" onClick={() => history.goBack()}>
          <IoChevronBackOutline />
        </div>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="searchbar-container">
            <label className="search-label">
              <AiOutlineSearch className="search" />
            </label>
            <input
              type="text"
              id="searchInput"
              className="search-input"
              value={searchTerm}
              autoComplete="off"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. ed sheeran"
              autoFocus="autofocus"
            />
            {searchTerm ? (
              <button className="clear" onClick={() => setSearchTerm("")}>
                <MdClear />
              </button>
            ) : (
              ""
            )}
          </div>
        </form>
        <div
          className={`nav-btn-container ${clicked ? "clicked" : ""} `}
          onClick={(e) => handleButton(e)}
        >
          {isModalOpen ? (
            <div className="search-nav-modal">
              <div className="log-out" onClick={() => logout()}>
                Log out
              </div>
            </div>
          ) : null}
          <div className="user-pic">
            <AiOutlineUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNavbar;
