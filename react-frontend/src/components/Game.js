import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Adjust the path

const Game = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // Fetch games when the component mounts
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      console.log('Fetching games from:', `${config.API_URL}/stored-games`);
      const response = await axios.get(`${config.API_URL}/stored-games`);
      
      if (response && response.data && response.data.length > 0) {
        console.log("Fetched games:", response.data);
        setGames(response.data);
      } else {
        console.log("No games data found in response.");
      }
      
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGameChange = (event) => {
    const gameId = event.target.value;
    console.log("Selection changed, selected gameId:", gameId);

    // Ensure games array is not empty
    if (!games || games.length === 0) {
      console.warn("Games array is empty.");
      return;
    }

    const game = games.find(game => game.gameId === gameId);
    if (!game) {
      console.warn("Selected gameId does not match any game.");
      return;
    }

    setSelectedGame(game);
    console.log("Selected game:", game);
  };

  console.log('Rendered Game component with games:', games);
  console.log('Rendered Game component with selectedGame:', selectedGame);

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
