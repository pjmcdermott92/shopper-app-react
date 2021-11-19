import React from 'react';
import { uiActions } from '../../services/actions';

const Link = ({
    view,
    filter = '',
    productId,
    redirect,
    children,
    ...rest
}) => {
    const onClick = e => {
        e.preventDefault();
        uiActions.setFilter(filter);
        uiActions.setCurrentView({ view, productId, redirect });
    }
    return <a { ...rest } href='/' onClick={onClick}>{children}</a>
}

export default Link;
