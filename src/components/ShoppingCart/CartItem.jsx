import React from 'react';
import CartActionBtn from '../CartActionBtn/CartActionBtn';
import { cart } from '../../services/actions';
import './ShoppingCart.scss';

const CartItem = ({ product_id, name, img, total_formatted, qty, in_stock }) => {
    return (
        <div className='cart-item'>
            <div className='cart-item-img'>
                <img src={img} alt={name} />
            </div>
            <div className='cart-item-body'>
                <h3 className='cart-item-title'>{name}</h3>
                <div className='cart-item-actions'>
                    <CartActionBtn
                        id={product_id}
                        inCart={qty}
                        inStock={in_stock}
                    />
                    <h3 className='cart-item-price'>{total_formatted}</h3>
                </div>
                <div>
                    <button className='remove-item-btn' onClick={() => cart.removeCartItem(product_id, true)}>
                        <i className='fa fa-trash-alt'></i> Remove
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartItem;
