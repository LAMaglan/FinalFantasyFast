import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { debounce } from 'lodash';

const Monster = () => {
    const [allMonsters, setAllMonsters] = useState([]);
    const [filteredMonsterNames, setFilteredMonsterNames] = useState([]);
    const [displayedMonsters, setDisplayedMonsters] = useState([]);
    const [monsterName, setMonsterName] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchAllMonsters();
        fetchGames();
    }, []);

    const fetchAllMonsters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/stored-monsters`);
            setAllMonsters(response.data);
            // Initialize displayed monsters with the first 5 monsters
            setDisplayedMonsters(response.data.slice(0, 5));
        } catch (error) {
            console.error("There was an error fetching all monsters!", error);
        }
    };

    const fetchGames = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/monsters/games`);
            console.log("Games fetched:", response.data);
            setGames(response.data);
        } catch (error) {
            console.error("There was an error fetching games!", error);
        }
    };

    const updateFilteredMonsterNames = useCallback(
        debounce(() => {
            let uniqueNames = new Set();
            allMonsters.forEach(monster => {
                if (
                    (!monsterName || monster.name.toLowerCase().includes(monsterName.toLowerCase())) &&
                    (!selectedGame || monster.game === selectedGame)
                ) {
                    uniqueNames.add(monster.name);
                }
            });
            setFilteredMonsterNames(Array.from(uniqueNames));
            setLoading(false);
        }, 300),
        [monsterName, selectedGame, allMonsters]
    );

    const updateDisplayedMonsters = useCallback(() => {
        const matchedMonsters = allMonsters.filter(monster =>
            (!monsterName || monster.name.toLowerCase().includes(monsterName.toLowerCase())) &&
            (!selectedGame || monster.game === selectedGame)
        );
        if (monsterName || selectedGame) {
            setDisplayedMonsters(matchedMonsters);
        } else {
            // Show the first 5 monsters by default if there is no filter
            setDisplayedMonsters(allMonsters.slice(0, 5));
        }
    }, [monsterName, selectedGame, allMonsters]);

    useEffect(() => {
        setLoading(true);
        updateFilteredMonsterNames();
        updateDisplayedMonsters();
    }, [monsterName, selectedGame, updateFilteredMonsterNames, updateDisplayedMonsters]);

    const handleInputChange = (e) => {
        setMonsterName(e.target.value);
        setShowDropdown(true);
    };

    const handleGameChange = (e) => {
        setSelectedGame(e.target.value);
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    const handleMonsterSelect = (name) => {
        setMonsterName(name);
        setShowDropdown(false);
    };

    return (
        <div className="monster-container">
            <input
                type="text"
                placeholder="Enter monster name"
                value={monsterName}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="monster-input"
            />
            <select value={selectedGame} onChange={handleGameChange}>
                <option value="">All Games</option>
                {games.map((game, index) => (
                    <option key={index} value={game}>{game}</option>
                ))}
            </select>
            {loading && <div>Loading...</div>}
            {showDropdown && filteredMonsterNames.length > 0 && (
                <div className="dropdown">
                    {filteredMonsterNames.map(name => (
                        <div key={name} onMouseDown={() => handleMonsterSelect(name)} className="dropdown-option">
                            {name}
                        </div>
                    ))}
                </div>
            )}
            {displayedMonsters.length > 0 ? (
                displayedMonsters.map(monster => (
                    <div key={monster.monsterId}>
                        <h1>{monster.name}</h1>
                        <img src={monster.picture} alt={monster.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                        <p>Japanese Name: {monster.japaneseName}</p>
                        <p>Elemental Affinity: {monster.elementalAffinity || 'N/A'}</p>
                        <p>Elemental Weakness: {monster.elementalWeakness || 'N/A'}</p>
                        <p>Hit Points: {monster.hitPoints}</p>
                        <p>Mana Points: {monster.manaPoints}</p>
                        <p>Attack: {monster.attack}</p>
                        <p>Defense: {monster.defense}</p>
                        <p>Description: {monster.description || 'N/A'}</p>
                        <p>Game: {monster.game}</p>
                    </div>
                ))
            ) : (
                (monsterName || selectedGame) && !loading && <p>No monsters found</p>
            )}
        </div>
    );
};

export default Monster;