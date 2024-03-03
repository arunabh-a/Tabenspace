import React, { useEffect, useState } from 'react'
import './styles/tile.css'
import { firebaseConfig, app } from '../firebaseConfig'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


const Tile = ({label, icon, link}) => {

    const [iconUrl, setIconUrl] = useState(null);

    useEffect(() => {
        const fetchIcon = async () => {
            const storage = getStorage(app);
            const iconRef = ref(storage, icon);
        
            const url = await getDownloadURL(iconRef);
            setIconUrl(url);
            }
    
        fetchIcon();
    }, [icon]);
    

    return (
        <a href={link} className="tile">
            <button className="more">
                <img src="/icons/light/More_Options.png" alt="/icons/light/Icon.png" /> 
            </button>
            <div className="icon-container">
                {iconUrl && <img src={iconUrl} alt="Icon" />}
            </div>
            <label id="tilename">{label}</label>
        </a>
    )
}

export default Tile