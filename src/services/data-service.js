import { LOCAL_SAVED_USER } from '../constants';
import NotificationService from './notification-service';
import {
    SET_FLASH_MESSAGE,
    NOTIFY_SET_USER,
    UPDATE_CART,
    UPDATE_PRODUCTS,
    SET_PRODUCT,
    SET_CATEGORIES,
} from './types';

const ns = new NotificationService();
const initialState = {
    user: null,
    products: [],
    currentProduct: {},
    categories: [],
    cart: {},
    shippingDetails: {},
    paymentDetails: {}
};

let instance = null;
export default class DataService {
    constructor() {
        if (!instance) instance = this;
        this.state = initialState;
        return instance;
    }

    setFlashMessage = (message, type) => {
        const id = uuid();
        ns.dispatch(SET_FLASH_MESSAGE, { id, message, type });
    }

    setUser = userData => {
        localStorage.removeItem(LOCAL_SAVED_USER);
        this.state.user = userData;
        if (userData) {
            localStorage.setItem(LOCAL_SAVED_USER, userData.id);
            this.setFlashMessage(`Welcome, ${userData.firstname}!`);
        }
        ns.dispatch(NOTIFY_SET_USER, this.state.user);
    }

    updateProducts = productData => {
        if (productData) this.state.products = productData;
        this.state.products.forEach(product => {
            delete product.in_cart;
            if (this.state.cart.items) {
                const inCart = this.state.cart.items.find(item => item.product_id === product.id);
                if (inCart) {
                    product.in_cart = inCart.qty;
                    inCart.in_stock = product.in_stock;
                }
            }
        });
        ns.dispatch(UPDATE_CART, this.state.cart);
        ns.dispatch(UPDATE_PRODUCTS, this.state.products);
    }

    setCategories = categoryData => {
        this.state.categories = categoryData;
        ns.dispatch(SET_CATEGORIES, this.state.categories);
    }

    checkIfItemInCart(itemId) {
        if (!this.state.cart.items) return;
        const inCart = this.state.cart.items.find(item => item.product_id === itemId);
        if (inCart) return inCart.qty;
    }

    setProduct = (productData = this.state.currentProduct) => {
        this.state.currentProduct = productData;
        delete this.state.currentProduct.in_cart;
        if (this.state.cart.items) {
            if (this.state.currentProduct.related_items) {
                this.state.currentProduct.related_items.forEach((item, index) => {
                    const inCart = this.checkIfItemInCart(item.id);
                    if (inCart) this.state.currentProduct.related_items[index].in_cart = inCart;
                })
            }
            const inCart = this.checkIfItemInCart(productData.id);
            if (inCart) this.state.currentProduct.in_cart = inCart;
        }
        ns.dispatch(SET_PRODUCT, this.state.currentProduct);
    }

    setCart = async cartData => {
        this.state.cart = cartData;
        this.updateProducts();
        this.setProduct();
    }
}

export function uuid() {
    return 'x-xyx'.replace(/[xy]/g, () => {
        const rand = Math.floor(Math.random() * new Date());
        return rand.toString(16);
    });
}
