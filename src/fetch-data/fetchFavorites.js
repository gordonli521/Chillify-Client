const fetchFavorites = async () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `http://localhost:5000/users/${userInfo.id}/favorites`,
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

export default fetchFavorites;
