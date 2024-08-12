import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Monster = () => {
    const [monsters, setMonsters] = useState(null);

    useEffect(() => {
        axios.get(`${config.API_URL}/stored-monsters`)
            .then(response => {
                setMonsters(response.data);
            })
            .catch(error => console.error("There was an error fetching the monsters!", error));
    }, []);

    if (!monsters) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {monsters.map(monster => (
                <div key={monster.monsterId}>
                    <h1>{monster.name}</h1>
                    <p>Japanese Name: {monster.japaneseName}</p>
                    <p>Elemental Affinity: {monster.elementalAffinity}</p>
                    <p>Elemental Weakness: {monster.elementalWeakness}</p>
                    <p>Hit Points: {monster.hitPoints}</p>
                    <p>Mana Points: {monster.manaPoints}</p>
                    <p>Attack: {monster.attack}</p>
                    <p>Defense: {monster.defense}</p>
                    <p>Description: {monster.description}</p>
                    <p>Game: {monster.game}</p>
                    <img src={monster.picture} alt={monster.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                </div>
            ))}
        </div>
    );
};

export default Monster;