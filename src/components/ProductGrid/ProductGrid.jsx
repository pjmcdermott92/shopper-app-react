import React from 'react';
import ProductCard from './ProductCard';
import { uiActions } from '../../services/actions';
import './ProductGrid.scss';

const ProductGrid = ({ products, filter }) => {

    const filterProducts = () => {
        if (!filter) return products;
        const filteredProducts = products.filter(products => 
            products.title.toLowerCase().includes(filter.toLowerCase()) ||
            products.category.toLowerCase().includes(filter.toLowerCase())
        );
        return filteredProducts;
    }

    const clearFilter = () => uiActions.setFilter('');

    return (
        <>
        {filter && (
            <h3 className='search-results'>
                Showing results for "<em>{filter.toLowerCase()}</em>"
                <button onClick={clearFilter}>&times; Clear Filter</button>
            </h3>
        )}
        <div className='product-grid'>
            {products && filterProducts().map(product => {
                return <ProductCard key={product.id} product={product} />
            })}
        </div>
        </>
    )
}

export default ProductGrid;
