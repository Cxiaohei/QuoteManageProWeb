import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  plugins: [persistedState()],//vuex持续化存储,默认存储到localStorage
})

export default store
