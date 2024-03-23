import React from 'react'
import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from '../firebaseConfig'
import '../App.css'
import Tile from '../components/tile'
import Nav from '../components/nav'
import AddTile from '../components/addTile'

const Dash = () => {
    const [tiles, setTiles] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const tileRef = ref(db, 'Tiles/');
    
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



