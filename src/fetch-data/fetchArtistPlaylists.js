const fetchArtistPlaylists = async (name) => {
  try {
    const response = await fetch(
      `http://localhost:5000/artists/${name}/playlists`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default fetchArtistPlaylists;
