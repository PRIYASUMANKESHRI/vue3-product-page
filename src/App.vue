<template>
  <div id="app">
    <h1>Product Page</h1>
    <ProductCatalog />
  </div>
</template>

<script>
import ProductCatalog from './components/ProductCatalog.vue';

export default {
  components: {
    ProductCatalog,
  },
};
</script>

<style>
/* You can add global styles here if needed */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f4f4f4;
}
</style>
