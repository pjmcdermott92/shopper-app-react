import React from 'react';

const OrderSummary = ({ subtotal, shipping, tax, items }) => {

    const calculateOrderTotal = () => {
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        const salesTax = tax ? tax.tax_raw : 0;
        const orderTotal = subtotal.raw + shipping.price + salesTax;
        return formatter.format(orderTotal);
    };

    return (
        <div className='order-summary'>
            <h3>
                <i className='fas fa-shopping-basket' />
                Order Summary
            </h3>
            <ul className='cart-summary'>
                {
                    items && items.map(item => {
                        const { id, title, qty, total_text } = item;
                        return (
                            <li key={id} className='cart-summary-item'>
                                <span>{qty} X</span>
                                <span>{title}</span>
                                <span>{total_text}</span>
                            </li>
                        );
                    })
                }
            </ul>
            <ul className='order-total'>
                <li className='subtotal'>
                    <span>Order Subtotal:</span>
                    <span>{subtotal.raw}</span>
                </li>
                <li className='shipping-total'>
                    <span>Shipping &amp; Handling:</span>
                    <span>{shipping.price_text}</span>
                </li>
                <li className='tax-total'>
                    <span>Tax:</span>
                    <span>{ tax ? tax.tax_text : '-' }</span>
                </li>
                <li className='total'>
                    <span>Order Total:</span>
                    <span>{calculateOrderTotal()}</span>
                </li>
            </ul>
        </div>
    )
}

export default OrderSummary;
