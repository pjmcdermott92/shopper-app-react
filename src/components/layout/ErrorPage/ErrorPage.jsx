import React from 'react';
import Alert from '../Alert/Alert';
import './ErrorPage.scss';

const ErrorPage = ({ message }) => {
    return (
        <div className='error-page'>
            <i className='far fa-frown' />
            <h1>Oh no!</h1>
            <p>An error has occured.</p>
            <Alert message={message} type='danger' />
        </div>
    )
}

export default ErrorPage;
