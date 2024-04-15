import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Game from "./components/Game";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./App.css";
import JoinGame from "./components/JoinGame";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const cookies = new Cookies();

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
  const [open, setOpen] = useState(false);
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);
  const { token, ...user } = getUserFromCookies();

  useEffect(() => {
    if (token) {
      client.connectUser(user, token)
        .then(() => setIsAuth(true))
        .catch((error) => console.error('Failed to connect user', error));
    }
    return () => client.disconnectUser().catch((error) => console.error('Failed to disconnect user', error));
  }, [token]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    clearUserCookies();
    client.disconnectUser();
    setIsAuth(false);
    handleClose();
  };

  return (
    <div className="App">
      <div className="title text-pop-up-top">Tic Tac Toe</div>
      {isAuth ? (
        <>
          <div className="username-display" onClick={handleClickOpen}>{user.name}</div>
          <Chat client={client}>
            <JoinGame />
          </Chat>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Confirm Logout"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to log out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={logOut} autoFocus>
                Log Out
              </Button>
            </DialogActions>
          </Dialog>
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
