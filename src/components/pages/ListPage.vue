<template>
    <Coffee404 v-if="error && !isLoading && !is500Error && !is401Error" />
    <Coffee500 v-else-if="is500Error" :error="true" />
    <Coffee401 v-else-if="is401Error" />
    <div v-else>
      <Banner v-if="renderAd" />
  <!-- <iframe ref="iframe" v-if="showAd" src="/ad" height="1" width="1" scrolling="no" frameborder="0"></iframe> -->
  <Promotion v-if="showPromo" @close="closedPromo()" />
  <div>
    <ul v-if="isLoading">
      <CoffeeCardSkeleton v-for="n in 9" :key="n" />
    </ul>
    <ul v-else-if="isEmptyList">
      <div class="empty-message">
        <h3>No coffees available</h3>
        <p>Sorry, there are no coffees available at the moment. Please check back later.</p>
      </div>
    </ul>
    <ul v-else>
      <li
        v-for="coffee in list"
        :key="coffee.name"
        :id="isSelectedCoffee(coffee.name) ? coffeeId(coffee.name) : undefined"
      >
        <h4 @dblclick="translate(coffee.name)">
          {{ coffee.isTranslated? translation[coffee.name] : coffee.name }}
          <br />
          <small>{{ currency(coffee.price) }}</small>
        </h4>
        <div @click="addToCart(coffee.name);togglePromo(cartCount);" @contextmenu="showMenu(coffee.name, $event)">
          <Cup :item="coffee" :isBigger="isBigger" />
        </div>
      </li>
    </ul>
    </div>
    <Pay v-if="!error" :isDisablePreview="cartCount == 0" />
    <!-- <Ad v-if="showAd" /> -->
  </div>

  <dialog data-cy="add-to-cart-modal" ref="dialog">
    <p>Add <strong>{{ selectedCoffee }}</strong> to the cart?</p>
    <form method="dialog">
      <button @click="addToCart(selectedCoffee)">Yes</button>
      <button>No</button>
    </form>
  </dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { currency, slow } from '../../utils';
import Cup from '../parts/Cup.vue';
import Pay from '../parts/Pay.vue';
import Ad from '../parts/Ad.vue';
import Banner from '../parts/Banner.vue';
import Promotion from '../parts/Promotion.vue';
import CoffeeCardSkeleton from '../parts/CoffeeCardSkeleton.vue';
import Coffee404 from '../parts/Coffee404.vue';
import Coffee500 from '../parts/Coffee500.vue';
import Coffee401 from '../parts/Coffee401.vue';

