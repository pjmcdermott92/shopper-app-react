import HttpService from '../http-service';
import DataService from '../data-service';

const http = new HttpService();
const ds = new DataService();

const cart = {
    loadCart: async cartId => {
        try {
            let cart = await http.getOrCreateCart(cartId);
            if (!cart.success) throw new Error(cart.message);
            if (ds.state.cart.items) {
                for (let i = 0; i < ds.state.cart.items.length; i++) {
                    const { product_id, qty } = ds.state.cart.items[i];
                    cart = await http.addItemToCart(cart.data.id, product_id, qty);
                }
            }
            ds.setCart(cart.data);
        } catch (err) {
            ds.setFlashMessage(err.message, 'danger');
        }
    },

    addItemToCart: async productId => {
        try {
            if (!ds.state.cart.id) {
                const newCart = await http.getOrCreateCart();
                if (newCart.success) ds.setCart(newCart.data);
            }
            const item = ds.state.cart.items.find(item => item.product_id === productId);
            const product = ds.state.products.find(product => product.id === productId);
            if (item && item.qty === product.in_stock) {
                throw new Error(`There are only ${product.in_stock} items available`);
            };
            const updatedCart = await http.addItemToCart(ds.state.cart.id, productId);
            if (!updatedCart.success) throw new Error('Error adding item to cart');
            ds.setCart(updatedCart.data);
            if (ds.state.user) {
                if (!ds.state.user.cart) {
                    await http.saveCartToUser(ds.state.user.id, updatedCart.data.id);
                }
            }
            return { success: true };
        } catch (err) {
            ds.setFlashMessage(err.message, 'danger');
            return { success: false };
        }
    },

    removeCartItem: async (productId, deleteItem = false) => {
        const item = ds.state.cart.items.find(item => item.product_id === productId);
        let { item_id, qty } = item;
        qty = qty - 1;
        if (deleteItem) qty = 0;
        const newCart = await http.changeItemQty(ds.state.cart.id, item_id, qty);
        if (!newCart.success) return ds.setFlashMessage('Error removing cart item', 'danger');
        ds.setCart(newCart.data);
        return { qty }
    }
};

export default cart;
