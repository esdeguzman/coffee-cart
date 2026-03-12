const authStorageKey = 'coffee-cart-auth';
const authOrigin = 'http://localhost:4170';

const getAuthHeaders = () => {
  const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.token || ''}`
  };
};

const handleUnauthorized = () => {
  const returnTo = `${window.location.origin}${window.location.pathname}`;
  const loginUrl = new URL('/login', authOrigin);
  loginUrl.searchParams.set('returnTo', returnTo);
  window.location.assign(loginUrl.toString());
};

const handleUnauthorizedWithError = () => {
  const error = new Error('Unauthorized');
  (error as any).status = 401;
  throw error;
};

export default {
  async getCart() {
    try {
      const response = await fetch(`${authOrigin}/api/cart`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        handleUnauthorizedWithError();
      }

      if (!response.ok) {
        const error = new Error(`Failed to fetch cart: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Cart API error:', error);
      throw error;
    }
  },

  async saveCart(items: any[]) {
    try {
      const response = await fetch(`${authOrigin}/api/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items })
      });

      if (response.status === 401) {
        handleUnauthorizedWithError();
      }

      if (!response.ok) {
        const error = new Error(`Failed to save cart: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Cart save error:', error);
      throw error;
    }
  }
};
