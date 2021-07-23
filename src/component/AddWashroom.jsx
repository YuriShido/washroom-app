import React, {useState, useEffect}from 'react'
import axios from 'axios'
import "../App.scss"

const AddWashroom = ({lat, lng, setConfirmed}) => {
    const [name, setName] = useState('');
    const [discription, setDiscription] = useState('')
    // let [coordinate, setCoordinate] = useState({lat:null, lng:null})
    const [rate, setRate] = useState(null)
    const [openTime, setOpenTime] = useState('')
    const [error, setError] = useState({})
    // const getNewWashroomData = () => {

    // }
    // setCoordinate = {lat: lat, lng: lng};
    // console.log(lat, lng)
    // const handleSetName = (e) => {
    //     setName(e.target.value) 
    //     if(!name) {
    //         setError({name:"Name required"})
    //         console.log(error.name);
    //     }
    // }

    

    // const handleSetDiscription = (e) => {
    //     setDiscription(e.target.value)
    //     if(!discription) {
    //         setError({discription:"Discription required Please select again!"})
    //     }
    // }
    const submit = async (e) => {
        e.preventDefault()
        console.log('name:', name, "discription:", discription, " coodinate:", lng, lng, rate, openTime)
        if(!name) {
              setError({name:"Name required!"})
            console.log(error.name);
        }
        if(!discription) {
            setError({discription:"Discription required Please select again!"})
        }

        try {
            
            const newWashroom = {
                name,
                discription,
                coordinate: {lat: lat, lng: lng},
                openTime,
                rate,

            }
            await axios.post("http://localhost:5000/washroom/add", newWashroom)
            alert("Washroom Data added. Thank you!")
            setConfirmed(false)
        } catch(err) {
            console.log("Error: ",err.response)
        }
    }
    
    return (
        <div className="addWashroom">
            <h2>Add washroom detail</h2>
            <div className="washroom-container">

            <form className="addForm" onSubmit={submit}>
                <label htmlFor='placeName'>Place name</label>
                <input type='text'
                        className="addInfo"
                        id='placeName'
                        onChange={(e) => setName(e.target.value)} />
                {error.name && <p className="validate">{error.name}</p>}        
                <label htmlFor='discription'>Discription</label>
                <select id='discription' className="addInfo"name='discription' onChange={(e) => setDiscription(e.target.value)}>
                    <option value="" selected disabled hidden>Choose here</option>
                    <option value="Publish washroom">Publish washroom</option>
                    <option value="Portable toilet">Portable toilet</option>
                    <option value="Washroom in the store">Washroom in the store</option>
                    <option value="Customer only in the Store">Customer only in the store</option>
                </select>
                {error.discription && <p className="validate">{error.discription}</p>}
                <label htmlFor='OpenTime'>Available time</label>
                <input type='text'
                        id='openTime'
                        className="addInfo"
                        // value="No data"
                        onChange={(e) => setOpenTime(e.target.value)} />
                <label htmlFor='rate'>Clean rate(0-5)</label>
                <input type='range'
                        id='rate'
                        className="addInfo range"
                        min="0" max="5"
                        onChange={(e) => setRate(e.target.value)} />
                <input className="submit" type='submit' value='Add washroom' />
            </form>
            </div>
        </div>
    )
}

export default AddWashroom
