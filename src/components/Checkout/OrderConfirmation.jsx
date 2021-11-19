import React from 'react';
import { checkout } from '../../services/actions';
import './Checkout.scss';

const OrderConfirmation = ({ showOrderConfirmation, ...props }) => {
    const { paymentDetails, shippingDetails, user } = props.data;
    const { confirmation, cardnumber, cardIcon, cardType } = paymentDetails;
    const { firstname, lastname, street, unit, city, state, zip, phone, method } = shippingDetails;
    return (
        <section className='form-wrapper order-confirmation'>
            <h3>
                Order Confirmation
                <i className='fa fa-check' />
            </h3>
            {
            showOrderConfirmation && <div className='confirmation'>
                <i className='fa fa-check' />
                <h4>Thank you for your purchase!</h4>
                <p className='text-lead'>Your Confirmation Number is: <strong>{confirmation}</strong></p>
                <p>A confirmation email will also be sent to: <strong>{user.email}</strong></p>
                <div className='flex'>
                    <div>
                        <h5>Shipping Details:</h5>
                        <address>
                            <strong>{firstname} {lastname}</strong><br />
                            {street}<br />
                            {unit ? <>Unit: {unit}<br /></> : null }
                            {city}, {state} {zip}<br />
                            {phone}
                        </address>
                    </div>
                    <div>
                        <h5>Shipping Method:</h5>
                        <p>{method}</p>
                    </div>
                    <div>
                        <h5>Payment Details:</h5>
                        <span className='card-info'>
                            <img src={cardIcon} alt={cardType} />
                            <p>{cardType} ending is <strong>{cardnumber}</strong></p>
                        </span>
                    </div>
                </div>
                <div className='button-wrapper'>
                    <button className='btn btn-block' onClick={() => window.print()}>Print Confirmation</button>
                    <button className='btn btn-block btn-primary' onClick={() => checkout.clearCheckout() }>
                        Back to Home
                    </button>
                </div>
            </div>
        }
        </section>
    )
}

export default OrderConfirmation;
