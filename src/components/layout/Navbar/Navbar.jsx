import React from 'react';
import Link from '../../Views/Link';
import SearchInput from './SearchInput';
import './Navbar.scss';

const Navbar = ({ categories }) => {
    return (
        <nav className='nav-bar'>
            <div className='container'>
                <ul className='nav-links'>
                    {
                        categories && categories.map(category => {
                            return (
                                <li key={category} className='nav-link'>
                                    <Link view='home' filter={category}>{category}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <SearchInput />
            </div>
        </nav>
    )
}

export default Navbar;
