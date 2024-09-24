<template>
  <div class="basket">
    <h2>Your Cart</h2>
    <div v-for="(item, index) in basket" :key="index" class="basket-item">
      <div class="basket-item-info">
        <p>{{ item.title }} (x{{ item.quantity }})</p>
        <p class="basket-item-price">${{ item.price * item.quantity }}</p>
      </div>

      <div class="basket-item-controls">
        <button @click="decreaseQuantity(item)">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="increaseQuantity(item)">+</button>
        <button @click="removeFromBasket(index)" class="remove-button">Remove</button>
      </div>
    </div>

    <p v-if="basket.length === 0" class="empty-message">Your basket is empty.</p>
    <p class="total">Total: ${{ total }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['basket']),
    total() {
      return this.basket.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
  },
  methods: {
    ...mapActions(['removeFromBasket', 'addToBasket']),

    increaseQuantity(item) {
      this.addToBasket(item);
    },

    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        const index = this.basket.indexOf(item);
        this.removeFromBasket(index);
      }
    }
  },
};
</script>

<style scoped>
.basket {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.basket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.basket-item:last-child {
  border-bottom: none;
}

.basket-item-info {
  flex-grow: 1;
}

.basket-item-price {
  font-weight: bold;
  color: #28a745;
}

.basket-item-controls {
  display: flex;
  align-items: center;
}

.basket-item-controls button {
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.basket-item-controls button:hover {
  background-color: #0056b3;
}

.remove-button {
  background-color: #dc3545;
}

.remove-button:hover {
  background-color: #c82333;
}

.empty-message {
  text-align: center;
  color: #666;
}

.total {
  font-size: 1.2em;
  margin-top: 10px;
  font-weight: bold;
}
</style>