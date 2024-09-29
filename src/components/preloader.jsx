import React from 'react'
import './styles/preloader.css'

const Preloader = ({ loading, loadCaption }) => {
    return (
        <div className={`loaderContainer ${loading ? '' : 'hide'}`}>
            <div className="loadingspinner">
                <div id="square1"></div>
                <div id="square2"></div>
                <div id="square3"></div>
                <div id="square4"></div>
                <div id="square5"></div>
            </div>

            <h1 className="loadCaption">{loadCaption}</h1>

        </div>
    )
}

export default Preloader