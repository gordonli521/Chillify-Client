const checkJwtToken = async () => {
  try {
    const response = await fetch("http://localhost:5000/auth/user", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.msg === "token is not valid") {
      localStorage.removeItem("token");
      window.location = "http://localhost:3000/login";
    }
  } catch (err) {
    console.log(err);
  }
};

export default checkJwtToken;
