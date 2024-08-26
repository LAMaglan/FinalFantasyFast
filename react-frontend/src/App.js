import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Game from './components/Game';
import Character from './components/Character';
import Monster from './components/Monster';
import './App.css';

const App = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>FinalFantasyFast</h1>
            </header>
            <main>
                <Box sx={{ width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Games" />
                        <Tab label="Characters" />
                        <Tab label="Monsters" />
                    </Tabs>
                    <div className="tab-content">
                        {value === 0 && <Game />}
                        {value === 1 && <Character />}
                        {value === 2 && <Monster />}
                    </div>
                </Box>
            </main>
        </div>
    );
}

export default App;