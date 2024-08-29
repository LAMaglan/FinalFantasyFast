import React, { useState } from 'react';
import config from '../config'; 
import { useFetchData } from '../hooks/useFetchData';

const Game = () => {
  const { data: games, loading } = useFetchData(`${config.API_URL}/stored-games`);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameChange = (event) => {
    const gameId = event.target.value;
    const game = games.find(game => game.gameId === gameId);
    setSelectedGame(game);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Select a Game</h1>
      <select onChange={handleGameChange}>
        <option value="">-- Select a Game --</option>
        {games.map(game => (
          <option key={game.gameId} value={game.gameId}>
            {game.title}
          </option>
        ))}
      </select>

      {selectedGame && (
        <div>
          <h2>{selectedGame.title}</h2>
          <img src={selectedGame.picture} alt={selectedGame.title} />
          <p>{selectedGame.description}</p>
          <p><strong>Platform:</strong> {selectedGame.platform}</p>
          <p><strong>Release Date:</strong> {selectedGame.releaseDate}</p>
        </div>
      )}
    </div>
  );
};

export default Game;
