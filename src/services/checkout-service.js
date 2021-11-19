import DataService, { uuid } from "./data-service";
import NotificationService from './notification-service';
import { uiActions } from "./actions";
import { SET_CHECKOUT_INFO } from "./types";

const ns = new NotificationService();

let instance = null;
export default class CheckoutService extends DataService {
    constructor() {
        super();
        if (!instance) instance = this;
        this.checkoutId = null;
        this.subtotal = {};
        this.shipping = null;
        this.tax = null;
        this.items = [];
        this.shippingMethods = [];
        return instance;
    }

    dispatchCheckoutData = () => {
        const data = {
            user: this.state.user,
            shippingDetails: this.state.shippingDetails,
            paymentDetails: this.state.paymentDetails,
            subtotal: this.subtotal,
            shippingMethods: this.shippingMethods,
            shipping: this.shipping,
            tax: this.tax,
            items: this.items,
            canSubmit: this.canSubmit
        };
        ns.dispatch(SET_CHECKOUT_INFO, data);
    }

    setCheckoutData = ({ checkoutId, subtotal_raw, subtotal_text, items, shipping_methods }) => {
        this.checkoutId = checkoutId;
        this.subtotal = { raw: subtotal_raw, text: subtotal_text };
        this.shippingMethods = shipping_methods;
        this.shipping = {
            method: shipping_methods[0].id,
            price: shipping_methods[0].price_raw,
            price_text: shipping_methods[0].price_text
        };
        this.items = items;
        this.dispatchCheckoutData();
    }

    updateShippingDetails = shippingInfo => {
        const shippingMethod = this.shippingMethods.find(method =>
            method.id === this.shipping.method
        );
        this.state.shippingDetails = shippingInfo;
        this.state.shippingDetails.method = shippingMethod.description;
            
        this.dispatchCheckoutData();
    }

    updatePaymentDetails = paymentInfo => {
        this.state.paymentDetails = paymentInfo;
        this.state.paymentDetails.cardnumber = 
            this.state.paymentDetails.cardnumber.substring(15,19);
        this.state.paymentDetails.confirmation = uuid().substring(0,6).toUpperCase();
        this.dispatchCheckoutData();
    }

    clearCheckoutData = async () => {
        this.checkoutId = null;
        this.subtotal = {};
        this.shipping = null;
        this.tax = null;
        this.items = [];
        this.shippingMethods = [];
        this.dispatchCheckoutData();
        uiActions.setCurrentView({ view: 'home' });
    }
}
