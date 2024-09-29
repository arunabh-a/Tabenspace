import React from 'react'
import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { app, storage, db, auth } from '../../firebaseConfig'
import { signOut } from 'firebase/auth';
import './dash-style.css'
import '/src/index.css'
import '/src/App.css'
import Tile from '../../components/tile'
import Nav from '../../components/nav'
import AddTile from '../../components/addTile'
import Preloader from '../../components/preloader';

// import { tileRef } from '../Login/login';


const Dash = () => {
    const [tiles, setTiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.backgroundColor = '#F7FBFC';

        return () => {

            document.body.style.backgroundColor = '';
        
        };
    }, []);

    useEffect(() => {
        const tileRef = ref(db, 'Tiles/');
        // const tileRef = ref(db, 'Users/' + user.uid + '/Tiles');
    
        onValue(tileRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tilesArray = [];
        
                for (let id in data) {
                tilesArray.push({ id, ...data[id] });
                }
        
                setTiles(tilesArray);
                setLoading(false);
            } 
            else {
                console.log("No data available");
                setLoading(false);
            }
        });
}, 
[]);

    if (loading) {
        return <Preloader loading={loading} loadCaption={"Preloading Stuff ..."} />;
    }

    const handleLogout = () => {

    try {
        signOut(auth);
        console.log("User signed out successfully.");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    return (
        <div className="App">
            <Nav />
            <div className="tiles">
                {tiles.map((tile, index) => (
                    <Tile
                        key={tile.id}
                        label={tile.label}
                        icon={tile.icon}
                        link={tile.link}
                        onIconLoad={(error) => {
                            if (index === tiles.length - 1) {
                                setLoading(false); // Hide the preloader
                            }
                            if (error) {
                                console.error('Error loading icon:', error);
                            }
                        }}  
                    />
                ))}
            </div> 
            <AddTile />
            <button id="logout" onClick={handleLogout}>Logout</button>

        </div>
    )
}

export default Dash


