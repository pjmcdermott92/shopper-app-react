import React, { Component } from 'react';
import { InputBase } from '../Inputs';
import { Alert } from '../layout';
import checkFieldInput from '../../utils/checkField';
import { formatCardData, validateCheckoutForm } from './form-handlers';
import './Checkout.scss';
import { checkout } from '../../services/actions';

const inputFields = [
    { name: 'cardholder', label: 'Cardholder Name', type: 'text', placeholder: 'Exactly as it appears on your card', required: true },
    { name: 'cardnumber', label: 'Card Number', type: 'text', placeholder: 'Visa, MasterCard, Discover, AMEX', required: true },
    { name: 'expmonth', label: 'Month', type: 'text', placeholder: 'MM', required: true, maxLength: 2 },
    { name: 'expyear', label: 'Year', type: 'text', placeholder: 'YY', required: true, maxLength: 2 },
    { name: 'cvc', label: 'CVC', type: 'text', required: true },
];

const initialState = {
    fields: { cardholder: '', cardnumber: '', expmonth: '', expyear: '', cvc: '' },
    errors: {},
    cvcMax: 3, cardMax: 19, cardIcon: null, cardType: null
}

export default class PaymentForm extends Component {
    state = { ...initialState }

    handleCardData = cardNumber => {
        const cardData = formatCardData(cardNumber);
        this.setState(prevState => ({
            errors: { ...prevState.errors, cardnumber: '' },
            fields: { ...prevState.fields, cardnumber: cardData.mask },
            cvcMax: cardData.cvcMax,
            cardMax: cardData.cardMax,
            cardType: cardData.cardType,
            cardIcon: cardData.cardIcon
        }));
    }

    onChange = e => {
        const { name, value } = e.target;
        if (!checkFieldInput(e)) return;
        if (name === 'cardnumber') return this.handleCardData(value);
        this.setState(prevState => ({
            fields: { ...prevState.fields, [name]: value },
            errors: { ...prevState.errors, [name]: '' }
        }));
        if (name === 'expmonth' || name === 'expyear') this.setState(prevState => ({
            errors: { ...prevState.errors, expmonth: '', expyear: '' }
        }));
    }

    onSubmit = e => {
        e.preventDefault();
        const errors = validateCheckoutForm(this.state);
        if (Object.keys(errors).length) return this.setState({
            errors: errors
        });
        const paymentInfo = {
            ...this.state.fields,
            cardType: this.state.cardType,
            cardIcon: this.state.cardIcon
        };
        checkout.setPaymentInfo(paymentInfo);
        this.props.showOrderConfirmation();
    }
    
    render() {
        const { fields, errors, cvcMax, cardMax, cardIcon } = this.state;
        return (
            <section  className='form-wrapper payment-form'>
                <h3>
                    Payment Details
                    <i className='fa fa-dollar-sign' />
                </h3>
                {
                    this.props.showPaymentForm && <form onSubmit={this.onSubmit} noValidate>
                        <div className='form-flex'>
                            {
                                inputFields && inputFields.map(field => {
                                    const { name, label, type, required, placeholder, maxLength } = field;
                                    return (
                                        <InputBase
                                            key={name}
                                            name={name}
                                            label={label}
                                            type={type}
                                            placeholder={placeholder}
                                            value={fields[name]}
                                            onChange={this.onChange}
                                            required={required}
                                            error={errors[name]}
                                            card={cardIcon}
                                            maxLength={
                                                name === 'cvc' ? cvcMax :
                                                name === 'cardnumber' ? cardMax :
                                                maxLength
                                            }
                                        />
                                    )
                                })
                            }
                        </div>
                        <Alert
                            type='info'
                            message='
                                The CVC Number ("Card Verification Code") on your credit or debit card is a
                                3-digit number on the reverse side of VISA&reg;, MesterCard&reg; and Discover&reg; branded
                                cards. On American Express&reg; branded cards, it is a 4-digit number.'
                        />
                        <button className='btn btn-block btn-primary'>
                            Place Order
                        </button>
                    </form>
                }
            </section>
        )
    }
}
