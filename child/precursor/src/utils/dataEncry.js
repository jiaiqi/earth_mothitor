import Base64 from '@/utils/base.js'

// 加密
export function encode(value) {
  let base = new Base64()
  let data = base.encode(JSON.stringify(value))
  return data
}
// 解密
export function decode(value) {
  let base = new Base64()
  let data = JSON.parse(base.decode(value))
  return data
}
