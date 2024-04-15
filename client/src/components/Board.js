import React, { useEffect, useState } from "react";
import Square from "./Square";
import { Patterns } from "./WinConditions";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const Board = ({ result, setResult, setIsAuth }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [openModal, setOpenModal] = useState(false);
  const [winner, setWinner] = useState("");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const { name } = client.user;
  const { members } = channel.state;

  const opponentId = Object.keys(members).find(
    (memberId) => memberId !== client.userID
  );
  const opponent = members[opponentId]?.user?.name;

  useEffect(() => {
    isWin();
    isTie();
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");
      await channel.sendEvent({
        type: "move",
        data: {
          square,
          player,
        },
      });
      setBoard(
        board.map((value, index) => {
          if (index === square && value === "") {
            return player;
          }
          return value;
        })
      );
    }
  };

  const isWin = () => {
    Patterns.forEach((currentPattern) => {
      const firstPlayer = board[currentPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;

      currentPattern.forEach((index) => {
        if (board[index] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setWinner(name);
        setResult({
          winner: board[currentPattern[0]],
          state: "won",
        });
        Axios.post("https://tic-tac-toe-4v02.onrender.com/update", {
          username: name,
          result: "won",
        });
        Axios.post("https://tic-tac-toe-4v02.onrender.com/update", {
          username: opponent,
          result: "lost",
        });
        setOpenModal(true);
      }
    });
  };

  const isTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({
        ...result,
        state: "draw",
      });
      setOpenModal(true);
    }
  };

  channel.on((e) => {
    if (e.type === "move" && e.user.id !== client.userID) {
      const currentPlayer = e.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((value, index) => {
          if (index === e.data.square && value === "") {
            return e.data.player;
          }
          return value;
        })
      );
    }
  });
  const handleReturnToJoinGame = () => {
    // Reset the game state
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setWinner("");
    setResult({ winner: "", state: "" });

    // Close the modal
    setOpenModal(false);

    // Set the app state to return to the JoinGame screen
    setIsAuth(false);
  };

  const handleLeaderboard = () => {
    // Implement the functionality to navigate to the leaderboard page
    setOpenModal(false);
  };

  return (
    <>
      <div id="board">
        <div className="board-row">
          <Square chooseSquare={() => chooseSquare(0)} value={board[0]} />
          <Square chooseSquare={() => chooseSquare(1)} value={board[1]} />
          <Square chooseSquare={() => chooseSquare(2)} value={board[2]} />
        </div>
        <div className="board-row">
          <Square chooseSquare={() => chooseSquare(3)} value={board[3]} />
          <Square chooseSquare={() => chooseSquare(4)} value={board[4]} />
          <Square chooseSquare={() => chooseSquare(5)} value={board[5]} />
        </div>
        <div className="board-row">
          <Square chooseSquare={() => chooseSquare(6)} value={board[6]} />
          <Square chooseSquare={() => chooseSquare(7)} value={board[7]} />
          <Square chooseSquare={() => chooseSquare(8)} value={board[8]} />
        </div>
      </div>
      <Dialog open={openModal}>
        <DialogTitle>{winner ? `${winner} wins!` : "It's a tie!"}</DialogTitle>
        <DialogContent>
          <p>What would you like to do next?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnToJoinGame}>New Game</Button>
          <Button onClick={handleLeaderboard}>Leaderboard</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Board;
