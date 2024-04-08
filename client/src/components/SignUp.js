import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const SignUp = () => {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);

  const signUp = () => {
    axios.post("http://localhost:3001/signup", user).then((response) => {
      const { token, userId, firstName, lastName, username, hashedPassword } =
        response.data;
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        cookies.set("username", username);
        cookies.set("hashedPassword", hashedPassword);
    });
  };
  return (
    <div className="signUp">
      <label> Sign Up</label>
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
      <button onChange={signUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
