import React from 'react';
import Loader from './Loader';
import './Loading.scss';

const Loading = () => {
    return (
        <div className='loading-page'>
            <Loader />
            <p>LOADING...</p>
        </div>
    )
}

export default Loading;
