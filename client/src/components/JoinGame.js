import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
const JoinGame = () => {
  const [opponent, setOpponent] = useState("");
  const [channel, setChannel] = useState(null);

  const { client } = useChatContext();

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
    <>
      {channel ? (
        <Channel channel={channel}>
          <Game channel={channel} />
        </Channel>
      ) : (
        <div id="joinGame">
          <h4> Create Game </h4>
          <input
            placeholder="Opponent username..."
            onChange={(event) => setOpponent(event.target.value)}
          />
          <button onClick={createChannel}>Join Game</button>
        </div>
      )}
    </>
  );
};

export default JoinGame;
