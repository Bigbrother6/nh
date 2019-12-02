import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const state={

	
}
const getters={

}

const mutations={




}
//Action 一般做异步处理，或将多个mutation封装
const actions={
	
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})
