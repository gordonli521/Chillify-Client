import { API_URL } from "../url";

const incrementPlays = async (id) => {
  try {
    const response = await fetch(`${API_URL}/songs/${id}`, {
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

export default incrementPlays;
