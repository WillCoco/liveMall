/**
 * 错误页面
 */
import * as React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import FallbackUI from '../../components/FallbackUI';
import { useRoute } from '@react-navigation/native';
import { EMPTY_OBJ } from '../../constants/freeze';

const ErrorPage = () =>  {
  const route: any = useRoute();
  const {errorInfo} = route.params || EMPTY_OBJ;
  return (
    <View style={styles.style}>
      <FallbackUI
        errorInfo={errorInfo}
      />
    </View>
  )
};

ErrorPage.defaultProps = {
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
  }
});

export default ErrorPage;