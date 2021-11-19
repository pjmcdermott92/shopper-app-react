import React, { Component } from 'react';
import ProductGrid from '../ProductGrid/ProductGrid';
import CartActionBtn from '../CartActionBtn/CartActionBtn';
import NotificationService from '../../services/notification-service';
import { SET_PRODUCT } from '../../services/types';
import { Loading, ErrorPage } from '../layout';
import { products } from '../../services/actions';
import './Product.scss';

const ns = new NotificationService();
const initialState = {
    loading: true,
    error: false,
    product: {}
}

export default class Product extends Component {
    state = { ...initialState, productId: this.props.productId }

    loadProduct = async (productId = this.props.productId) => {
        const product = await products.getSingleProduct(productId);
        if (!product.success) return this.setState({ loading: false, error: product.message });
        this.setState({ loading: false, error: false });
    }

    setProduct = product => {
        this.setState({ product: product });
    }

    componentDidMount = () => {
        ns.subscribe(SET_PRODUCT, this, this.setProduct);
        this.loadProduct();
    }

    componentWillUnmount = () => {
        ns.unsubscribe(SET_PRODUCT, this);
        products.clearSingleProduct();
    }
    
    render() {
        const { loading, error, product } = this.state;
        const { id, title, img, in_cart, price_text, in_stock, description, related_items } = product;
        if (loading) return <Loading />
        if (error) return <ErrorPage message={error} />
        return (
            <>
            <div className='product-wrapper'>
                <div className='product-image'>
                    <img src={img} alt={title} />
                </div>
                <div className='product-description'>
                    <h1>{title}</h1>
                    <h3>{price_text} each</h3>
                    <div className='cart-details'> 
                        <CartActionBtn
                            id={id}
                            inCart={in_cart}
                            inStock={in_stock}
                        />
                        {in_cart && <span className='text-success'>In Your Cart</span>}
                    </div>
                    <div className='description' dangerouslySetInnerHTML={{__html: description}} />
                </div>
            </div>
            <h3>Related Products</h3>
            <ProductGrid products={related_items} />
            </>
        )
    }
}
