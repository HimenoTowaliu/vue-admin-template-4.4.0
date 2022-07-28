import request from '@/utils/request'

//获取spu列表数据的接口
export const reqSpuList=(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

//获取某一个spu信息
export const reqSpu=(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//获取品牌的信息
export const reqTradeMarkList=()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

//获取spu图片的接口
export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取平台的全部销售属行 真个平台销售属性一共三ge 
export const reqBaseSaleAttrList=()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})

//修改spu 添加spu 对于修改或者添加 参数大致一样 区别在于是否有id
export const reqAddOrUpdateSpu=(spuInfo)=>{
    //如果参数有id那么为修改spu
    if(spuInfo.id){
        return request({url:`/admin/product/updateSpuInfo`,method:'post',data:spuInfo})
    }else{
        //添加spu
        return request({url:`/admin/product/saveSpuInfo`,method:'post',data:spuInfo})
    }
}

//删除spu
export const reqDeleteSpu=(spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

//获取图片的数据
// export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取销售属性列表
export const reqSaleAttrList=(spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

//获取平台属性
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加sku
export const reqAddSku=(skuInfo)=> request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

//获取某spu的sku的列表
export const reqSkuList=(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})