import React, {useState}from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios'
// import "../App.scss"
import './EditModal.scss'

const customStyles = {
  overlay: {
    zIndex: "100",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: "1rem",
    fontFamily: "'Quicksand', sans-serif"
    // margin: "2rem"
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function EditModal({setIsOpen, modalIsOpen, chose}) {
  let subtitle;
  const [name, setName] = useState('');
    const [discription, setDiscription] = useState('')
    // let [coordinate, setCoordinate] = useState({lat:null, lng:null})
    const [rate, setRate] = useState(null)
    const [openTime, setOpenTime] = useState('')
    const [error, setError] = useState({})
//   const [modalIsOpen, setIsOpen] = useState(false);

//   function openModal() {
//     setIsOpen(true);
//   }
    console.log(setIsOpen);
    console.log("propsFromchose:", chose)
    // setCoordinate({lat:chose})
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const submitHandler = async (e) => {
    e.preventDefault()
    
    if(!name) setName(chose.name);
    if(!discription) setDiscription(chose.discription)
    if(!rate) setRate(chose.rate)
    if(!openTime) setOpenTime(chose.openTime)
    
    const time = new Date()
    console.log('name:', name, "discription:", discription, " coodinate:", chose.coordinate.lat, chose.coordinate.lng, rate, openTime, time)
    
    try {
        
        const updateWashroom = {
            name,
            discription,
            coordinate: {lat: chose.coordinate.lat, lng: chose.coordinate.lng},
            openTime,
            rate,
            time: time

        }

        await axios.post(`http://localhost:5000/washroom/${chose._id}`, updateWashroom)
        alert("Washroom Data Updated. Thank you!")
        closeModal();
    } catch(err) {
        console.log("Error: ",err.response)
    }
}
    const deleteHandler = async () => {
        try {
            await axios.delete(`http://localhost:5000/washroom/${chose._id}`)
            const checkDelete = window.confirm('Are you sure to delete this wasroom data?')
            if(checkDelete) closeModal()
        } catch(err) {
            console.log("Error: ",err.response)
        }
    }

  return (
    <div id="EditModal"className="editModal">
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <button onClick={closeModal}>close</button> */}
        <i className="fas fa-times closeBtn" onClick={closeModal} ></i>
        <h2 className="title" ref={(_subtitle) => (subtitle = _subtitle)}>Update washroom data</h2>
        <div className="washroom-container">

            <form className="addForm" onSubmit={submitHandler}>
                    <label htmlFor='placeName'>Place name</label>
                    <input type='text'
                            className="addInfo"
                            id='placeName'
                            placeholder={chose.name}
                            onChange={(e) => setName(e.target.value)} />
                    {/* {error.name && <p className="validate">{error.name}</p>}         */}
                    <label htmlFor='discription'>Discription</label>
                    <select id='discription' className="addInfo" name='discription' 
                            // placeholder={chose.discription} 
                            defaultValue={chose.discription} 
                            onChange={(e) => setDiscription(e.target.value)}>
                        {/* <option value="" selected disabled hidden>Choose here</option> */}
                        <option value="Publish washroom">Public washroom</option>
                        <option value="Portable toilet">Portable toilet</option>
                        <option value="Washroom in the store">Washroom in the store</option>
                        <option value="Customer only in the Store">Customer only in the store</option>
                    </select>
                    {/* {error.discription && <p className="validate">{error.discription}</p>} */}
                    <label htmlFor='OpenTime'>Available time</label>
                    <input type='text'
                            id='openTime'
                            className="addInfo"
                            placeholder={chose.openTime}
                            onChange={(e) => setOpenTime(e.target.value)} />
                    <label htmlFor='rate'>Clean rate(0-5)</label>
                    <input type='range'
                            id='rate'
                            className="addInfo range"
                            min="0" max="5"
                            placeholder={chose.rate}
                            onChange={(e) => setRate(e.target.value)} />
                    <div className="btn-in-edit">
                    <input className="submit" type='submit' value='Update washroom' />
                    <button className="delete" onClick={deleteHandler}><i className="fas fa-trash-alt"></i> Delete</button>

                    </div>
                </form>
        </div>
      </Modal>
    </div>
  );
}

// ReactDOM.render(<App />, );
export default EditModal