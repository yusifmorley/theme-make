/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import { useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const router = useRouter()
const tip = msg => {
    ElMessage.error(msg)
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/'
    })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */


// 创建axios实例
const instance = axios.create({timeout: 10000 * 12});

// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/json';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        if (localStorage.getItem("bc")) {
            config.headers.setAuthorization(localStorage.getItem("bc"))
        }
        return config;
    },
    error => {
        tip("请求失败")
        Promise.error(error)
    } )

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            tip(`${response.status},${response.data.message}`)
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            if (!window.navigator.onLine) {
                tip("无网络！");
            } else {
                return Promise.reject(error);
            }
        }
    });
export default instance;
