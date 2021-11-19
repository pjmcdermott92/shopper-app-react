import React, { Component } from 'react';
import './Inputs.scss';

export default class InputBase extends Component {
    state = { showPassword: false }

    togglePassword = () => this.setState(prevState => ({ showPassword: !prevState.showPassword }));

    render() {
        const { showPassword } = this.state;
        const {
            name,
            value,
            type,
            label,
            required,
            error,
            placeholder,
            onChange,
            onBlur,
            maxLength,
            autoFocus,
            card
        } = this.props;
        return (
            <div className={`form-group ${error ? 'error' : ''}`}>
                <label htmlFor={name}>
                    {label} { required && <i className='fa fa-asterisk' /> }
                </label>
                <input
                    type={`${ type === 'password' && showPassword ? 'text' : type }`}
                    name={name}
                    id={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete='cc-csc'
                    required={required}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                />
                { error && <span className='error-message'>{error}</span> }
                { type === 'password' && (
                    <div
                        className='toggle-icon'
                        role='button'
                        title={`${showPassword ? 'Hide' : 'Show'} Password`}
                        onClick={this.togglePassword}
                    >
                        { 
                            showPassword
                            ? <i className='fas fa-eye-slash' />
                            : <i className='fas fa-eye' />
                         }
                    </div>
                ) }
                {name === 'cardnumber' && (
                    <div className='card-img'>
                        {
                            card
                            ? <img src={card} alt='Card' />
                            : <i className='far fa-credit-card' />
                        }
                    </div>
                )}
            </div>
        )
    }
}
