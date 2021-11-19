import React, { Component } from 'react';
import Link from '../../Views/Link';
import Mobile from '../Navbar/Mobile';
import Navbar from '../Navbar/Navbar';
import NotificationService from '../../../services/notification-service';
import { NOTIFY_SET_USER, UPDATE_CART } from '../../../services/types';
import { auth, uiActions } from '../../../services/actions';
import './Header.scss';

const ns = new NotificationService();

export default class Header extends Component {
    state = {
        windowSize: window.innerWidth,
        mobileMenuOpen: false,
        user: null,
        cartCount: 0
    }

    setUser = user => this.setState({ user: user ? user.firstname : null });
    setCartCount = cartData => this.setState({ cartCount: cartData.count });
    
    logUserOut = e => {
        e.preventDefault();
        auth.logOutUser();
        uiActions.setCurrentView({view: 'login' });
    }

    toggleMobileMenu = () => this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen });

    componentDidMount = () => {
        ns.subscribe(NOTIFY_SET_USER, this, this.setUser);
        ns.subscribe(UPDATE_CART, this, this.setCartCount);
        window.addEventListener('resize', () => this.setState({ windowSize: window.innerWidth }));
        auth.loadUser();
    }

    componentWillUnmount = () => {
        ns.unsubscribe(NOTIFY_SET_USER, this);
        ns.unsubscribe(UPDATE_CART, this);
    }

    render() {
        const { windowSize, mobileMenuOpen, user, cartCount } = this.state;
        return (
            <>
            <header className='page-header'>
                <div className='container'>
                    <button className='menu-toggle-btn' onClick={this.toggleMobileMenu}>
                        <span className='bars'></span>
                    </button>
                    <h1 className='site-title'>
                        <Link view='home'>Shopper</Link>
                    </h1>
                    <ul className='header-links'>
                        <li>
                            <i className={`${user ? 'fas' : 'far'} fa-user`} />
                            <div className='mobile-slide'>
                                {
                                    user ? (
                                        <>
                                            <p>Hello, {user}!</p>
                                            <p><a href='/' onClick={this.logUserOut}>Log Out</a></p>
                                        </>
                                        ) : (
                                            <>
                                            <p>Welcome!</p>
                                            <p><Link view='login'>Log In</Link> | <Link view='register'>Register</Link></p>
                                            </>
                                        )
                                }
                            </div>
                            <i className='fa fa-angle-down mobile' />
                        </li>
                        <li className='cart-btn' data-count={cartCount} >
                            <button onClick={() => uiActions.showCartModal(true)}>
                                <i className='fas fa-shopping-cart' />
                                <span className='hide'>Shopping Cart</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </header>
            {
                windowSize >= 768
                ? <Navbar categories={this.props.categories} />
                : <Mobile
                    categories={this.props.categories}
                    mobileMenuOpen={mobileMenuOpen}
                    toggleMobileMenu={this.toggleMobileMenu}
                />}
            </>
        )
    }
}
