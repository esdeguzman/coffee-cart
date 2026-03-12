<template>
  <Coffee401 v-if="is401Error" />
  <div v-else class="account">
    <div class="header">
      <h1>Account Details</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
    <form @submit.prevent="save">
      <div class="form-group">
        <label for="username">Username</label>
        <div id="username" class="username">{{ user.username }}</div>
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="user.name" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="user.email" />
      </div>
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="spinner"></span>
        <span v-else>Save Updates</span>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Coffee401 from '../parts/Coffee401.vue';

const authStorageKey = 'coffee-cart-auth';

const authOrigin = 'http://localhost:4170';

export default defineComponent({
  name: 'AccountPage',
  components: { Coffee401 },
  data() {
    return {
      user: { username: '', name: '', email: '' },
      token: '',
      isLoading: false,
      is401Error: false
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
      if (auth.user && auth.token) {
        // Validate token by making a test API call to cart endpoint
        try {
          const response = await fetch(`${authOrigin}/api/cart`, {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          
          if (response.status === 401) {
            this.is401Error = true;
            return;
          }
          
          this.user = { ...auth.user };
          this.token = auth.token;
        } catch (error) {
          console.error('Failed to validate token:', error);
          this.is401Error = true;
        }
      } else {
        this.is401Error = true;
      }
    },
    async save() {
      this.isLoading = true;
      try {
        const response = await fetch(`${authOrigin}/update-user/${this.user.username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${this.token}`
          },
          body: new URLSearchParams({ 
            name: this.user.name, 
            email: this.user.email
          }).toString(),
        });

        if (response.status === 401) {
          // Token expired or invalid, show 401 error page
          const error = new Error('Unauthorized');
          (error as any).status = 401;
          throw error;
        }

        if (!response.ok) {
          throw new Error('Failed to save account details');
        }

        const updatedUser = await response.json();
        const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
        auth.user = updatedUser;
        localStorage.setItem(authStorageKey, JSON.stringify(auth));

        (this as any).$snackbar.showMessage({ content: 'Account details saved!', color: 'success' });
      } catch (error: any) {
        if (error.status === 401) {
          this.is401Error = true;
        } else {
          console.error(error);
          (this as any).$snackbar.showMessage({ content: 'Failed to save account details. Please try again.', color: 'error' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      localStorage.removeItem(authStorageKey);
      this.$router.push('/');
    },
  },
});
</script>

<style scoped>
.account {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 4px solid #000;
  background: antiquewhite;
  text-align: left;
}
.username {
  font-size: xx-large;  
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid black;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}
input {
  width: 100%;
  padding: 8px;
  border: 2px solid #000;
  font-family: inherit;
  font-size: 20px;
  box-sizing: border-box;
}
button {
  border: 4px solid #000;
  background: antiquewhite;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 4px;
}
button:hover {
  border-color: goldenrod;
  color: goldenrod;
}
button:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(0,0,0,.3);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.logout-button {
  background: transparent;
  border: none;
  color: black;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  font-size: xx-large;
  padding: 0;
}
.logout-button:hover {
  color: grey;
  border-bottom: 1px dotted grey;
}
</style>
