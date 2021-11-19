import HttpService from '../http-service';
import DataService from '../data-service';

const http = new HttpService();
const ds = new DataService();

const products = {
    getAllProducts: async () => {
        try {
            const products = await http.fetchProducts();
            if (!products.success) throw new Error(products.message);
            ds.updateProducts(products.data);
            return products;
        } catch (err) {
            return { success: false, message: err.message }
        }
    },

    getSingleProduct: async productId => {
        try {
            let product = await http.fetchOneProduct(productId);
            if (!product.success) throw new Error('Error loading product');
            ds.setProduct(product.data);
            return product;
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, 

    clearSingleProduct: () => ds.setProduct({}),

    getCategories: async () => {
        const categories = await http.fetchCategories();
        if (!categories.success) return;
        ds.setCategories(categories.data);
    },
};

export default products;
