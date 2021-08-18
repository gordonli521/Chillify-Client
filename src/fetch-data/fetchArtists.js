const fetchArtists = async () => {
  try {
    const response = await fetch("http://localhost:5000/artists", {
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

export default fetchArtists;