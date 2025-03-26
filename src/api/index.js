import request from '../utils/request';

// 发送验证码
export const getCode = (data) => {
  return request.post('/get/code', data);
};