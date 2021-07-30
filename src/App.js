import './App.scss';
import React from 'react';
import Header from './component/Header'
import MapField from './component/MapField';


function App() {
  
  return (
    <div className="App" id="App">
      <Header />
      <MapField />
      <p className="copy-right">Copyright &copy; Run Van W/C 2021</p>
    </div>
  );
}


export default App;
