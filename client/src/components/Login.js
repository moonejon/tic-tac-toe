import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

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
      <label> Login</label>
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
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
