<template>
  <div class="filter-sidebar">
    <button class="close-btn" @click="$emit('close')">✖</button>
    <h2>Filters</h2>
    
    <!-- Categories -->
    <div class="filter-section">
      <h3>Categories</h3>
      <select v-model="localFilters.category" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="filter-section">
      <h3>Price Range</h3>
      <div class="price-inputs">
        <input 
          type="number" 
          v-model="localFilters.minPrice" 
          placeholder="Min Price"
        >
        <span>to</span>
        <input 
          type="number" 
          v-model="localFilters.maxPrice" 
          placeholder="Max Price"
        >
      </div>
    </div>

    <!-- Rating -->
    <div class="filter-section">
      <h3>Minimum Rating</h3>
      <select v-model="localFilters.rating" class="filter-select">
        <option value="">Any Rating</option>
        <option v-for="rating in [4, 3, 2, 1]" :key="rating" :value="rating">
          {{ rating }}+ Stars
        </option>
      </select>
    </div>

    <div class="filter-actions">
      <button class="apply-filters" @click="applyFilters">Apply Filters</button>
      <button class="reset-filters" @click="resetFilters">Reset Filters</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    currentFilters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localFilters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        rating: ''
      }
    }
  },
  created() {
    // Initialize with current filters
    this.localFilters = { ...this.currentFilters };
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', this.localFilters)
    },
    resetFilters() {
      this.localFilters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        rating: ''
      }
      this.$emit('apply-filters', this.localFilters)
    }
  }
}
</script>

<style scoped>
.filter-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.filter-section {
  margin-bottom: 25px;
  padding: 0 10px;
}

.filter-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.filter-section h3 {
  color: #2c3e50;
  font-size: 1.1em;
  margin-bottom: 12px;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f8f9fa;
  color: #495057;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.filter-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.price-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.price-inputs input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f8f9fa;
  color: #495057;
}

.price-inputs span {
  color: #666;
  font-weight: 500;
}

.filter-actions {
  padding: 15px 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.apply-filters, .reset-filters {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.apply-filters {
  background-color: #2563eb;
  color: white;
}

.apply-filters:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.reset-filters {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.reset-filters:hover {
  background-color: #e5e7eb;
  color: #374151;
}

@media (max-width: 768px) {
  .filter-sidebar {
    width: 100%;
  }
}
</style> 