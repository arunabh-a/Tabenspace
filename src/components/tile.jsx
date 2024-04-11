import React, { useEffect, useState } from 'react'
import './styles/tile.css'
import { firebaseConfig, app } from '../firebaseConfig'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// import fallbackImage from '../../public/icons/light/Icon.png';


const Tile = ({label, icon, link}) => {

    const [iconUrl, setIconUrl] = useState(null);

    useEffect(() => {
        const fetchAndCacheIcon = async () => {
            try {
                const cache = await caches.open('app-icons');
                const cachedResponse = await cache.match(icon);
        
                if (cachedResponse) {
                // Use the cached icon URL
                    const cachedUrl = await cachedResponse.url;
                    setIconUrl(cachedUrl);
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
                    } 
                    else {
                        throw new Error(`Icon fetch failed with status: ${response.status}`);
                    }
                }
            } 
            catch (error) {
                console.error('Error fetching and caching icon:', error);
            }
        };
    
        fetchAndCacheIcon();
    }, [icon]);
    
    // const handleImageError = (event) => {
    //     event.target.src = fallbackImage;

    return (
        <a href={link} className="tile">
            <button className="more">
                <img src="/icons/light/More_Options.png" alt="" /> 
            </button>
            <div className="icon-container">
                {iconUrl && <img src={iconUrl} alt="" />}
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