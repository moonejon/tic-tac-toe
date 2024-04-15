import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Game from "./components/Game";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./App.css";
import JoinGame from "./components/JoinGame";
import { Button } from "@mui/material";

const cookies = new Cookies();

// Helper functions for cookies
function getUserFromCookies() {
  return {
    id: cookies.get("userId"),
    name: cookies.get("username"),
    firstName: cookies.get("firstName"),
    lastName: cookies.get("lastName"),
    hashedPassword: cookies.get("hashedPassword"),
    token: cookies.get("token"),
  };
}

function clearUserCookies() {
  ["token", "userId", "firstName", "lastName", "username", "hashedPassword"].forEach(cookie => cookies.remove(cookie));
}

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);
  const { token, ...user } = getUserFromCookies();

  useEffect(() => {
    if (token) {
      client.connectUser(user, token)
        .then(() => setIsAuth(true))
        .catch((error) => console.error('Failed to connect user', error));
    }
    // Disconnect the user when the component unmounts
    return () => client.disconnectUser().catch((error) => console.error('Failed to disconnect user', error));
  }, [token]);

  const logOut = () => {
    clearUserCookies();
    client.disconnectUser();
    setIsAuth(false);
  };

  return (
    <div className="App">
      <div className="title text-pop-up-top">Tic Tac Toe</div>
      {isAuth ? (
        <>
          <div className="username-display">{user.name}</div>
          <Chat client={client}>
            <JoinGame />
            <button onClick={logOut}>Log Out</button>
          </Chat>
        </>
      ) : (
        <div className="auth">
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
            <SignUp setIsAuth={setIsAuth} />
            <Login setIsAuth={setIsAuth} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;