import { wait } from '../utils';

export default {
  getList(waitTime = 0) {
    const url = `http://localhost:4170/coffees${waitTime > 0 ? `?wait=${waitTime}` : ''}`
    const noCoffee = localStorage.getItem('no-coffee') === 'true';
    
    if (noCoffee) {
      return Promise.reject(new Error('404: No coffee available'));
    }
    
    return fetch(url).then(res => {
      if (!res.ok) {
        const error = new Error(res.statusText || 'Failed to fetch coffee data');
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    });
  },
}