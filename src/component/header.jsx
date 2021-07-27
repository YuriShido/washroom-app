import React from 'react'
import "../App.scss"
import About from './About'

const Header = () => {
    const [AboutModalOpen, setAboutModalOpen] = React.useState(false);

    // const handleAboutModal = () => {
    //     setAboutModalOpen= true
    // }
    return (
        <div className="header-container">
            <img className="top-icon" src="/img/toilet-icon.png" alt="toilet mark"/>
            <h1>Run Van W/C</h1>
            <p className="about" onClick={() => setAboutModalOpen(true)}>About</p>
            {
                AboutModalOpen ? (
                    <About AboutModalOpen={AboutModalOpen} setAboutModalOpen={setAboutModalOpen}/>
                )  : null
            }
        </div>
    )
}

export default Header
