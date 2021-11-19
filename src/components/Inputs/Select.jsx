import React from 'react';

const Select = ({
    name,
    value,
    label,
    required,
    error,
    onChange,
    onBlur,
    options,
    disabled
}) => {
    return (
        <div className={`form-group ${error ? 'error' : ''}`}>
            <label htmlFor={name}>
                {label} { required && <i className='fa fa-asterisk' /> }
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            >
                {options && options.map(option => {
                    return <option key={option} value={option}>{option}</option>
                })}
            </select>
            { error && <span className='error-message'>{error}</span> }
        </div>
    )
}

export default Select;
