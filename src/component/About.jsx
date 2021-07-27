import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './About.scss'


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
    fontFamily: "'Quicksand', sans-serif"

  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function About({AboutModalOpen, setAboutModalOpen}) {


//   function afterOpenModal() {
//     // references are now sync'd and can be accessed.
//     subtitle.style.color = '#f00';
//   }

  function closeModal() {
    setAboutModalOpen(false);
  }

  return (
    <div className="AboutModal">
      
      <Modal
        isOpen={AboutModalOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="About Modal"
      >
        <div className="about-box">
        <i className="fas fa-times closeBtn" onClick={closeModal} ></i>
        <h1><i className="fas fa-question"></i> About</h1>
         <p>This is an apprication for <strong>finding washroom in Vancouver</strong>.<br />
          You can add washroom information to help other users who want to know where is the nearby washroom spot! Let's add and help each other!</p>
        
        <h2><i className="fas fa-mobile-alt"></i>  How to use</h2>
        <div className="explain">
            <img className="icon" src="/img/public-washroom2.svg" alt="washroom icon"/>
            <p>This marker is public washroom data from city of Vancouver</p>
        </div>
        <div className="explain">
            <img src="/img/mark.svg" className="icon" alt="washroom icon"/>
            <p>This marker is added washroom information from this app owner or user.<br />
                You can add and update and delete added informatins too.
            </p>
        </div>
            <h3><i className="far fa-hand-point-up"></i>  How to add the washroom</h3>
            <ol>
                <li>Click the mouse on the map</li>
                <li>add washroom detail when you add the washroom Marker</li>
                <li>You can updete and delete the data that is already exsist with black marker</li>
            </ol>
        </div>
        
        
      </Modal>
    </div>
  );
}

export default About
// ReactDOM.render(<App />, appElement);