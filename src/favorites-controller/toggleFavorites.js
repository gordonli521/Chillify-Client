const toggleFavorites = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `http://localhost:5000/users/${user.id}/favorites`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default toggleFavorites;
