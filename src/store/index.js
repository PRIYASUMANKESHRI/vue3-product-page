import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    products: [],
    basket: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    addToBasket(state, product) {
      const basketItem = state.basket.find(item => item.id === product.id);
      if (basketItem) {
        basketItem.quantity += 1;
      } else {
        state.basket.push({ ...product, quantity: 1 });
      }
    },
    removeFromBasket(state, index) {
      state.basket.splice(index, 1);
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      const response = await axios.get('https://dummyjson.com/products');
      commit('setProducts', response.data.products);
    },
    addToBasket({ commit }, product) {
      commit('addToBasket', product);
    },
    removeFromBasket({ commit }, index) {
      commit('removeFromBasket', index);
    },
  },
});