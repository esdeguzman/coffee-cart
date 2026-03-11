import { wait } from '../utils';

export default {
  getList(waitTime = 0) {
    const url = 'http://localhost:4170/coffees'
    const noCoffee = localStorage.getItem('no-coffee') === 'true';
    
    if (noCoffee) {
      return Promise.reject(new Error('404: No coffee available'));
    }
    
    return fetch(url).then(res => res.json()).then(x => wait(waitTime, x));
  },
}