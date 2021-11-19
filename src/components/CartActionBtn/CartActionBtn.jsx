import React, { Component } from 'react';
import { Loader } from '../layout';
import { cart } from '../../services/actions';
import './CartActionBtn.scss';

export default class CartActionBtn extends Component {
    state = { loading: false };

    checkDisabled = () => this.props.inCart === this.props.inStock ? true : false;
    
    addCartItem = async () => {
        this.setState({ loading: true });
        const addItem = await cart.addItemToCart(this.props.id);
        if (addItem.success) this.setState({ loading: false });
    }

    removeCartItem = async () => {
        this.setState({ loading: true });
        await cart.removeCartItem(this.props.id);
        if (this._isMounted) this.setState({ loading: false });
    }

    componentDidMount = () => this._isMounted = true;
    componentWillUnmount = () => this._isMounted = false;

    render() {
        const { loading } = this.state;
        const { inCart } = this.props;
        return (
            <div className='cart-action-btn'>
                {
                    loading ? <Loader /> : !inCart || inCart < 1 ? (
                        <button className='add-btn' onClick={this.addCartItem}>
                            <i className='fa fa-cart-plus' /> Add to Cart
                        </button>
                    ) : (
                        <div className='cart-qty-actions'>
                            <button
                                onClick={this.removeCartItem}
                            >
                                -
                            </button>
                            <span>{inCart}</span>
                            <button
                                onClick={this.addCartItem}
                                disabled={this.checkDisabled()}
                            >
                                +
                            </button>
                        </div>
                    )
                }
            </div>
        )
    }
}
