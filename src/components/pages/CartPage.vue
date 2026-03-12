<template>
  <Coffee401 v-if="is401Error" />
  <div v-else-if="!isLoading" class="list">
    <div v-if="error" class="error-message">{{ error }}</div>
    <p v-if="!cartList.length">No coffee, go add some.</p>
    <div v-if="cartList.length">
      <Pay :isDisablePreview="isHidePayPreview" />
      <ul>
        <li class="list-header">
          <div>Item</div>
          <div>Unit</div>
          <div>Total</div>
          <div></div>
        </li>
        <li v-for="item in cartList" :key="item.name" class="list-item">
          <div>{{ item.name }}</div>
          <div>
            <span class="unit-desc">{{ currency(item.unitPrice) }} x {{ item.quantity }}</span>
            <div class="unit-controller">
              <button :aria-label="'Add one ' + item.name" type="button" @click="addOneCartItem(item.name)">+</button>
              <button :aria-label="'Remove one ' + item.name" type="button" @click="removeOneCartItem(item.name)">-</button>
            </div>
          </div>
          <div>{{ currency(item.price) }}</div>
          <div>
            <button :aria-label="'Remove all ' + item.name" class="delete" type="button" @click="removeCartItem(item.name)">x</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="loading">
    Loading cart...
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { currency } from '../../utils';
import Pay from "../parts/Pay.vue";
import Coffee401 from '../parts/Coffee401.vue';
import cartApi from '../../api/cart.api';

export default defineComponent({
  name: 'CartPage',
  components: { Pay, Coffee401 },
  data() {
    return {
      isHidePayPreview: true,
      isLoading: false,
      error: null as string | null,
      is401Error: false
    }
  },
  computed: {
    ...mapGetters({
      cartList: "cart/cartList"
    }),
  },
  methods: {
    currency,
    ...mapActions("cart", []),
    ...mapMutations("cart", ["addOneCartItem", "removeOneCartItem", "removeCartItem"]),
    async loadCart() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await cartApi.getCart();
        // Update local cart with server data
        if (response.items && response.items.length > 0) {
          this.$store.commit('cart/setCartList', { items: response.items });
        }
      } catch (error: any) {
        if (error.status === 401) {
          this.is401Error = true;
        } else if (error.status === 500) {
          this.$router.push('/error/500');
        } else {
          this.error = 'Failed to load cart';
        }
        console.error('Failed to load cart:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveCart() {
      try {
        const cartItems = this.$store.getters['cart/cartList'].map((item: any) => ({
          name: item.name,
          quantity: item.quantity
        }));
        await cartApi.saveCart(cartItems);
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    }
  },
  async created() {
    await this.loadCart();
  },
  watch: {
    cartList: {
      handler() {
        this.saveCart();
      },
      deep: true
    }
  }
})
</script>

<style scoped>
.error-message {
  color: #b00020;
  text-align: center;
  margin-bottom: 20px;
  font-size: large;
}

.loading {
  text-align: center;
  font-size: xx-large;
  padding: 50px;
}

p {
  text-align: center;
  font-size: xx-large;
}

.list {
  margin: 0 auto;
  max-width: 680px;
  padding: 10px;
}

ul {
  padding: 0;
}

li {
  padding: 10px;
  font-weight: 300;
  font-size: x-large;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-areas: "a a d" "b b c";
}

li {
  border-bottom: 4px dashed lightgray;
}

/* title */
li div:first-child {
  grid-area: a;
}

/* unit price */
li div:nth-child(2) {
  grid-area: b;
  display: flex;
}

/* total */
li div:nth-child(3) {
  grid-area: c;
  justify-self: end;
}

/* delete button */
li div:last-child {
  grid-area: d;
  justify-self: right;
  display: flex;
  align-items: center;
}

.list-header {
  display: none;
}

@media (min-width: 500px) {
  li {
    grid-template-columns: repeat(3, auto);
    /* autoprefixer: off */
    grid-template-areas: "a a d" "b b c";
  }
}

@media (min-width: 800px) {
  li {
    grid-template-columns: 260px 200px 140px 50px;
    /* autoprefixer: off */
    grid-template-areas: "a b c d";
  }

  .list-header {
    display: grid;
    font-weight: bold;
    font-size: initial;
  }
}

/* delete button */

.delete {
  height: 24px;
  width: 24px;
  font-size: 14px;
  border-radius: 50%;
  font-weight: bold;
  background: rgba(10, 10, 10, 0.15);
  color: white;
  font-weight: bold;
  border: none;
}

.delete:hover {
  color: red;
  background: lightpink;
}

/* unit controller */

.unit-controller {
  margin-left: 10px;
}

.unit-controller button {
  min-height: 20px;
  font-size: 14px;
  border: 2px solid;
  padding: 0 6px;
  margin: 2px -1px;
  background: antiquewhite;
}

.unit-desc {
  min-width: 120px;
}

:deep(.pay-container) {
  padding: 0;
}

:deep(.pay) {
  align-self: flex-start;
}
</style>
