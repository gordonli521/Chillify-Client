import { API_URL } from "../url";

const toggleFavorites = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(`${API_URL}/users/${user.id}/favorites`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default toggleFavorites;
