import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Game from './components/Game';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './App.css';
import JoinGame from './components/JoinGame';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

function App() {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);

  const [isAuth, setIsAuth] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const logOut = () => {
    cookies.remove('token');
    cookies.remove('userId');
    cookies.remove('firstName');
    cookies.remove('lastName');
    cookies.remove('username');
    cookies.remove('hashedPassword');
    client.disconnectUser();
    setIsAuth(false);
    setOpenDialog(false);  // Close dialog after logout
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (token) {
    client.connectUser(
      {
        id: cookies.get('userId'),
        name: cookies.get('username'),
        firstName: cookies.get('firstName'),
        lastName: cookies.get('lastName'),
        hashedPassword: cookies.get('hashedPassword'),
      },
      token
    ).then(() => {
      setIsAuth(true);
    });
  }

  const username = cookies.get('username');

  return (
    <div className="App">
      <div className="title text-pop-up-top">Tic Tac Toe</div>
      {isAuth ? (
        <>
          <div className="username-display" style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#3f51b5'} onMouseOut={e => e.target.style.color = 'black'} onClick={handleOpenDialog}>
            {username}
          </div>
          <Chat client={client}>
            <JoinGame />
          </Chat>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={logOut} color="primary" autoFocus>
                Log Out
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <div className="auth">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
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