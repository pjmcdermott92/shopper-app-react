import React from 'react';
import Link from '../Views/Link';
import CartActionBtn from '../CartActionBtn/CartActionBtn';
import './ProductGrid.scss';

const ProductCard = ({ product }) => {
    const { id, title, img, price_text, in_cart, in_stock } = product;
    return (
        <div className='product-card'>
            <div className='product-img'>
                <Link view='product' productId={id}><img src={img} alt={title} /></Link>
            </div>
            <h2 className='product-title'><Link view='product' productId={id}>{title}</Link></h2>
            <p className='product-price'>Price: {price_text}</p>
            <CartActionBtn
                id={id}
                inCart={in_cart}
                inStock={in_stock}
            />
        </div>
    )
}

export default ProductCard;
