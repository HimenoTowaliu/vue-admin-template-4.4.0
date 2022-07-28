import mockRequest from '@/utils/request -mork'
const state={
    list:{}
}
const mutations={
    GETDATA(state,data){
        state.list=data
    }
}
const actions={
    async getData({commit}){
       let result=await mockRequest.get('/home/list')
    //    console.log(result)
    if(result.code==20000){
        commit('GETDATA',result.data)
    }
    }
}
const getters={}
export default {
    state,
    mutations,
    actions,
    getters
}