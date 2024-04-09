import React, { useState } from "react";
import Board from "./Board";

const Game = ({ channel }) => {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  const [result, setResult] = useState({ winner: "none", state: "none" });

  channel.on("user.watching.start", (e) => {
    setPlayersJoined(e.watcher_count === 2);
  });

  return (
    <div>
      {!playersJoined ? (
        <h1>Waiting for opponent to join...</h1>
      ) : (
        <div id="gameContainer">
          <Board result={result} setResult={setResult} />
        </div>
      )}
    </div>
  );
};

export default Game;
