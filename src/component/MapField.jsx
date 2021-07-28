import '../App.scss';
import './MapField.scss'
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import Header from './component/header'
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
// import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "../mapStyles";
import * as publicWashroomData from "../data/public-washrooms.json";
import AddWashroom from './AddWashroom'
import axios from 'axios'
import EditModal from './EditModal'

const libraries = ["places"];
const mapContainerStyle = {
    width: "100vw",
    height: "100vh"
}
const center = {
    lat: 49.26778,
    lng: -123.101463
}

// Vancouver coordinate
// lat: 49.24966,lng: -123.11934

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true

}
// console.log(publicWashroomData)

const today = new Date()
const month = today.getMonth() + 1
let season;
if(month < 5 || month > 9) season = "winter"
else season = "summer"


const MapField = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    const [markers, setMarkers] = useState([]);
    // const [selected, setSelected] = useState(null);
    const [pSelected, setPSelected] = useState(null);
    const [chose, setChose] = useState(null)
    // const [season, setSeason] = useState("summer");
    const [allWashroomData, setAllWashroomData] = useState([])
    const [confirmed, setConfirmed] = useState(false)
    const [coordinate, setCoordinate] = useState({lat:null, lng:null })

    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_SERVER_URL}washroom/`)
        .then( (response) => {
          setAllWashroomData(response.data);
        })
         .catch( err => console.log(err))
         
        }, [allWashroomData.length, confirmed, modalIsOpen])
        // console.log("all washroom:", allWashroomData);

      

    const onMapClick = useCallback(async (event) => {
        // console.log(event);
        const check = window.confirm('Do you want to add washroom maker where you clicked?')
        
        if(check) {

            setMarkers(current => [...current, {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date(),
            }]);
            setConfirmed(true)
            // console.log("confirmed", confirmed)
            return setCoordinate({lat:event.latLng.lat(), lng:event.latLng.lng() })
        }
    }, [])
    
    // console.log("confirmedOut", confirmed);
    

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, [])

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, [])

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "Loading Maps"

    
    return (
        <div id="Map">
            <Search panTo={panTo} />
            <Locate panTo={panTo} />
            <GoogleMap mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {/* public washroom data from json data from city of vancouver */}
                
                {
                    publicWashroomData.default.map(PWashroom => (
                        <Marker 
                            key={PWashroom.recordid} 
                            position={{
                                lat: PWashroom.fields.geom.coordinates[1],
                                lng: PWashroom.fields.geom.coordinates[0]
                            }}
                            icon={{
                                url:"/img/public-washroom2.svg",
                                scaledSize: new window.google.maps.Size(35, 35)
                            }}
                            onClick={() => {
                                setPSelected(PWashroom)
                            }}
                        />

                    ))
                }

                {
                    pSelected? (<InfoWindow
                        position={{ lat: pSelected.fields.geom.coordinates[1], lng: pSelected.fields.geom.coordinates[0] }}
                        onCloseClick={() => {
                            setPSelected(null);
                        }}
                    >
                        <div className="info-box">
                            <h3>{pSelected.fields.name}</h3>
                            {season === "summer" ? (<p><i className="far fa-clock"></i> {pSelected.fields.summer_hours}</p>) :
                            (<p><i className="far fa-clock"></i>{pSelected.fields.wintter_hours}</p>)
                            }
                            <p>Public washroom</p>
                            {/* make see more detail to show modal or detail info bottom of the map it get from the server data */}
                            {/* <p>See more a tag to detail here</p> */}
                        </div>
                    </InfoWindow>) : null
                }

                {/* getwashroomdata from the database */}
                {
                    allWashroomData &&  allWashroomData.map(washroom => (<Marker
                        key={washroom._id}
                        position={{
                            lat: washroom.coordinate.lat,
                            lng: washroom.coordinate.lng
                        }}
                        icon={{
                            url: "/img/mark2.svg",
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                        onClick={() => {
                            setChose(washroom)
                            // console.log("ChoseData:", chose);
                        }}
                        
                    />))
                }
                {chose ? (<InfoWindow
                    position={{ lat: chose.coordinate.lat, lng: chose.coordinate.lng }}
                    onCloseClick={() => {
                        setChose(null);
                    }}
                >
                    <div className="info-box">
                        <h3>{chose.name}</h3>
                        <p><i className="far fa-clock"></i> {chose.openTime}</p>
                        <p>{chose.discription}</p>
                        <p>clean rate: {chose.rate}</p>
                        <p>{chose.updatedAt}</p>
                        {/* make see more detail to show modal or detail info bottom of the map it get from the server data */}
                        {/* <p>{formatRelative(chose.updatedAt, new Date())}</p> */}
                        <p className="edit"
                            onClick={() => setIsOpen(true)}
                        >Edit Data</p>
                    </div>
                </InfoWindow>) : null}

                {/* add new washroom data from the user */}
                {markers.map((marker, index) => (
                    < Marker 
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={{
                            url: "/img/mark.svg",
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                        
                        lat={marker.lat}
                        lng={marker.lng}
                        
                    />
                    
                ))}
               
            </GoogleMap>
            {
                    confirmed ? (
                        <div>
                            {/* <i className="fas fa-times  close-button" onClick={() => {setConfirmed(false)}}></i> */}
                            {/* // <button className="close-button" onClick={() => {setConfirmed(false)}}>Close Form</button> */}
                            <AddWashroom  setConfirmed={setConfirmed} 
                                            confirmed={confirmed}
                                            lat={coordinate.lat} 
                                            lng={coordinate.lng}
                                            addTime={markers[0].time}/>
                        </div>
                    ) : null
            }
            {
                modalIsOpen ?  (
                    <EditModal setIsOpen={setIsOpen} modalIsOpen={modalIsOpen} chose={chose}/>
                ) : null
            }
        </div>
    )
}

function Locate({ panTo }) {
    return <button className="locate" onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            // console.log(position);
        }, () => null, options);
    }}>
        <img src="/img/compass2.svg" alt="compass - locate" />
    </button>
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 49.24966, lng: () => -123.11934 },
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
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo({ lat, lng })
                        // console.log(results[0]);
                        // getLatLng,
                    } catch (error) {
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
                <ComboboxPopover style={{ zIndex: 70}}>
                    <ComboboxList className="list" style={{fontFamily: 'Quicksand'}}>
                        {status === "OK" && data.map(({ id, description }) => (
                            <ComboboxOption key={id} value={description} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}

export default MapField


