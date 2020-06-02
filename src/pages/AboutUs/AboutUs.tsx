import React, { useEffect, useState } from 'react'
import { View, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Theme'
import { apiCheckUpdate } from '../../service/api'
import appjson from '../../../app.json'

import Header from './Header/Header'
import Form from './Form/Form'

const currentVersion = appjson.expo.version

export default function AboutUs() {
  const navigation = useNavigation()
  const [hasNewVer, setHasNewVer] = useState(0)
  const [updatePath, setUpdatePath] = useState('')
  const [version, setVersion] = useState('')
  const [forceUpdate, setForceUpdate] = useState(0)
  const [updateContent, setUpdateContent] = useState('')

  navigation.setOptions({
    headerTitle: '关于我们',
    headerStyle: {
      backgroundColor: Colors.basicColor,
      elevation: 0,  // 去除安卓状态栏底部阴影
    },
    headerTitleAlign: 'center',
    headerTintColor: Colors.whiteColor,
    headerBackTitleVisible: false,
    headerTransparent: true
  })

  useEffect(() => {
    checkVersion()
  }, [])

  const checkVersion = () => {
    apiCheckUpdate({
      ver: currentVersion,
      appType: Platform.OS === 'ios' ? 2 : 1
    }).then((res: any) => {
      console.log('检查更新', res)
      const hasNewVer = +res.isNeedUpdate
      setHasNewVer(0)

      if (hasNewVer) {
        setVersion(res.appVersion)
        setForceUpdate(+res.isMustUpdate)
        setUpdateContent(res.updateContent)
        setUpdatePath(res.srvPackageUrl || '')
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  return (
    <View>
      <Header currentVersion={currentVersion} />
      <Form
        hasNewVer={hasNewVer}
        version={version}
        forceUpdate={forceUpdate}
        updateContent={updateContent}
        updatePath={updatePath}
      />
    </View>
  )
}