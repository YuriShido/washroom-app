import './App.scss';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Header from './component/header'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
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
  const [selected, setSelected] = useState(null);
  
  const onMapClick = useCallback((event) => {
    console.log(event);
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }]);
  }, [])

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  },[])

  const panTo = useCallback(({lat, lng }) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
  },[])

  if(loadError) return "Error loading maps"
  if(!isLoaded) return "Loading Maps"



  return (
    <div className="App">
      <Header />
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
      <GoogleMap  mapContainerStyle={mapContainerStyle} 
                  zoom={12} 
                  center={center}
                  options={options}
                  onClick={onMapClick}
                  onLoad={onMapLoad}
                  >
        {markers.map((marker, index) => (
          < Marker key={index}
                    position={{ lat:marker.lat, lng:marker.lng}}
                    icon={{
                      url: "/img/mark.svg",
                      scaledSize: new window.google.maps.Size(30,30)
                    }}
                    onClick={() => {
                      setSelected(marker)
                    }}
          />
        ))}
        {/* セレクトした場所をサーバーからのjsonデータと合わせてデータの中身を取って来なきゃいけないdivの中身の部分 */}
        {selected ? (<InfoWindow 
            position={{lat: selected.lat, lng: selected.lng}} 
            onCloseClick = {() => {
              setSelected(null);
            }}
            >
          <div>
            <h3>Place Name</h3>
            <p>Open or Close</p>
            <p>★★★ come from rate</p>
            {/* make see more detail to show modal or detail info bottom of the map it get from the server data */}
            <p>See more a tag to detail here</p>
          </div>
        </InfoWindow>) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({panTo}) {
  return <button className="locate" onClick={() => {
    navigator.geolocation.getCurrentPosition((position) => {
      panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      console.log(position);
    }, () => null, options);
  }}>
            <img src="/img/compass2.svg" alt="compass - locate" />
          </button>
}

function Search( {panTo} ) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions, 
  } = usePlacesAutocomplete({
    requestOptions :{
      location: {lat: () => 49.24966, lng: () => -123.11934},
      radius: 200 * 1000,
    },
  });

  return (
  <div className="search">
      <Combobox 
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions()
          try {
            const results = await getGeocode({ address })
            const {lat, lng } = await getLatLng(results[0]);
            panTo( { lat, lng } )
            console.log(lat, lng);
            console.log(results[0]);
            // getLatLng,
          } catch (error){
            console.log("error");
          }
      }}
      >
        <ComboboxInput 
          value={value} 
          onChange={(e) => {
            setValue(e.target.value);
          }} 
          disabled={!ready}
          placeholder="Enter an address"
          />
          <ComboboxPopover>
            <ComboboxList>
            {status === "OK" && data.map(({id, description}) => (
              <ComboboxOption key={id} value={description} />
              ))}
            </ComboboxList>
          </ComboboxPopover>
      </Combobox>
    </div>
  )
}

export default App;
