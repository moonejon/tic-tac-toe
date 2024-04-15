import React, { useState } from "react";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Game from "./components/Game";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./App.css";
import JoinGame from "./components/JoinGame";
import { Button } from "@mui/material";

function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);
  
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then(() => {
        setIsAuth(true);
      });
  }
  
  const username = cookies.get("username");

  return (
    <div className="App">
      <div className="title text-pop-up-top">Tic Tac Toe</div>
      {isAuth ? (
        <>
          <div className="username-display">{username}</div>
          <Chat client={client}>
            <JoinGame />
            <button onClick={logOut}>Log Out</button>
          </Chat>
        </>
      ) : (
        <div className="auth">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <SignUp setIsAuth={setIsAuth} />
            <Login setIsAuth={setIsAuth} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;