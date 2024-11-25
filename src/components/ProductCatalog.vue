<template>
  <div class="product-catalog">
    <div class="filter-section">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products by name"
          class="search-input"
        />
        <button @click="searchAgain" class="search-button">
          <span v-if="searchQuery">Clear</span>
          <span v-else>Search</span>
        </button>
      </div>

      <div class="controls-container">
        <button class="filter-button" @click="toggleFilters">
          <span>Filters</span>
          <span v-if="hasActiveFilters" class="filter-badge"></span>
        </button>

        <select v-model="sortOption" class="sort-select">
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
          <option value="price-asc">Sort by Price (Low to High)</option>
          <option value="price-desc">Sort by Price (High to Low)</option>
        </select>    

        <div class="basket-icon" @click="toggleBasket">
          🛒
          <span v-if="basketCount > 0" class="basket-count">{{ basketCount }}</span>
        </div>
      </div>
    </div>

    <FilterSidebar 
      v-if="isFiltersVisible"
      :categories="categories"
      :current-filters="activeFilters"
      @close="toggleFilters"
      @apply-filters="applyFilters"
    />

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
import FilterSidebar from './FilterSidebar.vue';

export default {
  components: {
    BasketSidebar,
    FilterSidebar,
  },
  data() {
    return {
      searchQuery: '',
      sortOption: 'name-asc', // Default sorting option
      isBasketVisible: false,
      isFiltersVisible: false,
      activeFilters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        rating: ''
      },
    };
  },
  computed: {
    ...mapState(['products', 'basket']),
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = !this.activeFilters.category || product.category === this.activeFilters.category;
        const matchesPrice = (!this.activeFilters.minPrice || product.price >= this.activeFilters.minPrice) &&
                           (!this.activeFilters.maxPrice || product.price <= this.activeFilters.maxPrice);
        const matchesRating = !this.activeFilters.rating || product.rating >= this.activeFilters.rating;
        
        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
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
    hasActiveFilters() {
      return this.activeFilters.category || 
             this.activeFilters.minPrice || 
             this.activeFilters.maxPrice || 
             this.activeFilters.rating;
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
    toggleFilters() {
      this.isFiltersVisible = !this.isFiltersVisible;
    },
    applyFilters(filters) {
      this.activeFilters = { ...filters };
      this.isFiltersVisible = false;
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
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-container {
  display: flex;
  flex: 1;
  min-width: 280px;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.controls-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-button, .filter-button {
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover, .filter-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.sort-select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.basket-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.5em;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.basket-icon:hover {
  background-color: #f3f4f6;
}

.basket-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
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
    align-items: stretch;
  }

  .controls-container {
    width: 100%;
    justify-content: space-between;
  }

  .sort-select {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .controls-container {
    flex-wrap: wrap;
    gap: 10px;
  }

  .sort-select {
    width: 100%;
  }
}
</style>
