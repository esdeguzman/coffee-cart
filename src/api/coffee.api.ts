import { wait } from '../utils';

const authStorageKey = 'coffee-cart-auth';

const getAuthHeaders = () => {
  const auth = JSON.parse(localStorage.getItem(authStorageKey) || '{}');
  const headers: Record<string, string> = {};
  
  if (auth.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }
  
  return headers;
};

const handleUnauthorizedWithError = () => {
  const error = new Error('Unauthorized');
  (error as any).status = 401;
  throw error;
};

export default {
  getList(waitTime = 0, bypassAuth = false) {
    const url = `http://localhost:4170/coffees${waitTime > 0 ? `?wait=${waitTime}` : ''}${bypassAuth ? (waitTime > 0 ? '&' : '?') + 'bypassAuth=true' : ''}`
    const noCoffee = localStorage.getItem('no-coffee') === 'true';
    
    if (noCoffee) {
      return Promise.reject(new Error('404: No coffee available'));
    }
    
    return fetch(url, {
      headers: getAuthHeaders()
    }).then(res => {
      if (res.status === 401) {
        handleUnauthorizedWithError();
      }
      
      if (!res.ok) {
        const error = new Error(res.statusText || 'Failed to fetch coffee data');
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    });
  },
  // Add method for testing bypass
  getListForTesting(waitTime = 0) {
    return this.getList(waitTime, true);
  }
}