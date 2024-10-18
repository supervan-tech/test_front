import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Screens } from './screens/Screens';
import { CVsList } from './screens/CVsList';

function App() {

  const [currentView, setCurrentView] = useState<Screens>(Screens.CVsList);

  const [cvs, setCVs] = useState<any[]>([]);

  (async () => {
    const data = await (await fetch('cvs.json')).json();
    setCVs(data);
  })();

  const chooseScreen = () => {
    switch (currentView) {
      case Screens.CVsList:
        return <CVsList cvs={[]}></CVsList>;
      case Screens.CVView:
        return <></>;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {chooseScreen()}
      </header>
    </div>
  );
}

export default App;
