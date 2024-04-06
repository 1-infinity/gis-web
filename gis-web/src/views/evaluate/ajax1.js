import axios from 'axios'
import serverInfo from "@/views/simulator/serverInfo";
const service = axios.create({
  baseURL: serverInfo.baseURL,
  timeout: 5000,
})

export default (url = '', data = {}, type = 'GET') => {
  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach((key) => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送GET请求
      promise = service.get(url)
    } else {
      promise = service.post(url, data)
    }
    promise.then((res) => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
