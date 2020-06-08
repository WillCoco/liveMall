import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Steps } from '@ant-design/react-native'
import { Colors } from '../../constants/Theme'
import pxToDp from '../../utils/px2dp'

interface Props {
  expressList: Array<any>
}

const Step = Steps.Step

export default function ExpressStepper(props: Props) {
  const { expressList } = props

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Steps current={1}>
        {
          expressList && expressList.map((item: any, index: number) => {
            return (
              <Step
                key={`step-${index}`}
                title={
                  <View>
                    <Text>{item.time}</Text>
                  </View>
                }
                description={
                  <View>
                    <Text>{item.context}</Text>
                  </View>
                }
                status={index === 0 ? 'wait' : 'finish'}
              />
            )
          })
        }
      </Steps>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    marginTop: pxToDp(10),
    padding: pxToDp(30)
  }
})