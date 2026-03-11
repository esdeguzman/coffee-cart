import coffee from '../../api/coffee.api'

// initial state
const state = () => ({
  waitTime: 0,
  list: [],
  error: null as string | null,
  isLoading: false
})

// getters
const getters = {}

// actions
const actions = {
  async getCoffeeList({ state, commit }: any) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const list = await coffee.getList(state.waitTime);
      commit("getListSuccess", list);
    } catch (err: any) {
      commit("getListFailure", err);
      return err;
    } finally {
      commit('setLoading', false);
    }
  }
}

// mutations
const mutations = {
  setWaitTime(state: any, time: number) {
    state.waitTime = time;
  },
  setLoading(state: any, isLoading: boolean) {
    state.isLoading = isLoading;
  },
  setError(state: any, error: string | null) {
    state.error = error;
  },
  getListSuccess(state: any, coffees: any) {
    state.list = coffees;
    state.error = null;
  },
  getListFailure(state: any, err: any) {
    state.list = [];
    state.error = err?.message || 'Failed to load coffee data';
  },
  translateCoffee(state: any, coffee: any) {
    const selected = state.list.find((x: any) => x.name === coffee) || {}
    selected.isTranslated = !selected.isTranslated;

    state.list = [...state.list]
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}