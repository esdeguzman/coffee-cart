<template>
  <div class="container">
    <p>Star our repository <a href="https://github.com/jecfish/coffee-cart">jecfish/coffee-cart</a>. Report in the repository if you found any issues.</p>
    <p>Here are the extra actions you can perform apart from the usual add to cart flows.</p>
    <ul>
      <li>Right click on coffee icon to open an add to cart dialog.</li>
      <li>[Desktop only] Hover over Pay button will show a quick cart preview, click to add or remove items.</li>
      <li>A random promo coffee pop up show up when adding every 3rd items to the cart. (e.g. 3, 6, 9, ...)</li>
      <li>The add to cart process will be slowing down (intentionally) when the cart has more than 7 items.</li>
   
    </ul>
    <p>Updated for Cypress training purposes.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "GitHubPage",
});
</script>

<style scoped>
  .container {
    width: 90vw;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
