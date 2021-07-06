import './App.scss';
import React, {useState, useEffect, useCallback} from 'react';
import Header from '../src/component/header'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxPopover,
//   ComboboxList,
//   ComboboxOption,
// } from "@reach/combobox";
import { formatRelative } from "date-fns";

// import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
}
const center = {
  lat: 49.24966,
  lng:-123.11934
}

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true

}
function App() {

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [markers, setMarkers] = useState([]);
  
  const onMapClick = useCallback((event) => {
    console.log(event);
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }]);
  }, [])


  if(loadError) return "Error loading maps"
  if(!isLoaded) return "Loading Maps"

  return (
    <div className="App">
      <Header />
      <GoogleMap  mapContainerStyle={mapContainerStyle} 
                  zoom={12} 
                  center={center}
                  options={options}
                  onClick={onMapClick}
                  >
        {markers.map((marker, index) => (
          < Marker key={index}
                    position={{ lat:marker.lat, lng:marker.lng}}
                    icon={{
                      url: "/img/mark.svg",
                      scaledSize: new window.google.maps.Size(30,30)
                    }}
          />
        ))}

      </GoogleMap>
    </div>
  );
}

export default App;
