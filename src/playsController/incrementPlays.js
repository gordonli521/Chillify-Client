const incrementPlays = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/songs/${id}`, {
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
