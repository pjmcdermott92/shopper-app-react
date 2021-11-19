import React, { Component } from 'react';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';
import ShippingForm from './ShippingForm';
import OrderConfirmation from './OrderConfirmation';
import { Loading } from '../layout';
import NotificationService from '../../services/notification-service';
import { SET_CHECKOUT_INFO, UPDATE_CART } from '../../services/types';
import { checkout, uiActions } from '../../services/actions';
import './Checkout.scss';

const ns = new NotificationService();

const initialState = {
    loading: true,
    data: {},
    showShippingForm: true,
    showPaymentForm: false,
    showOrderConfirmation: false
}

export default class Checkout extends Component {
    state = { ...initialState }

    setCheckoutInfo = data => this.setState({ data: data, loading: false })
    showPaymentForm = () => this.setState({ showShippingForm: false, showPaymentForm: true });
    showOrderConfirmation = () => this.setState({ showPaymentForm: false, showOrderConfirmation: true });

    updateCart = async cart => {
        if (!cart.items || !cart.items.length) return uiActions.setCurrentView({ view: 'home' });
        await checkout.loadCheckout();
    }

    componentDidMount = async () => {
        ns.subscribe(SET_CHECKOUT_INFO, this, this.setCheckoutInfo);
        ns.subscribe(UPDATE_CART, this, this.updateCart);
        await checkout.loadCheckout();
    }

    componentWillUnmount = () => {
        ns.unsubscribe(SET_CHECKOUT_INFO, this);
        ns.unsubscribe(UPDATE_CART, this);
    }

    render() {
        const { loading, data } = this.state;
        if (loading) return <Loading />
        return (
            <>
            <h1 className='text-primary'>Checkout</h1>
            {data.user && data.user !== null ? (
                <div className='checkout-container'>
                    <div className='checkout-form'>
                        <ShippingForm
                            {...this.state}
                            setShippingMethod = {this.setShippingMethod}
                            showPaymentForm = {this.showPaymentForm}
                        />
                        <PaymentForm
                            {...this.state}
                            showOrderConfirmation = {this.showOrderConfirmation}
                        />
                        <OrderConfirmation {...this.state} />
                    </div>
                    <OrderSummary {...this.state.data} />
                </div>
            ) : (
                <div className='checkout-login'>
                    <p>Please <strong>Log In</strong> or <strong>Register</strong> to continue checking out</p>
                    <button
                        className='btn btn-block btn-primary'
                        onClick = {() => uiActions.setCurrentView({view: 'login', productId: null, redirect: 'checkout'})}
                    >
                        Log In
                    </button>
                    <button
                        className='btn btn-block btn-primary'
                        onClick = {() => uiActions.setCurrentView({view: 'register', productId: null, redirect: 'checkout'})}
                    >
                        Register
                    </button>
                </div>
            ) }
            </>
        )
    }
}
