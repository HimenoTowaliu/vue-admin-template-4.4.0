//这个模块获取品牌管理的数据的模块


import request from '../../utils/request'

//获取品牌列表的接口 
export const reqTradeMarkList=(page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,methods: 'get'})

//添加品牌
//切记 对于新增的品牌 给服务器传递数据 不需要传递id id由服务器生成


//修改品牌  参数 id 名称 logo
export const reqAddOrUpdateTradeMark=(tradeMark)=>{
    //有id 则为修改
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
    }else{
        //新增品牌
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

//删除品牌的接口
export const reqDeleteTrademark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})