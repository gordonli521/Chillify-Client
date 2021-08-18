import "semantic-ui-css/semantic.min.css";
import "../styling/navbar.css";
import { AiOutlineUser, AiOutlineCaretDown } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

const Navbar = () => {
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
        <div
          className={`nav-btn-container ${clicked ? "clicked" : ""} `}
          onClick={(e) => handleButton(e)}
        >
          {isModalOpen ? (
            <div className="nav-modal">
              <div className="log-out" onClick={() => logout()}>
                Log out
              </div>
            </div>
          ) : null}
          <div className="user-pic">
            <AiOutlineUser />
          </div>
          <div className="user-name">{name}</div>
          <div className="dropdown-arrow">
            <AiOutlineCaretDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
