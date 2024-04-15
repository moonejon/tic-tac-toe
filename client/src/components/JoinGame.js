import React, { useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Axios from "axios";
import Game from "./Game";

const JoinGame = ({ setIsAuth }) => {
  const [opponent, setOpponent] = useState("");
  const [channel, setChannel] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const { client } = useChatContext();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await Axios.get(
          "https://tic-tac-toe-4v02.onrender.com/top-players"
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: opponent } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };

  return (
    <div className="joinGameContainer">
      <div className="joinGame">
        <h4>Join a Game</h4>
        <input
          className="joinGameInput"
          placeholder="Opponent username..."
          onChange={(event) => setOpponent(event.target.value)}
        />
        <button className="joinGameButton" onClick={createChannel}>
          Join Game
        </button>
      </div>
      <div className="leaderboard">
        <h4>Top Players</h4>
        {leaderboard.length ? (
          <ul>
            {leaderboard.map((player, index) => (
              <li key={index}>
                {player.username}: {player.wins > 0 ? player.wins / 2 : player.wins} wins
              </li>
            ))}
          </ul>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default JoinGame;
