import React, { Component } from 'react';
import InputBase from '../Inputs/InputBase';
import Alert from '../layout/Alert/Alert';
import Link from '../Views/Link';
import { Loading } from '../layout'
import { validateLogin } from './form-validations';
import { auth, uiActions } from '../../services/actions';
import './Auth.scss';

const inputFields = [
    { name: 'email', label: 'Email Address', type: 'email', autofocus: true, required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
];

const initialState = {
    loading: false,
    error: '',
    fields: { email: '', password: '' },
    errors: {}
}

export default class Login extends Component {
    state = { ...initialState }

    onChange = ({ target: { name, value } }) => {
        this.setState(prevState => ({
            fields: { ...prevState.fields, [name]: value }
        }));
    }

    onSubmit = async e => {
        e.preventDefault();
        this.setState({ errors: {} });
        const errors = validateLogin(this.state.fields);
        if (Object.keys(errors).length) return this.setState({
            errors: { ...errors }
        });
        this.setState({ loading: true });
        const user = await auth.logInUser(this.state.fields);
        if (!user.success) return this.setState({
            loading: false,
            error: user.message
        });
        const newView = this.props.redirect ? this.props.redirect : 'home';
        uiActions.setCurrentView({ view: newView });
    }

    render() {
        const { loading, error, fields, errors } = this.state;
        if (loading) return <Loading />
        return (
            <div className='auth-form-container'>
                <h1 className='text-primary text-center text-xl my-2'>Log In</h1>
                <p className='text-center'>Enter your <strong>email address</strong> and <strong>password</strong> to login.</p>
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
                    <button className='btn btn-block btn-primary'>Log In</button>
                </form>
                <p className='text-center my-2'>Need an account? <Link view='register' redirect={this.props.redirect}>Register</Link></p>
            </div>
        )
    }
}
