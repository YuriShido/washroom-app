import './App.scss';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Header from './component/Header'
import MapField from './component/MapField';

function App() {

  return (
    <div className="App">
      <Header />
      <MapField />
      
    </div>
  );
}

export default App;
