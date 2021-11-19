import React from 'react';
import './Alert.scss'

const Alert = ({ message, type = 'warning' }) => {
    return (
        <div className={`alert ${type}`}>
            {message}
            { type === 'info' &&
                <span className='info-icon'>
                    <i className='fas fa-info' />
                </span>
            }
        </div>
    )
}

export default Alert;
