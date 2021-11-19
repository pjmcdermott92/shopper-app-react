import HttpService from "../http-service";
import CheckoutService from "../checkout-service";
import { uiActions } from ".";

const http = new HttpService();
const cs = new CheckoutService();

const checkout = {
    loadCheckout: async (cart = cs.state.cart.id) => {
        if (!cart) return uiActions.setCurrentView({ view: 'home' });
        const checkoutData = await http.getCheckoutToken(cart);
        cs.setCheckoutData(checkoutData.data);
    },

    getLocation: async zip => {
        const location = await http.fetchLocationByZip(zip);
        return location;
    },

    getTaxCost: async (zip, state) => {
        const checkoutId = cs.checkoutId;
        const taxInfo = await http.getSalesTax(checkoutId, zip, state);
        cs.tax = {
            tax_raw: taxInfo.data.tax_raw,
            tax_text: taxInfo.data.tax_text
        };
        cs.dispatchCheckoutData();
        return taxInfo;
    },

    setShippingMethod: id => {
        const newShippingMethod = cs.shippingMethods.find(method => method.id === id);
        cs.shipping = {
            method: newShippingMethod.id,
            price: newShippingMethod.price_raw,
            price_text: newShippingMethod.price_text
        };
        cs.dispatchCheckoutData();
    },

    setShippingInfo: shippingInfo => cs.updateShippingDetails(shippingInfo),

    setPaymentInfo: async paymentInfo => {
        cs.updatePaymentDetails(paymentInfo);
    },

    clearCheckout: async () => {
        await http.deleteCart(cs.state.cart.id);
        await http.saveCartToUser(cs.state.user.id, null);
        cs.setCart({});
        cs.clearCheckoutData();
    }
};

export default checkout;
