import NotificationService from '../notification-service';
import {
    SET_CURRENT_VIEW,
    SET_FILTER,
    SHOW_CART_MODAL
} from '../types';

const ns = new NotificationService();

const uiActions = {
    showCartModal: value => ns.dispatch(SHOW_CART_MODAL, value),

    setCurrentView: ({ view, productId, redirect }) => {
        ns.dispatch(SET_CURRENT_VIEW, { view, productId, redirect });
    },

    setFilter: filter => ns.dispatch(SET_FILTER, filter),
};

export default uiActions;
