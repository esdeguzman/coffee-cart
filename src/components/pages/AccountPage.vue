<template>
  <div class="account">
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
      <button type="submit">Save Updates</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const authStorageKey = 'coffee-cart-auth';

const authOrigin = 'http://localhost:4170';

export default defineComponent({
  name: 'AccountPage',
  data() {
    return {
      user: { username: '', name: '', email: '' },
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
      if (auth.user) {
        this.user = auth.user;
      }
    },
    async save() {
      try {
        const response = await fetch(`${authOrigin}/update-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(this.user).toString(),
        });

        if (!response.ok) {
          throw new Error('Failed to save account details');
        }

        const updatedUser = await response.json();
        const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
        auth.user = updatedUser;
        localStorage.setItem(authStorageKey, JSON.stringify(auth));

        alert('Account details saved!');
      } catch (error) {
        console.error(error);
        alert('Failed to save account details. Please try again.');
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