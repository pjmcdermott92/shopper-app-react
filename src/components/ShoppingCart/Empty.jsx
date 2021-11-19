import React from 'react';
import { uiActions } from '../../services/actions';
import './ShoppingCart.scss';

const Empty = ({ closeCart }) => {

    const startShopping = () => {
        uiActions.setCurrentView({ view: 'home' });
        closeCart();
    }

    return (
        <div className='cart-empty'>
            <h3>Your Cart is currently empty.</h3>
            <i className='fas fa-shopping-basket' />
            <p>Do some shopping to fill your cart up with cool swag!</p>
            <button
                className='btn btn-outline'
                onClick={startShopping}
            >
                Start Shopping
            </button>
        </div>
    )
}

export default Empty;
