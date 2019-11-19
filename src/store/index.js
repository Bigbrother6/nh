import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const state={
	sysNum:{},//左侧数据
	
	pie:[],
	total:10, //总数
	num:0,   //个数
	alarm:[],//原数据

	sysAll:[],  //各个系统
	permiss:{},
	active:0,
}
const getters={

}

const mutations={
	sysNum_fn(state,data){
		state.sysNum=data
	},
	pie_fn(state,data){
		state.pie=data;
	},
	total_fn(state,data){
		state.total=data
	},

	num_fn(state,data){
		state.num=data
	},
	sysAll_fn(state,data){
		state.sysAll=data
	},
	permiss_fn(state,data){
		state.permiss=data;
	},
	active_fn(state,data){
		state.active=data;
	}


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
