var debounce = (fn, wait) => {
  let timer, startTimeStamp = 0;
  let context, args;

  let run = (timerInterval) => {
    timer = setTimeout(() => {
      let now = (new Date()).getTime();
      let interval = now - startTimeStamp
      if (interval < timerInterval) { // the timer start time has been reset, so the interval is less than timerInterval
        console.log('debounce reset', timerInterval - interval);
        startTimeStamp = now;
        run(wait - interval);  // reset timer for left time
      } else {
        fn.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }

    }, timerInterval);
  }

  return function () {
    context = this;
    args = arguments;
    let now = (new Date()).getTime();
    startTimeStamp = now;

    if (!timer) {
      run(wait);    // last timer alreay executed, set a new timer
    }

  }

}
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}

// 生成两个list 一个是真实的list数据， 一个是页面渲染的list数据

function setDom(fatherDomMark, startIndex, endIndex, allList) {
    // 页面展示列表的长度
    showList = allList.slice(startIndex, endIndex)
    console.dir(fatherDomMark)
    for (let i = 0; i < showList.length; i++) {
      let li = document.createElement('li')
      li.key = showList[i].id
      li.title = showList[i].content
      li.textContent = showList[i].content

      // li.style.height = randomNum(20, 150) + 'px'
      li.style.height = itemHeight + 'px'

      fatherDomMark.style.paddingTop = ((startIndex) * itemHeight) + 'px'
      fatherDomMark.style.paddingBottom = ((allList.length - endIndex) * itemHeight) + 'px'
      if (fatherDomMark.children[i]) {
        fatherDomMark.children[i].key = li.key
        fatherDomMark.children[i].title = li.textContent
        fatherDomMark.children[i].textContent = li.textContent
        fatherDomMark.children[i].style.height = li.style.height
      } else {
        fatherDomMark.appendChild(li)
      }
    }
}

// allList 全部数据
let allList = [];
for (let i = 0; i <= 1000; i++) {
    let dataNow = i
    allList.push({
      id: dataNow,
      content: '测试数据' + dataNow
    })
  }
// 当前展示的数据
let showList = [];


// 每一个数据的高度 单位 px
let itemHeight = '50'

// 生成虚拟列表的方法
function initVList(fatherDOM, {allList, showList, itemHeight}) {
  let fatherDomMark = document.createElement(fatherDOM.tagName)
  fatherDOM.appendChild(fatherDomMark)
  // 父元素高度
  let fatherHeight = fatherDOM.clientHeight

  let showListLength = Math.ceil(fatherHeight / itemHeight)
  let startIndex, endIndex;

  startIndex = 0
  endIndex = startIndex + showListLength

  // 判断是否需要虚拟渲染
  let isNeedVirtual = fatherHeight < (allList.length * itemHeight)

  if (isNeedVirtual) {

    // 页面展示列表的长度

    setDom(fatherDomMark, startIndex, endIndex, allList)


    fatherDOM.addEventListener('scroll', debounce((e) => {
      let scrollTop = fatherDOM.scrollTop
      startIndex = Math.ceil(scrollTop / itemHeight)
      if (startIndex > allList.length - showListLength) {
        endIndex = startIndex + showListLength
      } else {
       endIndex = startIndex + showListLength
      }
      if (endIndex > allList.length ) {
        startIndex = allList.length - showListLength
        endIndex = allList.length
      };
      setDom(fatherDomMark, startIndex, endIndex, allList)

    }, 30))
  } else {
    setDom(fatherDomMark, startIndex, allList.length-1, allList)
  }

}

let fatherDom = document.getElementById('app')

initVList(fatherDom, {
  allList, showList, itemHeight
})
