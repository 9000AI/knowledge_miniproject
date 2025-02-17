// 创建一个适用于小程序的 bridge.js
const bridgeReady = (callback) => {
    // 小程序环境中直接执行回调
    if (typeof callback === 'function') {
        callback()
    }
}

module.exports = {
    bridgeReady
} 