<template>
  <div class="basket-sidebar">
    <button class="close-btn" @click="$emit('close')">✖</button>
    <h2>Your Cart</h2>
    <div v-if="basket.length === 0" class="empty-message">Your basket is empty.</div>
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
.basket-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  overflow-y: scroll;
  bottom: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  margin-bottom: 20px;
}

.basket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
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
  color: #666;
}

.total {
  font-weight: bold;
  margin-top: 20px;
}
</style>