import React, { useEffect, useState } from 'react';
import './styles/nav.css'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';


const Nav = () => {

    const [imageUrl, setImageUrl] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const storage = getStorage(app);
            const imageRef = ref(storage, 'gs://tabenspace.appspot.com/gameme.png');

            const url = await getDownloadURL(imageRef);
            setImageUrl(url);
        }

        fetchImage();
    }, []);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
    }


    return (
        <nav>
            <form onSubmit={handleSubmit} className="search-control">
                <input 
                type="search" 
                id="search" 
                placeholder="Search on Google" 
                className="input"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}  
                />
                <span className="input-border input-border-alt"></span>
            </form>

            <div className="profile-section">
                <div id="profile-container">
                    {imageUrl && <img src={imageUrl} alt="" className="pfp" />}
                </div>
                <a>Hey, Arunabh</a>
            </div>

        </nav>
    )
}

export default Nav