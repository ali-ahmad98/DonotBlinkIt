import React from 'react';

export const Loader = () => {
    return (<div style={LoaderParent}>

        <div style={LoaderChild} className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>)
}

const LoaderParent = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: 'rgb(255 255 255 / 80%)'
}

const LoaderChild = {
    position: 'absolute',
    margin: '0 auto',
    left: 0,
    right: 0,
    top: '50%'
}