import React, { useEffect } from 'react';
import './styles/tileOption.css';
import trash from '/public/icons/light/trash.svg';

const TileOption = ({ onClose, triggerRef }) => {

    const buttonRef = React.useRef(null);

    const [modalPosition, setModalPosition] = React.useState({ top: 0, left: 0 });

    useEffect(() => {
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setModalPosition({
              top: buttonRect.bottom + window.scrollY, // Position below the button
              left: buttonRect.left + window.scrollX, // Align with the left side of the button
            });
        }
    }, [triggerRef]);

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className='modal-container' id='modal-container' onClick={onClose}>
                
                <div 
                    className="modal" 
                    style={{
                        top: `${modalPosition.top}px`,
                        left: `${modalPosition.left}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}>
                    
                    <button className="edit mod-btn">Edit</button>
                    <button className="delete mod-btn" onClick={onClose}>
                    {/* <img src={trash} alt="Delete Tile" /> */}
                        Delete  
                    </button>
                </div>
            </div>
        </>
    );
};

export default TileOption;
