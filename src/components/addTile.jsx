import React, { useState } from 'react'
import './styles/addTile.css'
import TileEdit from './modals/tileEdit'

const AddTile = () => {
    const [showModal, setShowModal] = useState(false)

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
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