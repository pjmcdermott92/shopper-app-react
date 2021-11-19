import React, { Component } from 'react';
import { Login, Register } from '../Auth';
import ProductGrid from '../ProductGrid/ProductGrid';
import Product from '../Product/Product';
import Checkout from '../Checkout/Checkout';
import NotificationService from '../../services/notification-service';
import { SET_CURRENT_VIEW } from '../../services/types';

const ns = new NotificationService();

export default class Views extends Component {
    state = { currentView: 'home', filter: '', productId: null, redirect: null };

    setView = ({ view, productId = null, redirect }) => {
        this.setState({ currentView: view, productId, redirect });
    }

    componentDidMount = () => ns.subscribe(SET_CURRENT_VIEW, this, this.setView);
    componentWillUnmount = () => ns.unsubscribe(SET_CURRENT_VIEW, this);
    
    switchView = () => {
        const { currentView, productId } = this.state;
        switch (currentView) {
            case 'home': return <ProductGrid {...this.props} />;
            case 'login': return <Login redirect={this.state.redirect} />
            case 'register': return <Register redirect={this.state.redirect} />
            case 'product': return <Product key={productId} productId={productId} />
            case 'checkout': return <Checkout />
            default: return 'DEFAULT';
        }
    }

    render = () => this.switchView();
}
