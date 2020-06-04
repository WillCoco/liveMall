import React, { useState, useEffect, useRef } from 'react'
import { View, Text, AppState, StyleSheet } from 'react-native'
import { useIsFocused, useRoute } from '@react-navigation/native'
import pxToDp from '../../utils/px2dp'
import { Colors } from '../../constants/Theme'

let timer: any

export default function SeckillCountDown() {
  const route = useRoute()
  const isStart = useRef(false)
  const isFocused = useIsFocused()
  const [countDownInfo, setCountDownInfo] = useState({
    hours: 0,
    min: 0,
    sec: 0
  })

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  useEffect(() => {
    isFocused ? setCountDown() : clearTimer()
  }, [isFocused])

  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active' && !isStart.current) {
      setCountDown()
    } else if (nextAppState === 'background') {
      clearTimer()
    }
  }

  /**
   * 设置秒杀倒计时
   */
  const setCountDown = () => {
    if (isStart.current) return

    const curHour = new Date().getHours()

    let seckillCountdown: number

    if (curHour >= 20) {  // 20 点之后
      seckillCountdown = new Date().setHours(23, 59, 59, 999) + 1 - new Date().getTime() + 10 * 1000 * 60 * 60
    } else if (curHour >= 10 && curHour < 14) {  // 10：00 ～ 14:00
      seckillCountdown = new Date().setHours(14, 0, 0, 0) - new Date().getTime()
    } else {  // 14:00 ～ 20:00
      seckillCountdown = new Date().setHours(20, 0, 0, 0) - new Date().getTime()
    }

    timer = setInterval(() => {
      seckillCountdown -= 1000
      countDown(seckillCountdown)
    }, 1000)

    isStart.current = true
  }

  const countDown = (seckillCountdown: number) => {
    let diff = seckillCountdown / 1000

    if (diff <= 0) {
      return false
    }

    const time = {
      hours: 0,
      min: 0,
      sec: 0
    }

    if (diff >= 3600) {
      time.hours = Math.floor(diff / 3600)
      diff -= time.hours * 3600
    }
    if (diff >= 60) {
      time.min = Math.floor(diff / 60)
      diff -= time.min * 60
    }

    time.sec = diff

    setCountDownInfo(time)
  }

  /**
   * 清楚定时器
   */
  const clearTimer = () => {
    if (route.name === 'GoodsInfo') {
      console.log('-----------------------------------')
      return 
    }
    clearInterval(timer)
    isStart.current = false
    setCountDownInfo({
      hours: 0,
      min: 0,
      sec: 0
    })
  }

  return (
    <View style={styles.countDown}>
      <Text style={styles.time}>{(countDownInfo.hours + '').padStart(2, '0')}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.time}>{(countDownInfo.min + '').padStart(2, '0')}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.time}>{(~~countDownInfo.sec + '').padStart(2, '0')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  countDown: {
    flexDirection: 'row'
  },
  time: {
    height: pxToDp(36),
    lineHeight: pxToDp(36),
    backgroundColor: Colors.blackColor,
    color: Colors.whiteColor,
    width: pxToDp(40),
    textAlign: 'center'
  },
  colon: {
    marginLeft: pxToDp(5),
    marginRight: pxToDp(5)
  },
})