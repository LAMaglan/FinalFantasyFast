import React from 'react';
import Character from './components/Character';
import Monster from './components/Monster';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Final Fantasy Characters and Monsters</h1>
            </header>
            <main>
                <h2>Characters</h2>
                <Character />
                <h2>Monsters</h2>
                <Monster />
            </main>
        </div>
    );
}

export default App;