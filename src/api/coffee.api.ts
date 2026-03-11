import { wait } from '../utils';

export default {
  getList(waitTime = 0) {
    const url = 'http://localhost:4170/coffees'
    return fetch(url).then(res => res.json()).then(x => wait(waitTime, x));
  },
}