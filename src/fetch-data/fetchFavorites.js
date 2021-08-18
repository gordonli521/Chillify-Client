import { API_URL } from "../url";

const fetchFavorites = async () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(`${API_URL}/users/${userInfo.id}/favorites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default fetchFavorites;
