import { API_URL } from "../url";

const fetchAllPlaylists = async () => {
  try {
    const response = await fetch(`${API_URL}/playlists`, {
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

export default fetchAllPlaylists;
