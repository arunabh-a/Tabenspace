import React, { useState } from 'react'
import './styles/tileEdit.css'
import { getDatabase, ref as dbref, get, set, child } from "firebase/database";
import { getStorage, ref as storageref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';


const TileEdit = ({ onClose }) => {
    const [icon, setIcon] = useState(null);
    const [iconURL, setIconURL] = useState(null);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        setIcon(file);
        setIconURL(URL.createObjectURL(file));
    }

    const handleSave = async (e) => {
        e.preventDefault();
    
        const db = getDatabase(app);
        const storage = getStorage(app);
        const tileRef = dbref(db, 'Tiles/');
        
        let newKey = e.target.title.value.toLowerCase().replace(/\s+/g, '-');
        let originalKey = newKey;
        let count = 1;
    
        const snapshot = await get(tileRef);
        const existingKeys = snapshot.exists() ? Object.keys(snapshot.val()) : [];
    
        while (existingKeys.includes(newKey)) {
            newKey = originalKey + '-' + count;
            count++;
        }
    
        const iconRef = storageref(storage, 'images/' + newKey);
        const uploadTask = uploadBytesResumable(iconRef, icon);
    
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('File available at', downloadURL);
    
                const newTile = child(tileRef, newKey);
                
                set(newTile, {
                    label: e.target.title.value,
                    link: e.target['website-URL'].value,
                    icon: downloadURL
                });
    
                onClose();
            }
        );
    }
    

    return (
        <div className='t-backdrop'>
            <form className="tile-edit" onSubmit={handleSave}>
                <div className="icon-canvas">
                    <img src={iconURL} alt='' />
                <input id='file-input' type="file" onChange={handleIconChange} />
                </div>

                <label className="icon-change">Change Icon</label>
                <div className="tile-fields">
                    <input type="text" name="title" id="tile" placeholder="Tile Title" />
                    <input type="text" name="website-URL" id="website-URL" placeholder="Site Link" />
                    {/* <input type="text" name="group" id="group" placeholder="group"> */}
                </div>
                <div className="tile-buttons">
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button className="save" type='submit'>Save</button>
                </div>
            </form>
        </div>
    );
}

export default TileEdit