import React, { Component } from 'react';
import reactDom from 'react-dom';
import { Loading, ErrorPage } from '../layout';
import Empty from './Empty';
import CartItem from './CartItem';
import NotificationService from '../../services/notification-service';
import { SHOW_CART_MODAL, UPDATE_CART } from '../../services/types';
import { uiActions } from '../../services/actions';
import './ShoppingCart.scss';

const ns = new NotificationService();
const initialState = {
    modalOpen: false,
    loading: false,
    error: false,
    cart: [],
    orderTotal: {}
}

export default class ShoppingCart extends Component {
    state = { ...initialState }

    setShowCartModal = value => {
        this.setState({ modalOpen: value });
        if (value) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
    }

    setCart = cartData => this.setState({ cart: cartData });

    goToCheckout = () => {
        this.setShowCartModal(false);
        uiActions.setCurrentView({ view: 'checkout' });
    }

    componentDidMount = () => {
        ns.subscribe(UPDATE_CART, this, this.setCart);
        ns.subscribe(SHOW_CART_MODAL, this, this.setShowCartModal);
    }

    componentWillUnmount = () => {
        ns.unsubscribe(UPDATE_CART, this);
        ns.unsubscribe(SHOW_CART_MODAL, this);
    }

    render() {
        const { modalOpen, loading, error, cart } = this.state;
        if (!modalOpen) return null;
        return reactDom.createPortal (
            <>
            <div className='modal-overlay' onClick={() => this.setShowCartModal(false)} />
            <div className='modal'>
                <div className='modal-header'>
                    <h2>Cart</h2>
                    <button className='modal-close-btn' onClick={() => this.setShowCartModal(false)}>&times;</button>
                </div>
                {
                    loading ? <Loading /> : error ? <ErrorPage message={error} />
                        : !cart.items || !cart.items.length
                            ? <Empty closeCart={() => this.setShowCartModal(false)} />
                            : (
                                <>
                                <div className='modal-sub-header'>
                                    <p>{cart.count ? cart.count : 0 } Item{cart.count === 1 ? '' : 's' }</p>
                                </div>
                                <div className='cart-body'>
                                    {
                                        cart.items.map(item => {
                                            return <CartItem key={item.item_id} { ...item } />
                                        })
                                    }
                                </div>
                                <div className='modal-footer'>
                                    <p className='order-subtotal'>
                                        <span>Order Subtotal:</span>
                                        <span>{cart.subtotal_text}</span>
                                    </p>
                                    <p>Tax and Shipping will be calculated during checkout.</p>
                                    <button
                                        className='btn btn-block btn-dark'
                                        onClick={this.goToCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                                </>
                            )
                }
            </div>
            </>,
            document.getElementById('portal')
        )
    }
}
