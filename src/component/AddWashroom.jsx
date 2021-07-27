import React, {useState}from 'react'
import axios from 'axios'
import Modal from 'react-modal';
import "../App.scss"

const AddWashroom = ({lat, lng, setConfirmed, addTime}) => {
    const [name, setName] = useState('');
    const [discription, setDiscription] = useState('')
    // let [coordinate, setCoordinate] = useState({lat:null, lng:null})
    const [rate, setRate] = useState(null)
    const [openTime, setOpenTime] = useState(null)
    const [error, setError] = useState({})
 

    function closeModal() {
        setConfirmed(false);
      }

    const submit = async (e) => {
        e.preventDefault()
        console.log('name:', name, "discription:", discription, " coodinate:", lng, lng, rate, openTime, addTime)
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
                time: addTime

            }
            console.log("addedinfo:",newWashroom);
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
                <select id='discription' className="addInfo" name='discription' 
                        onChange={(e) => setDiscription(e.target.value)}
                        defaultValue="public washroom">
                    <option value="" selected disabled hidden>Choose here</option>
                    <option defaultValue="public washroom" value="Publish washroom">Public washroom</option>
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
