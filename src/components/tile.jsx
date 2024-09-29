import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import './styles/tile.css'
import { firebaseConfig, app } from '../firebaseConfig'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fallbackImage from '/public/icons/light/Icon.png';
import TileOption from './modals/tile-option';


const Tile = ({ label, icon, link, onIconLoad }) => {

    const [iconUrl, setIconUrl] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const handleOpenModal = () => {
        setShowModal(true);
        document.body.classList.add('modal-active');
    }

    const handleCloseModal = () => {
        document.body.classList.remove('modal-active');
        // Start the closing animation and then hide the modal
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.add('out');
            setTimeout(() => {
                setShowModal(false);
                modalContainer.classList.remove('out'); // Reset the animation class for next time
            }, 300); // This should match the duration of the closing animation
        }
    }


    useEffect(() => {
        const fetchAndCacheIcon = async () => {
            try {
                const cache = await caches.open('app-icons');
                const cachedResponse = await cache.match(icon);
        
                if (cachedResponse) {
                // Use the cached icon URL
                    const cachedUrl = await cachedResponse.url;
                    setIconUrl(cachedUrl);
                    onIconLoad();
                } 
                else {
                // Fetch the icon from Firebase Storage and cache it
                    const storage = getStorage(app);
                    const iconRef = ref(storage, icon);
                    const url = await getDownloadURL(iconRef);
                // Cache the fetched icon
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response.clone());
                        setIconUrl(url);
                        onIconLoad();
                    } 
                    else {
                        throw new Error(`Icon fetch failed with status: ${response.status}`);
                    }
                }
            } 
            catch (error) {
                console.error('Error fetching and caching icon:', error);
                onIconLoad(error);
            }
        };
    
        fetchAndCacheIcon();
    }, [icon]);


    const renderModal = () => {
        return ReactDOM.createPortal(
            <TileOption onClose={handleCloseModal} />,
          document.body // Append the modal as a child of the body element
        );
    };

    return (
        <a href={link} className="tile">
            <button className="more" onClick={handleOpenModal}>
                <img src="/icons/light/More_Options.png" alt="" /> 
            </button>
            
            {showModal && renderModal()}
            
            <div className="icon-container">

                <img
                    src={loaded ? iconUrl : fallbackImage}
                    alt={fallbackImage}
                    onLoad={() => setLoaded(true)}
                    onError={() => setIconUrl(fallbackImage)} // Fallback on error
                    loading="lazy" // Lazy loading
                    style={{ opacity: loaded ? 1 : 0 }} // Fade in the icon once loaded
                />
            </div>
            <label id="tilename">{label}</label>
        </a>
    );
};

export default Tile

// useEffect(() => {
//     const fetchAndCacheIcon = async () => {
//         try {
//             const cache = await caches.open('app-icons');
//             const cachedResponse = await cache.match(icon);
    
//             if (cachedResponse) {
//             // Use the cached icon URL
//                 const cachedUrl = await cachedResponse.url;
//                 setIconUrl(cachedUrl);
//             } 
//             else {
//             // Fetch the icon from Firebase Storage and cache it
//                 const storage = getStorage(app);
//                 const iconRef = ref(storage, icon);
//                 const url = await getDownloadURL(iconRef);
//             // Cache the fetched icon
//                 const response = await fetch(url);
//                 await cache.put(icon, response.clone());
//                 setIconUrl(url);
//             }
//         } 
//         catch (error) {
//             console.error('Error fetching and caching icon:', error);
//         }
//     };

//     fetchAndCacheIcon();
// }, [icon]);