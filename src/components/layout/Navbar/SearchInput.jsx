import React, { Component } from 'react';
import NotificationService from '../../../services/notification-service';
import { SET_FILTER } from '../../../services/types';
import { uiActions } from '../../../services/actions';
import './Navbar.scss';

const ns = new NotificationService();

export default class SearchInput extends Component {
    state = { searchTerm: '' }

    onChange = ({ target: { value } }) => {
        uiActions.setFilter(value);
        uiActions.setCurrentView({ view: 'home' });
    }

    onSubmit = e => {
        e.preventDefault();
        if (this.props.closeModal) this.props.closeModal();
    }
    
    setSearchTerm = term => this.setState({ searchTerm: term });
    componentDidMount = () => ns.subscribe(SET_FILTER, this, this.setSearchTerm);
    componentWillUnmount = () => ns.unsubscribe(SET_FILTER, this);

    render() {
        const { searchTerm } = this.state;
        return (
            <div className='search-box'>
                <form onSubmit={this.onSubmit}>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={this.onChange}
                        placeholder='search...'
                    />
                    <button><i className='fas fa-search' /></button>
                </form>
            </div>
        )
    }
}
