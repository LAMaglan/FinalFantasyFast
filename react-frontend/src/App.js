import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
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
                <h1>Final Fantasy Characters and Monsters</h1>
            </header>
            <main>
                <Box sx={{ width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Characters" />
                        <Tab label="Monsters" />
                    </Tabs>
                    {value === 0 && <Character />}
                    {value === 1 && <Monster />}
                </Box>
            </main>
        </div>
    );
}

export default App;