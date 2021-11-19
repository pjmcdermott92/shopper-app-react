import React, { Component } from 'react';
import InputBase from '../Inputs/InputBase';
import Alert from '../layout/Alert/Alert';
import Link from '../Views/Link';
import { Loading } from '../layout';
import checkFieldInput from '../../utils/checkField';
import { validateRegister } from './form-validations';
import { auth, uiActions } from '../../services/actions';
import './Auth.scss';

const inputFields = [
    { name: 'firstname', label: 'First Name', type: 'text', required: true, autofocus: true },
    { name: 'lastname', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'password2', label: 'Confirm Password', type: 'password', required: true },
];

const initialState = {
    loading: false,
    error: '',
    fields: { firstname: '', lastname: '', email: '', password: '', password2: '' },
    errors: {}
}

const passwordAlert = {
    type: 'info',
    message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one of the following: ! @ # $ % < > * ( )'
}

export default class Register extends Component {
    state = { ...initialState }

    onChange = e => {
        if (!checkFieldInput(e)) return;
        const { name, value } = e.target;
        this.setState(prevState => ({
            fields: { ...prevState.fields, [name]: value }
        }));
    }

    onSubmit = async e => {
        e.preventDefault();
        this.setState({ errors: {} });
        const errors = validateRegister(this.state.fields);
        if (Object.keys(errors).length) return this.setState({
            errors: { ...errors }
        });
        this.setState({ loading: true });
        const newUser = await auth.registerUser(this.state.fields);
        if (!newUser.success) return this.setState(prevState => ({
            loading: false, error: newUser.message, fields: {
                ...prevState.fields, password: '', password2: ''
            }
        }));
        const newView = this.props.redirect ? this.props.redirect : 'home';
        uiActions.setCurrentView({ view: newView });
    }

    render() {
        const { loading, error, fields, errors } = this.state;
        if (loading) return <Loading />
        return (
            <div className='auth-form-container'>
                <h1 className='text-primary text-center text-xl my-2'>Register</h1>
                <p className='text-center'>Enter your information below to create an account.</p>
                { error && <Alert message={error} type='danger' />}
                <form onSubmit={this.onSubmit} noValidate>
                { inputFields && inputFields.map(field => {
                        const { name, label, type, required, autofocus } = field;
                        return <InputBase
                            key={name}
                            name={name}
                            label={label}
                            type={type}
                            value={fields[name]}
                            error={errors[name]}
                            required={required}
                            onChange={this.onChange}
                            autoFocus={autofocus}
                        />
                    }) }
                    <Alert {...passwordAlert} />
                    <button className='btn btn-block btn-primary'>Register</button>
                </form>
                <p className='text-center my-2'>Already have an account? <Link view='login' redirect={this.props.redirect}>Login</Link></p>
            </div>
        )
    }
}
