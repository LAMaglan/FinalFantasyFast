import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { games } from '../constants';
import { debounce } from 'lodash';

const Monster = () => {
    const [allMonsters, setAllMonsters] = useState([]);
    const [filteredMonsters, setFilteredMonsters] = useState([]);
    const [monsterName, setMonsterName] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchAllMonsters();
    }, []);

    const fetchAllMonsters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/stored-monsters`);
            setAllMonsters(response.data);
        } catch (error) {
            console.error("There was an error fetching all monsters!", error);
        }
    };

    const updateFilteredMonsters = useCallback(
        debounce(() => {
            let filteredSet = new Set();
            allMonsters.forEach(monster => {
                if (
                    (!monsterName || monster.name.toLowerCase().includes(monsterName.toLowerCase())) &&
                    (!selectedGame || monster.game === selectedGame)
                ) {
                    filteredSet.add(monster.name);
                }
            });

            setFilteredMonsters(Array.from(filteredSet).map(name => allMonsters.find(monster => monster.name === name)));
            setLoading(false);
        }, 300),
        [monsterName, selectedGame, allMonsters]
    );

    useEffect(() => {
        setLoading(true);
        updateFilteredMonsters();
    }, [monsterName, selectedGame, updateFilteredMonsters]);

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
                {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                ))}
            </select>
            {loading && <div>Loading...</div>}
            {showDropdown && (
                <div className="dropdown">
                    {filteredMonsters.map(monster => (
                        <div key={monster.monsterId} onMouseDown={() => setMonsterName(monster.name)} className="dropdown-option">
                            {monster.name}
                        </div>
                    ))}
                </div>
            )}
            {filteredMonsters.length > 0 ? (
                filteredMonsters.map(monster => (
                    <div key={monster.monsterId}>
                        <h1>{monster.name}</h1>
                        <p>Japanese Name: {monster.japaneseName}</p>
                        <p>Elemental Affinity: {monster.elementalAffinity || 'N/A'}</p>
                        <p>Elemental Weakness: {monster.elementalWeakness || 'N/A'}</p>
                        <p>Hit Points: {monster.hitPoints}</p>
                        <p>Mana Points: {monster.manaPoints}</p>
                        <p>Attack: {monster.attack}</p>
                        <p>Defense: {monster.defense}</p>
                        <p>Description: {monster.description || 'N/A'}</p>
                        <p>Game: {monster.game}</p>
                        <img src={monster.picture} alt={monster.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    </div>
                ))
            ) : (
                (monsterName || selectedGame) && !loading && <p>No monsters found</p>
            )}
        </div>
    );
};

export default Monster;