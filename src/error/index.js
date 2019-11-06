/**
 * 自定义error
 * 由于extends Error 在babel中有问题，所以此处实现没有使用class的方式
 */

function errorConstruct (errorName) {
  const CustomError = function (message) {
    this.name = errorName
    this.message = message || 'Default Message'
    this.stack = (new Error()).stack
  }
  
  CustomError.prototype = Object.create(Error.prototype)
  CustomError.prototype.constructor = CustomError
  return CustomError
}

export const WechatAuthError = errorConstruct('WechatAuthError')
