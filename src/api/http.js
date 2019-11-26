/**
 * 请求工具封装
 */
import axios from 'axios'
import qs from 'qs'
import { Message,Loading } from 'element-ui';
let loadinginstace; //load加载
//let apiBaseUrl = process.env.BASE_API;
// var service=axios.create({
//     baseURL:apiBaseUrl,
//     //withCredentials:true,
//     timeout:15000
// })

if (process.env.NODE_ENV === "development") {
    console.log("开发环境");
    
  }else {
    console.log("生产环境");
   
  }

axios.defaults.timeout = 20000;
axios.defaults.withCredentials = false
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.params = {};
// 添加请求拦截器
axios.interceptors.request.use(config => {
    loadinginstace = Loading.service({fullscreen: true}) // 请求打开loading
	// 在发送请求之前做些什么
	return config;
}, function(error) {
	console.log(error);
	// 对请求错误做些什么
    console.log("对请求错误做些什么");
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(
   
    function(response) {
        //响应成功 // 对响应数据做点什么
        loadinginstace.close();  // 响应成功关闭loading
        console.log("状态码"+response.status);
        return response.data
    },
    function(error) {
        // 对响应错误做点什么
        //获取状态码404没有响应
        console.log("对响应错误做点什么"+error.response)
	    return Promise.reject(error);
});

// let prefix  = process.env.baseURL
let prefix=window.g.dev_url;
console.log(prefix)
export default{
    //get请求
    get(url,param){
        return new Promise((resolve,reject)=>{
            axios({
                method:'get',
                url:prefix+url,
                params:param,
            }).then(res=>{
                resolve(res);
            }).catch(err=>{
                console.log(err,'异常');
                loadinginstace.close();  // 响应成功关闭loading
                Message.error({message:"网络错误",center:true,customClass:"MessError",duration:1000});
            })

        })
    },
    //post请求
    post(url,param){
        return new Promise((resolve,reject)=>{
            axios({
                method:'post',
                url:prefix+url,
                data:qs.stringify(param),
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                console.log(err,'异常');
                loadinginstace.close();  // 响应成功关闭loading
                Message.error({message:"网络错误",center:true,customClass:"MessError",duration:1000});
            })
        })
    },
    axiospost(url,param){
        return new Promise((resolve,reject)=>{
            axios({
                method:'post',
                url:prefix+url,
                data:param,
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                console.log(err,'异常');
                loadinginstace.close();  // 响应成功关闭loading
                Message.error({message:"网络错误",center:true,customClass:"MessError",duration:1000});
            })
        })
    }
}




