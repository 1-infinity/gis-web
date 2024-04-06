import request from "@/utils/request";

// 获取需要处理的交通数据
export function getCodeImg() {
  return request({
    url: '/trafficProcessing',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })

}


export  function  yascTest(){
  return request({
    url: 'yasc/test02',
    method: 'get',
  })
}

