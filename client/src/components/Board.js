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
  const [board, setBoard] = useState(Array(9).fill(""));
  const [playerSymbol, setPlayerSymbol] = useState("X"); // Default playerSymbol for the first player
  const [turn, setTurn] = useState("X"); // X always starts
  const [openModal, setOpenModal] = useState(false);
  const [winner, setWinner] = useState("");
  const [gameConcluded, setGameConcluded] = useState(false);
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const { name } = client.user;
  const { members } = channel.state;

  useEffect(() => {
    channel.on("move", (event) => {
      if (event.user.id !== client.userID) {
        setBoard((board) =>
          board.map((val, idx) =>
            idx === event.data.square ? event.data.symbol : val
          )
        );
        setTurn((turn) => (turn === "X" ? "O" : "X"));
      }
    });

    if (client.userID === Object.keys(members)[0]) {
      // Assume first user in members is 'X'
      setPlayerSymbol("X");
    } else {
      setPlayerSymbol("O");
    }

    return () => channel.off("move");
  }, [channel, client.userID, members]);

  useEffect(() => {
    checkGameStatus();
  }, [board]);

  const chooseSquare = (square) => {
    if (board[square] === "" && turn === playerSymbol && !gameConcluded) {
      board[square] = playerSymbol;
      setBoard([...board]);
      setTurn(turn === "X" ? "O" : "X");
      channel.sendEvent({
        type: "move",
        data: {
          square,
          symbol: playerSymbol,
        },
      });
      checkGameStatus();
    }
  };

  const updateDatabase = (username, result) => {
    Axios.post("https://tic-tac-toe-4v02.onrender.com/update", {
      username,
      result,
    }).catch((error) => console.error("Failed to update the database:", error));
  };

  const checkGameStatus = () => {
    Patterns.forEach((pattern) => {
      const firstPlayer = board[pattern[0]];
      if (
        firstPlayer &&
        pattern.every((index) => board[index] === firstPlayer)
      ) {
        if (!gameConcluded) {
          const winnerName =
            firstPlayer === "X"
              ? members[Object.keys(members)[0]].user.name
              : members[Object.keys(members)[1]].user.name;
          setWinner(winnerName);
          setResult({ winner: winnerName, state: "won" });
          setOpenModal(true);
          updateDatabase(winnerName, "won");
          setGameConcluded(true);
        }
      }
    });

    if (!board.includes("") && !winner && !gameConcluded) {
      // Check for tie
      setResult({ winner: "none", state: "draw" });
      setOpenModal(true);
      setGameConcluded(true);
      Object.keys(members).forEach((key) => {
        updateDatabase(members[key].user.name, "lost");
      });
    }
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
          <p>Please refresh to start a new game!</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Board;
