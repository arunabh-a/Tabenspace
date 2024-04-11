import React, { useState } from 'react'
import './styles/addTile.css'
import TileEdit from './modals/tileEdit'

const AddTile = () => {
    const [showModal, setShowModal] = useState(false)

    const handleOpenModal = () => {
        setShowModal(true);
        document.body.classList.add('modal-active');
    }

    const handleCloseModal = () => {
        document.getElementById('modal-container').classList.add('out'); // Add class for closing animation
        document.body.classList.remove('modal-active');
        setTimeout(() => {
            setShowModal(false);
        }, 300);
    }

    return (
        <div id="tile-add-container">
            <button id="addTile" onClick={handleOpenModal}>
                <img src="/icons/light/Vector.png" alt="Add" />
            </button>
            {showModal && <TileEdit show={showModal} onClose={handleCloseModal} />}
        </div>
    )
}

export default AddTile