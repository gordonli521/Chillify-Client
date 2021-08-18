import { API_URL } from "../url";

const fetchAuthUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/user`, {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default fetchAuthUser;
