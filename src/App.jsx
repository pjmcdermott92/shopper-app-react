import React, { Component } from 'react';
import {
    Header,
    Footer,
    FlashMessage,
    Loading,
    ErrorPage
} from './components/layout';
import Views from './components/Views/Views';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import NotificationService from './services/notification-service';
import { UPDATE_PRODUCTS, SET_CATEGORIES, SET_FILTER } from './services/types';
import { products } from './services/actions';
import './styles/root.scss';

const ns = new NotificationService();
const initialState = {
    loading: true,
    error: false,
    products: [],
    categories: [],
    filter: ''
}

export default class App extends Component {
    state = { ...initialState }

    setProducts = products => this.setState({ products: products });
    setCategories = categories => this.setState({ categories: categories });
    setFilter = filter => this.setState({ filter: filter });
    loadData = async () => {
        await products.getCategories();
        const loadProducts = await products.getAllProducts();
        if (!loadProducts.success) return this.setState({ loading: false, error: loadProducts.message });
        this.setState({ loading: false, error: false, products: loadProducts.data });
    }

    componentDidMount = () => {
        ns.subscribe(UPDATE_PRODUCTS, this, this.setProducts);
        ns.subscribe(SET_CATEGORIES, this, this.setCategories);
        ns.subscribe(SET_FILTER, this, this.setFilter);
        this.loadData();
    }

    componentWillUnmount = () => {
        ns.unsubscribe(UPDATE_PRODUCTS, this);
        ns.unsubscribe(SET_CATEGORIES, this);
        ns.unsubscribe(SET_FILTER, this);
    }

    render() {
        const { loading, error } = this.state;
        if (loading) return <Loading />
        if (error) return <ErrorPage message={error} />
        return (
            <>
            <Header {...this.state} />
            <div className='container'>
                <FlashMessage />
                <Views {...this.state} />
            </div>
            <Footer />
            <ShoppingCart />
            </>
        )
    }
}
