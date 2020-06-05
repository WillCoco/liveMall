import { Dimensions } from 'react-native'
import pxToDp from './px2dp'


interface Item {
  width: number
  height: number
  imageWidth: number
  imageHeight: number
}

/**
 * 瀑布流生成
 * @param {Array} items 传入要处理的数组，要求每个图片必须有宽高
 * @param {Number} textHeight 文本的高度
 */
export default function waterFall(items: any) {
  const pageWidth = Dimensions.get('window').width  // 页面的宽度
  let columns = 2 // 列数
  let itemWidth = (pageWidth - pxToDp(30)) / columns  // 项目的宽度
  // let gap = pxToDp(10)  // 间距
  
  // let startLeft = pxToDp(10)  // 开始的坐标（左）
  // let startTop = pxToDp(10)  // 开始的坐标（上）

  // let waterFallHeightArr = []

  // 设置每个项目的宽高
  items.forEach((item: Item) => {
    item.width = itemWidth
    item.height = item.imageHeight / item.imageWidth * itemWidth + pxToDp(140)
  })

  // for (let i = 0; i < items.length; i++) {
  //   if (i < columns && waterFallHeightArr.length < columns) {
  //     // 2- 确定第一行
  //     items[i].top = startTop
  //     items[i].left = i === 0 ? startLeft : startLeft + gap + itemWidth
  //     waterFallHeightArr.push(items[i].height + pxToDp(10))
  //   } else {
  //     // 其他行
  //     // 3- 找到数组中最小高度  和 它的索引
  //     let minHeight = waterFallHeightArr[0]
  //     let index = 0
  //     for (let j = 0; j < waterFallHeightArr.length; j++) {
  //       if (minHeight > waterFallHeightArr[j]) {
  //         minHeight = waterFallHeightArr[j]
  //         index = j
  //       }
  //     }
  //     // 4- 设置下一行的第一个盒子位置
  //     // top值就是最小列的高度 + gap
  //     items[i].top = waterFallHeightArr[index] + gap 
  //     // left值就是最小列距离左边的距离
  //     items[i].left = index === 0 ? startLeft : itemWidth + gap + startLeft

  //     // 5- 修改最小列的高度
  //     // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
  //     waterFallHeightArr[index] = items[i].top + items[i].height
  //   }
  // }

  // let maxHeight = -1
  // for (let j = 0; j < waterFallHeightArr.length; j++) {
  //   if (maxHeight < waterFallHeightArr[j]) {
  //     maxHeight = waterFallHeightArr[j]
  //   }
  // }

  // return { maxHeight, items }
  return { items }
}