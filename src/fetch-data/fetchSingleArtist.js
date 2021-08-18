import { API_URL } from "../url";

const fetchSingleArtist = async (name) => {
  try {
    const response = await fetch(`${API_URL}/artists/${name}`, {
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

export default fetchSingleArtist;
