import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "@mui/material";

const Login = ({ setIsAuth }) => {
  const cookies = new Cookies();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const login = () => {
    Axios.post("https://tic-tac-toe-4v02.onrender.com/login", {
      username: username,
      password: password,
    }).then((response) => {
      const { token, userId, firstName, lastName, username } = response.data;
      console.log(response.data);
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("username", username);
      setIsAuth(true);
    });
  };
  return (
    <div className="login">
      <input
        type="text"
        placeholder="Username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Button
        primary
        variant="contained"
        sx={{
          border: "1px solid clear",
          borderRadius: "50px",
          marginTop: "20px",
        }}
        onClick={login}
      >
        Log In
      </Button>
    </div>
  );
};

export default Login;
