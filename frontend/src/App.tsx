import React from 'react';
import {Calendar} from './components/Calendar';
import {Ticket} from './components/Ticket';

function App() {
    return (
        <div className="flex flex-col justify-center items-center gap-10 h-full w-full">
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <main>
                <Calendar/>
            </main>
            <header>
                <Ticket/>
            </header>
        </div>
    );
}

export default App;
