import { API_URL, APP_URL } from "../url";

const checkJwtToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/user`, {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.msg === "token is not valid") {
      localStorage.removeItem("token");
      window.location = `${APP_URL}/login`;
    }
  } catch (err) {
    console.log(err);
  }
};

export default checkJwtToken;
