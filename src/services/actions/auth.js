import md5 from 'md5';
import HttpService from '../http-service';
import DataService from '../data-service';
import { LOCAL_SAVED_USER } from '../../constants';
import cart from './cart';

const http = new HttpService();
const ds = new DataService();

const auth = {

    loadUser: async (user = localStorage.getItem(LOCAL_SAVED_USER)) => {
        if (!user) return;
        user = await http.fetchUser(user);
        if (!user.success) return;
        ds.setUser(user.data);
        if (user.data.cart) await cart.loadCart(user.data.cart);
    },

    logInUser: async ({ email, password }) => {
        try {
            let user = await http.fetchUser(email);
            if (!user.success || !comparePassword(password, user.data.hash)) {
                throw new Error('Invalid credentials');
            }
            if (user.data.cart) await cart.loadCart(user.data.cart);
            else if (ds.state.cart.id) user = await http.saveCartToUser(user.data.id, ds.state.cart.id); 
            ds.setUser(user.data);
            return user;
        } catch (err) {
            return { success: false, message: err.message }
        }
    },

    registerUser: async ({ firstname, lastname, email, password }) => {
        try {
            const foundUser = await http.fetchUser(email);
            if (foundUser.success) throw new Error('Email is already registered');
            const hash = hashPassword(password);
            let newUser = await http.registerUser({ firstname, lastname, email, hash });
            if (!newUser.success) throw new Error('Could not register user');
            if (ds.state.cart.id) newUser = await http.saveCartToUser(newUser.data.id, ds.state.cart.id);
            ds.setUser(newUser.data);
            return newUser;
        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    logOutUser: () => {
        ds.setUser(null);
        ds.setCart({});
        ds.setFlashMessage('You have been logged out');
    }
};

function hashPassword(password, salt = new Date().getTime()) {
    let hash = md5(password + salt);
    for (let i = 0; i < 10; i++) hash = md5(hash + salt);
    return `${salt}$${hash}`;
}

function comparePassword(password, hash) {
    const [ salt ] = hash.split('$');
    const hashedPass = hashPassword(password, salt);
    return hashedPass === hash;
}

export default auth;
