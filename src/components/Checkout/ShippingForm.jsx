import React, { Component } from 'react';
import { InputBase, Select } from '../Inputs';
import { states } from '../../constants';
import checkFieldInput from '../../utils/checkField';
import { formatPhoneNumber, validateShippingFields } from './form-handlers';
import { checkout } from '../../services/actions';
import './Checkout.scss';

const inputFields = [
    { name: 'firstname', label: 'First Name', type: 'text', required: true },
    { name: 'lastname', label: 'Last Name', type: 'text', required: true },
    { name: 'street', label: 'Street Address', type: 'text', required: true },
    { name: 'unit', label: 'Unit', type: 'text' },
    { name: 'zip', label: 'Zip', type: 'text', required: true, maxLength: 5 },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'select', options: states, required: true },
    { name: 'phone', label: 'Telephone', type: 'text', required: true, maxLength: 10 },
];

const initialState = {
    fields: {
        firstname: '',
        lastname: '',
        street: '',
        unit: '',
        zip: '',
        city: '',
        state: '',
        phone: '',
    },
    errors: {}
}

export default class ShippingForm extends Component {
    state = { ...initialState }
    
    onChange = async e => {
        const { name, value } = e.target;
        if (!checkFieldInput(e)) return;
        this.setState(prevState => ({
            fields: { ...prevState.fields, [name]: value },
            errors: { ...prevState.errors, [name]: ''}
        }));
        if (name === 'zip' && value.length === 5) {
            const location = await checkout.getLocation(value);
            if (location.message) return this.setState(prevState => ({
                fields: { ...prevState.fields, city: '', state: '' },
                errors: { ...prevState.errors, zip: location.message }
            }));
            this.setState(prevState => ({
                errors: { ...prevState.errors, zip: '', city: '', state: '' },
                fields: {
                    ...prevState.fields,
                    city: location.data.city,
                    state: location.data.state
                }
            }));
            await checkout.getTaxCost(location.data.zip, location.data.state);
        };
        if (name === 'phone') return this.setState(prevState => ({
            fields: { ...prevState.fields, phone: formatPhoneNumber(value) }
        }));
    }

    onSubmit = e => {
        e.preventDefault();
        const errors = validateShippingFields(this.state.fields);
        if (Object.keys(errors).length) return this.setState({
            errors: errors
        });
        checkout.setShippingInfo(this.state.fields);
        this.props.showPaymentForm();
    }

    changeShipping = e => checkout.setShippingMethod(e.target.value);

    componentDidMount = () => {
        this.setState(prevState => ({
            fields: {
                ...prevState.fields,
                firstname: this.props.data.user.firstname,
                lastname: this.props.data.user.lastname
            }
        }));
    }

    render() {
        const { shippingMethods } = this.props.data;
        const { fields, errors } = this.state;
        return (
            <section  className='form-wrapper shipping-form'>
                <h3>
                    Shipping Details
                    <i className='fa fa-truck' />
                </h3>
                {
                    this.props.showShippingForm && <form onSubmit={this.onSubmit} noValidate>
                        <div className='form-flex'>
                            {
                                inputFields && inputFields.map(field => {
                                    const { name, label, type, required, options, maxLength } = field;
                                    if (type === 'select') return (
                                        <Select
                                            key={name}
                                            name={name}
                                            label={label}
                                            required={required}
                                            options={options}
                                            value={fields[name]}
                                            error={errors[name]}
                                            onChange={this.onChange}
                                            onBlur={this.onBlur}
                                        />
                                    );
                                    else return (
                                        <InputBase
                                            key={name}
                                            name={name}
                                            label={label}
                                            required={required}
                                            value={fields[name]}
                                            error={errors[name]}
                                            onChange={this.onChange}
                                            onBlur={this.onBlur}
                                            maxLength={maxLength}
                                        />
                                    )
                                })
                            }
                        </div>
                        <h4>Shipping Method</h4>
                        <ul className='shipping-methods'>
                            {
                                shippingMethods && shippingMethods.map(method => {
                                    const { id, description, price_text } = method;
                                    return (
                                        <li key={id} className='shipping-method'>
                                            <input
                                                id={id}
                                                name='shipping'
                                                type='radio'
                                                value={id}
                                                onChange={this.changeShipping}
                                                checked={this.props.data.shipping.method === id}
                                            />
                                            <label htmlFor={id}>
                                                <span>{description}</span>
                                                <span>{price_text}</span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <button className='btn btn-block btn-primary'>
                            Continue to Payment
                        </button>
                    </form>
                }
            </section>
        )
    }
}
