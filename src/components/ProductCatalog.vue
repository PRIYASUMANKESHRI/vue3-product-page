<template>
  <div class="product-catalog">
    <div class="filter-section">
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search products by name" />
        <button @click="searchAgain">Reset</button>
      </div>

      <select v-model="selectedCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>

      <!-- Sort options -->
      <select v-model="sortOption" class="sort-select">
        <option value="name-asc">Sort by Name (A-Z)</option>
        <option value="name-desc">Sort by Name (Z-A)</option>
        <option value="price-asc">Sort by Price (Low to High)</option>
        <option value="price-desc">Sort by Price (High to Low)</option>
      </select>    

      <div class="basket-icon" @click="toggleBasket">
        🛒 <!-- Use an appropriate icon here -->
        <span v-if="basketCount > 0" class="basket-count">{{ basketCount }}</span>
      </div>
    </div>

    <div class="products-grid">
      <div v-for="product in sortedProducts" :key="product.id" class="product-item">
        <img :src="product.thumbnail" alt="product image" class="product-image" />
        <h3 class="product-title">{{ product.title }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">${{ product.price }}</p>
        <button @click="addToBasket(product)" class="add-to-basket">Add to Basket</button>
      </div>
    </div>

    <BasketSidebar v-if="isBasketVisible" @close="toggleBasket" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BasketSidebar from './BasketSidebar.vue'; // Import your new sidebar component

export default {
  components: {
    BasketSidebar,
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      sortOption: 'name-asc', // Default sorting option
      isBasketVisible: false,
    };
  },
  computed: {
    ...mapState(['products', 'basket']),
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
        return matchesSearch && matchesCategory;
      });
    },
    categories() {
      return [...new Set(this.products.map(product => product.category))];
    },
    sortedProducts() {
      const sorted = [...this.filteredProducts];
      if (this.sortOption === 'name-asc') {
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (this.sortOption === 'name-desc') {
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      } else if (this.sortOption === 'price-asc') {
        return sorted.sort((a, b) => a.price - b.price);
      } else if (this.sortOption === 'price-desc') {
        return sorted.sort((a, b) => b.price - a.price);
      }
      return sorted;
    },
    basketCount() {
      return this.basket.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    ...mapActions(['fetchProducts', 'addToBasket']),

    searchAgain() {
      this.searchQuery = ''; // Resets the search field
    },
    toggleBasket() {
      this.isBasketVisible = !this.isBasketVisible;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.product-catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Responsive Filters */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.search-container {
  display: flex;
  flex-grow: 1;
  margin-bottom: 10px;
}

.search-container input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.search-container button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-container button:hover {
  background-color: #0056b3;
}

.category-select,
.sort-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 10px;
  margin-bottom: 10px; /* Spacing on small screens */
}

.basket-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.5em;
}

.basket-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 0.70rem;
}

/* Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #f9f9f9;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  max-width: 100%;
  border-radius: 5px;
}

.product-title {
  font-size: 1.2em;
  margin: 10px 0;
}

.product-description {
  color: #666;
  margin: 5px 0;
}

.product-price {
  font-weight: bold;
  margin: 10px 0;
}

.add-to-basket {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-basket:hover {
  background-color: #218838;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-container,
  .category-select,
  .sort-select {
    width: 100%;
    margin-bottom: 10px;
  }

  .category-select,
  .sort-select {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr; /* Single column layout on small screens */
  }
}
</style>