export default defineComponent({
  name: "ListPage",
  components: { Cup, Pay, Ad, Banner, Promotion, CoffeeCardSkeleton, Coffee404, Coffee500, Coffee401 },
  computed: {
    ...mapState({
      list: (state: any) => state.coffees.list.filter((x:any) => !x.discounted),
      error: (state: any) => state.coffees.error,
      isLoading: (state: any) => state.coffees.isLoading,
    }),
    ...mapGetters({
      cartCount: "cart/cartCount"
    }),
    is500Error() {
      return this.error && this.error.status === 500;
    },
    is401Error() {
      return this.error && this.error.status === 401;
    },
    isEmptyList() {
      return !this.isLoading && !this.error && Array.isArray(this.list) && this.list.length === 0;
    },
  },
  data() {
    return {
      showAd: this.$route.query.ad,
      renderAd: false,
      showPromo: false,
      breakable: this.$route.query.breakable,
      waitTime: 1000,
      timeoutId: null,
      isBigger: false,
      selectedCoffee: '',
      selectedCoffeeNames: [] as string[],
      translation: {
        'Espresso': '特浓咖啡',
        'Espresso Macchiato': '浓缩玛奇朵',
        'Cappuccino': '卡布奇诺',
        'Mocha': '摩卡',
        'Flat White': '平白咖啡',
        'Americano': '美式咖啡',
        'Cafe Latte': '拿铁',
        'Espresso Con Panna': '浓缩康宝蓝',
        'Cafe Breve': '半拿铁',
      } as any
    }
  },
  watch: {
    list(newVal: any[]) {
      if (!this.selectedCoffeeNames.length && Array.isArray(newVal) && newVal.length) {
        const count = Math.min(3, newVal.length);
        this.selectedCoffeeNames = newVal.slice(0, count).map(x => x?.name).filter(Boolean);
      }
    }
  },
  created() {
    const waitTime = this.$route.query.wait;
    if (waitTime) {
      this.$store.commit('coffees/setWaitTime', Number(waitTime));
    } else if (this.showAd) {
      window.addEventListener('message', this.resizeFrame);

      this.$store.commit('coffees/setWaitTime', this.waitTime * .5);

      this.timeoutId = setTimeout(() => {
        this.renderAd = true;
        this.renderFonts();

      }, this.waitTime * 2.5) as any;

      slow();
    }

    this.$store.dispatch("coffees/getCoffeeList");
  },
  unmounted() {
    window.removeEventListener('message', this.resizeFrame);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId as any);
      this.timeoutId = null;
    }
  },
  methods: {
    currency,
    coffeeId(name: string) {
      return 'coffee-' + String(name).trim().toLowerCase().replace(/\s+/g, '-');
    },
    isSelectedCoffee(name: string) {
      return this.selectedCoffeeNames.includes(name);
    },
    // ...mapMutations("cart", ["addToCart"]),
    addToCart(name: string) {
      slow();
      this.$store.commit('cart/addToCart', name);

      if (this.$route.query.breakable) {
        console.error('Some additional workflow is broken.');
      }
    },
    showMenu(coffee: string, event: Event) {
      event.preventDefault();
      this.selectedCoffee = coffee;
      (this.$refs.dialog as any).showModal();
    },
    togglePromo(count: number) {
      this.showPromo =  count > 0 && (count) % 3 == 0;
      return;
    },
    closedPromo() {
      this.showPromo = false;
    },
    resizeFrame() {
      // setTimeout(() => {
      const iframe = this.$refs.iframe as HTMLIFrameElement;
      iframe.width = window.innerWidth + 'px';
      iframe.height = '300px';
      // }, this.waitTime * 1.7);
      // console.log('resize')

    },
    renderFonts() {
      this.timeoutId = setTimeout(() => {
        const newStyle = document.createElement('style');
        this.renderAd = true;
        newStyle.appendChild(document.createTextNode(`
          @font-face {
            font-family: 'Lobster';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            size-adjust: 140%;
            line-gap-override: 150%;
            descent-override: 30%;
            src: url(https://fonts.gstatic.com/s/lobster/v27/neILzCirqoswsqX9zoKmM4MwWJU.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }

        `));
        document.head.appendChild(newStyle);
        this.isBigger = true;
      }, this.waitTime * 1.5) as any;
    },
    translate(coffee: string) {
      this.$store.commit('coffees/translateCoffee', coffee);
    },
  },
});
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  display: grid;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 100px;
}

div {
  margin-top: 10px;
}

button {
  border: 4px solid black;
  background: antiquewhite;
  margin: 0 6px;
}

button:hover {
  border-color: goldenrod;
  color: goldenrod;
}

:deep(.pay) {
  display: block;
  right: 10px;
  bottom: 10px;
  align-self: flex-end;
}

:deep(.pay-container) {
  position: fixed;
  bottom: 0px;
  right: 10px;
}

@media (min-width: 500px) {
  ul {
    grid-template-columns: repeat(2, auto);
  }
}

@media (min-width: 800px) {
  ul {
    grid-template-columns: repeat(3, auto);
  }
}

li {
  padding: 10px 20px;
}

li:hover h4 {
  color: goldenrod;
}

li h4 {
  /* text-align: center; */
  margin: 10px 0;
}

.empty-message {
  text-align: center;
  padding: 60px 20px;
  grid-column: 1 / -1;
}

.empty-message h3 {
  color: #666;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-message p {
  color: #888;
  font-size: 1rem;
  margin: 0;
}
</style>
