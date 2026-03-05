<template>
  <ul>
    <li>
      <router-link aria-label="Menu page" to="/">menu</router-link>
    </li>
    <li>
      <router-link aria-label="Cart page" to="/cart">cart ({{ cartCount }})</router-link>
    </li>
    <li>
      <router-link aria-label="GitHub page" to="/github">github</router-link>
    </li>
    <li v-if="isLoggedIn">
      <router-link aria-label="Account page" to="/account">account</router-link>
    </li>
    <li v-else>
      <a :href="loginUrl" aria-label="Login page">login</a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

const authStorageKey = 'coffee-cart-auth'
const authOrigin = 'http://localhost:4170'

const readAuth = () => {
  try {
    const raw = localStorage.getItem(authStorageKey)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default defineComponent({
  name: 'Header',
  computed: {
    ...mapGetters({
      cartCount: "cart/cartCount"
    }),
    isLoggedIn(): boolean {
      const _ = this.$route.fullPath
      const auth = readAuth()
      return Boolean(auth?.token)
    },
    loginUrl(): string {
      const returnTo = `${window.location.origin}${this.$route.fullPath}`
      const url = new URL('/login', authOrigin)
      url.searchParams.set('returnTo', returnTo)
      return url.toString()
    }
  },
  methods: {
    logout() {
      localStorage.removeItem(authStorageKey)
      window.location.assign(this.loginUrl)
    }
  }
})
</script>

<style scoped>
ul {
  display: flex;
  justify-content: center;
  border-bottom: 4px solid black;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgb(250, 255, 255);
  margin-block: 0;
}

li {
  list-style: none;
  padding: 10px 10px;
}

a {
  color: black;
  font-weight: bold;
  text-decoration: none;
}

a:hover {
  color: grey;
  text-decoration: none;
  border-bottom: 1px dotted grey;
}

a.router-link-active {
  color: goldenrod;
  border-bottom: 1px dotted goldenrod;
}

button {
  background: transparent;
  border: none;
  color: black;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

button:hover {
  color: grey;
  border-bottom: 1px dotted grey;
}

@media (min-width: 500px) {
  li {
    padding: 10px 20px;
  }

  a {
    font-size: 1.2rem;
  }
}
</style>
