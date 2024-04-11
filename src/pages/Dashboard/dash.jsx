import React from 'react'
import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from '../../firebaseConfig'
import './dash-style.css'
import '/src/index.css'
import '/src/App.css'
import Tile from '../../components/tile'
import Nav from '../../components/nav'
import AddTile from '../../components/addTile'
// import { tileRef } from '../Login/login';

const Dash = () => {
    const [tiles, setTiles] = useState([]);

    useEffect(() => {
        // Set styles when component mounts
        document.body.style.backgroundColor = '#F7FBFC';
        // Other styles...
    
        // Revert styles when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
          // Reset other styles...
        };
      }, []);

    useEffect(() => {
        const db = getDatabase(app);
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
            } 
            else {
                console.log("No data available");
            }
        });
    }, 
    []);

    return (
        <div className="App">
            <Nav />
            <div className="tiles">
                {tiles.map((tile) => (
                    <Tile
                        key={tile.id}
                        label={tile.label}
                        icon={tile.icon}
                        link={tile.link}
                    />
                ))}
            </div> 
            <AddTile />
            

        </div>
    )
}

export default Dash



