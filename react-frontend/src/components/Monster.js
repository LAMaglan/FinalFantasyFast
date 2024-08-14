import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Monster = () => {
    const [monsters, setMonsters] = useState([]);
    const [monsterName, setMonsterName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (monsterName) {
            setLoading(true);
            axios.get(`${config.API_URL}/monsters`, { params: { name: monsterName } })
                .then(response => {
                    setMonsters(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("There was an error fetching the monsters!", error);
                    setLoading(false);
                });
        }
    }, [monsterName]);

    const handleInputChange = (e) => {
        setMonsterName(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter monster name"
                value={monsterName}
                onChange={handleInputChange}
            />
            {loading && <div>Loading...</div>}
            {monsters.length > 0 ? (
                monsters.map(monster => (
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
                monsterName && !loading && <p>No monsters found</p>
            )}
        </div>
    );
};

export default Monster;