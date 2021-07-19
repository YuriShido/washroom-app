import './App.scss';
import React, {useState, useEffect} from 'react';
import Header from './component/Header'
import MapField from './component/MapField';
import axios from 'axios'

function App() {
  const [backData, setBackData] =useState()

  // useEffect(() => {
  //   fetch("/data")
  //   .then((res) => res.json())
  //   .then((data) => setBackData(data.message))
  // }, [])

useEffect(() => {
  axios.get("http://localhost:5000/data")
  .then( (response) => {
    console.log(response.data);
    // console.log(response.headers);
    // console.log(response.config)
    setBackData(response.data.message);
  })
   .catch( err => console.log(err))
  }, [])
  // useEffect(() => {
  //   axios.get("http://localhost:5000/data")
  //   .then((res) => res.json())
  //   .then((res) => setBackData(res.data.message))
     
  // }, [])


  return (
    <div className="App">
      <Header />
      <MapField />
      <h1>{backData}</h1>
    </div>
  );
}


export default App;
