import React, { useEffect, useState } from "react";
import Square from "./Square";
import { Patterns } from "./WinConditions";
import { useChannelStateContext, useChatContext } from "stream-chat-react";

const Board = ({ result, setResult }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

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
        setResult({
          winner: board[currentPattern[0]],
          state: "won",
        });
        alert(`Player ${board[currentPattern[0]]} wins!`);
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
      alert("It's a tie!");
    }
  }

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

  return (
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
  );
};

export default Board;
