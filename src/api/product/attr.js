//平台属性管理模块请求
import request from '@/utils/request'

//获取一级分类的接口
export const reqGategory1=()=>request({url:'/admin/product/getCategory1',method:'get'})

//获取二级分类的接口
export const reqGategory2=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

//获取三级分类的接口
export const reqGategory3=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

//获取平台属性、
export const reqAttrList=(category1Id,category2Id,getCategory3)=>request({url:`/admin/product/attrInfoList
/${category1Id}/${category2Id}/${getCategory3}`,method:'get'})

//添加属性与属性值
export const reqAddOrUpdateAttr=(data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})
