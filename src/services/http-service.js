import {
    API_BASE_URL,
    API_KEY,
    LOCATION_API_URL
} from '../constants';

let instance = null;
export default class HttpService {
    constructor() {
        if (!instance) instance = this;
        return instance;
    }

    fetchUser = async param => {
        const url = `customers?query=${param}`;
        try {
            const user = await api(url);
            if (!user.success) throw new Error('User not found');
            const { id, email, firstname, lastname, external_id, meta: { hash } } = user.data.data[0];
            return {
                success: true,
                data: { id, email, firstname, lastname, cart: external_id, hash }
            }
        } catch (err) {
            return { success: false, message: err.message }
        }
    }

    registerUser = async ({ firstname, lastname, email, hash }) => {
        try {
            const newUser = await api(
                'customers',
                { firstname, lastname, email, meta: { hash } },
                'POST'
            );
            if (!newUser.success) throw new Error('Failed to save user');
            return newUser;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    fetchProducts = async () => {
        try {
            const products = await api('products?limit=30');
            if (!products.success) throw new Error(products.message);
            const data = products.data.data.map(item => ({
                title: item.name,
                category: item.categories[0].name,
                id: item.id,
                img: item.media.source,
                price: item.price.raw,
                price_text: item.price.formatted_with_symbol,
                in_stock: item.inventory.available
            }));
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    fetchOneProduct = async id => {
        try {
            const product = await api(`products/${id}`);
            if (!product.success) throw new Error('Error loading product');
            const item = product.data;
            const data = {
                title: item.name,
                id: item.id,
                in_stock: item.inventory.available,
                category: item.categories[0].name,
                img: item.media.source,
                price: item.price.raw,
                price_text: item.price.formatted_with_symbol,
                description: item.description,
                related_items: item.related_products.map(product => ({
                    title: product.name,
                    id: product.id,
                    img: product.media.source,
                    price: product.price.raw,
                    price_text: product.price.formatted_with_symbol,
                    in_stock: product.quantity
                }))
            };
            return { success: true, data }
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    fetchCategories = async () => {
        try {
            const categories = await api('categories');
            if (!categories.success) throw new Error(categories.message);
            const categoryData = categories.data.data.map(cat => cat.name);
            return { success: true, data: categoryData };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    getOrCreateCart = async cartId => {
        const url = cartId && cartId !== undefined ? `carts/${cartId}` : 'carts';
        try {
            const cart = await api(url);
            if (!cart.success) throw new Error('Error loading cart');
            const data = formatCartData(cart.data);
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    addItemToCart = async (cartId, product_id, qty = 1) => {
        const url = `carts/${cartId}`;
        const body = { id: product_id, quantity: qty };
        try {
            const updatedCart = await api(url, body, 'POST');
            if (!updatedCart.success) throw new Error('Error adding item to cart');
            const data = formatCartData(updatedCart.data.cart);
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    changeItemQty = async (cartId, itemId, qty) => {
        const url = `carts/${cartId}/items/${itemId}`;
        const body = { quantity: qty };
        try {
            const updatedCart = await api(url, body, 'PUT');
            if (!updatedCart.success) throw new Error('Error modifying cart');
            const data = formatCartData(updatedCart.data.cart);
            return { success: true, data }
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    saveCartToUser = async (userId, cartId) => {
        const url = `customers/${userId}`;
        const body = { external_id: cartId };
        try {
            const updatedUser = await api(url, body, 'PUT');
            if (!updatedUser.success) throw new Error(updatedUser.message);
            return updatedUser;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    deleteCart = async cartId => {
        const url = `carts/${cartId}`;
        await api(url, null, 'DELETE');
    }

    fetchLocationByZip = async zip => {
        try {
            const res = await fetch(LOCATION_API_URL + zip);
            if (!res.ok) throw new Error('Invalid Zip Code');
            const json = await res.json();
            const data = {
                city: json.city,
                state: json.state_short,
                zip: json.postal_code
            };
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    getCheckoutToken = async cartId => {
        const url = `checkouts/${cartId}?type=cart`;
        try {
            const checkout = await api(url);
            if (!checkout.success) throw new Error('Server Error');
            const data = {
                checkoutId: checkout.data.id,
                subtotal_raw: checkout.data.live.subtotal.raw,
                subtotal_text: checkout.data.live.subtotal.raw,
                shipping_methods: checkout.data.shipping_methods.map(method => ({
                    id: method.id,
                    description: method.description,
                    price_raw: method.price.raw,
                    price_text: method.price.formatted_with_symbol
                })),
                items: checkout.data.live.line_items.map(item => ({
                    id: item.id,
                    title: item.name,
                    qty: item.quantity,
                    total_raw: item.line_total.raw,
                    total_text: item.line_total.formatted_with_symbol
                }))
            };
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    getSalesTax = async (checkoutId, zip, state) => {
        const url =
            `checkouts/${checkoutId}/helper/set_tax_zone?postal_zip_code=${zip}&country=US&region=${state}`;
        try {
            const taxData = await api(url);
            if (!taxData.success) throw new Error('Server Error');
            const data = {
                tax_raw: taxData.data.live.tax.amount.raw,
                tax_text: taxData.data.live.tax.amount.formatted_with_symbol
            };
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

function formatCartData(cartData) {
    const { id, total_items, subtotal, line_items } = cartData;
    return {
        id,
        count: total_items,
        subtotal: subtotal.raw,
        subtotal_text: subtotal.formatted_with_symbol,
        items: line_items.map(item => ({
            item_id: item.id,
            product_id: item.product_id,
            name: item.name,
            img: item.media.source,
            total: item.line_total.raw,
            total_formatted: item.line_total.formatted_with_symbol,
            qty: item.quantity
        }))
    };
}

async function api(path, body, method = 'GET') {
    const url = API_BASE_URL + path;
    const headers = {
        'X-Authorization': API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (body) body = JSON.stringify(body);
    try {
        const res = await fetch(url, { method, headers, body });
        if (!res.ok) throw new Error(res);
        const json = await res.json();
        return { success: true, data: json };
    } catch (err) {
        return { success: false, message: err.message };
    }
}