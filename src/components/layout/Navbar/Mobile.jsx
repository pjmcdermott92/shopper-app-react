import React from 'react';
import SearchInput from './SearchInput';
import { uiActions } from '../../../services/actions';

const Mobile = ({ mobileMenuOpen, toggleMobileMenu, categories }) => {

    const onClick = (e, filter) => {
        e.preventDefault();
        uiActions.setCurrentView({view: 'home' });
        uiActions.setFilter(filter);
        toggleMobileMenu();
    }

    if (!mobileMenuOpen) return null;
    return (
        <>
        <div className='modal-overlay' onClick={toggleMobileMenu} />
        <nav className='mobile-nav'>
            <button className='close-nav-btn' onClick={toggleMobileMenu}>&times;</button>
            <SearchInput closeModal={toggleMobileMenu} />
            <ul className='nav-links' onClick={toggleMobileMenu}>
                {
                    categories && categories.map(category => {
                        return (
                            <li key={category} className='nav-link'>
                                <a
                                    href='/' onClick={e => onClick(e, category)}
                                >
                                    {category}
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
        </>
    )
}

export default Mobile;
