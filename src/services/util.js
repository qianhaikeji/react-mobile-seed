import _ from 'lodash'
export function makeCancelable (promise) {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

// const isFunction = input => typeof input === 'function';
// export default predicate => elemOrThunk =>
//   predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
export function renderIf (predicate) {
  return elemOrThunk =>
    predicate ? (_.isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
}

export function compareAppVersion(remoteVersion, localVersion){ 
  function toNum(a) {
    a = a.toString();
    //也可以这样写 var c=a.split(/\./);
    var c=a.split('.');
    var num_place=["","0","00","000","0000"],r=num_place.reverse();
    for (var i=0;i<c.length;i++){ 
        var len=c[i].length;       
        c[i]=r[len]+c[i];  
    } 
    var res= c.join(''); 
    return res; 
  } 

  let rvNum = toNum(remoteVersion)
  let lvNum = toNum(localVersion)
  if (rvNum > lvNum) {
    return 1
  } else if (rvNum === lvNum) {
    return 0
  } else {
    return -1
  }
}

// 被 promisefy 的异步函数，需满足以下2点要求
// 1. 最后一个参数是函数
// 2. 回调函数的参数为 (err, result)，前面是可能的错误，后面是正常的结果
function promisefy (asyncFunc) {
  function promiseFunc (...args) {
    // args 为实际调用时，传的前 n-1 个参数。
    return new Promise((resolve, reject) => {
      let preArgs = _.slice(args, 0, args.length)
      asyncFunc(...preArgs, function (err, result) {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  }
  return promiseFunc
}

// 回调函数的参数为 (result)
function promisefyNoError (asyncFunc) {
  function promiseFunc (...args) {
    // args 为实际调用时，传的前 n-1 个参数。
    return new Promise((resolve, reject) => {
      let preArgs = _.slice(args, 0, args.length)
      asyncFunc(...preArgs, function (result) {
        resolve(result)
      })
    })
  }
  return promiseFunc
}

export async function playVoice (audio, audioPath) {
  return new Promise((resolve, reject) => {
    audio.src = audioPath
    audio.play()
    console.info(audio.src, audio.duration)
    audio.onended = function() {
      resolve()
    }
  })
}

export function parseUlrParams (name) {
  let reg = new RegExp('(^|&|\\?|%3F)' + name + '(=|%3D)([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  return r && r[3]
}

export function waitFor (ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function calcDurations(duration) {
  let totalSeconds = (duration / 1000).toFixed(0)
  let minuts = (totalSeconds / 1000).toFixed(0)
  let seconds = (totalSeconds % 1000).toFixed(0)
  if (minuts >= 1) {
    return `${minuts}'${seconds}"`
  }
  return `${seconds}"`
}

export function shadeSn(sn) {
  if (!sn) return
  let chars = sn.split('')
  chars = _.fill(chars, '*', 2, chars.length - 6)
  return chars.join('')
}

export function shadePhone(phone) {
  if (!phone) return
  let chars = phone.split('')
  chars = _.fill(chars, '*', 3, chars.length - 4)
  return chars.join('')
}