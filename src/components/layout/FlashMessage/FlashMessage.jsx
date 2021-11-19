import React, { Component } from 'react';
import NotificationService from '../../../services/notification-service';
import { SET_FLASH_MESSAGE } from '../../../services/types';
import './FlashMessage.scss';

const ns = new NotificationService();
export default class FlashMessage extends Component {
    state = { messages: [] };

    removeMessage = id => {
        const newMessages = this.state.messages.filter(message => message.id !== id);
        this.setState({ messages: [ ...newMessages ] });
    }

    setMessage = message => {
        this.setState(prevState => ({ messages: [ ...prevState.messages, message ] }));
        setTimeout(() => this.removeMessage(message.id), 3500);
    }

    componentDidMount = () => ns.subscribe(SET_FLASH_MESSAGE, this, this.setMessage);
    componentWillUnmount = () => ns.unsubscribe(SET_FLASH_MESSAGE, this);

    render() {
        const { messages } = this.state;
        if (messages && messages.length) return messages.map(alert => {
            const { id, type = 'warning', message } = alert;
            return <div key={id} className={`flash-message ${type}`}>{message}</div>
        });
        return null;
    }
}
