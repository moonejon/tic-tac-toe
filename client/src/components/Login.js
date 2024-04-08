import React from "react";

const Login = () => {
  const login = () => {};
  return (
    <div className="login">
      <label> Login</label>
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
      <button onSubmit={login}>Login</button>
    </div>
  );
};

export default Login;
