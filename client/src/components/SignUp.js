import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "@mui/material";

const SignUp = ({ setIsAuth }) => {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);

  const signUp = () => {
    Axios.post("https://tic-tac-toe-4v02.onrender.com/signup", user).then(
      (response) => {
        const { token, userId, firstName, lastName, username, hashedPassword } =
          response.data;
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        cookies.set("username", username);
        cookies.set("hashedPassword", hashedPassword);
        setIsAuth(true);
      }
    );
  };
  return (
    <div className="signUp">
      <input
        type="text"
        placeholder="First Name"
        onChange={(event) => {
          setUser({ ...user, firstName: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(event) => {
          setUser({ ...user, lastName: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(event) => {
          setUser({ ...user, username: event.target.value });
        }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(event) => {
          setUser({ ...user, password: event.target.value });
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
        onClick={signUp}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignUp;
