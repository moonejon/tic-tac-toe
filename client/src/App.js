import React, { useState } from "react";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { Modal, Button, Box } from "@mui/material";
import Game from "./components/Game";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./App.css";
import JoinGame from "./components/JoinGame";

function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);

  const [isAuth, setIsAuth] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
    setOpenModal(false);
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

  return (
    <div className="App">
      <div className="title text-pop-up-top">Tic Tac Toe</div>
      {isAuth ? (
        <Chat client={client}>
          <JoinGame setIsAuth={setIsAuth} />
          <div className="loggedInUser" onClick={handleOpenModal}>
            {cookies.get("username")}
          </div>
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box className="modalContent">
              <div>Are you sure you want to log out?</div>
              <Button onClick={logOut}>Log Out</Button>
            </Box>
          </Modal>
        </Chat>
      ) : (
        <div className="auth">
          <div className="authForms">
            <SignUp setIsAuth={setIsAuth} />
            <Login setIsAuth={setIsAuth} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
