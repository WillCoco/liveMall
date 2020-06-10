/**
 * 网络变化
 */
import React from 'react';
import NetInfo from "@react-native-community/netinfo";

export default function useNetInfo(onNetChange?: (state?: any, ...p: any) => any) {
  const [netInfo, setNetInfo] = React.useState();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (onNetChange) {
        onNetChange(state);
      }
      setNetInfo(state);
    });

    return () => {
      unsubscribe();
    }
  }, [onNetChange])
  
  return {
    netInfo,
    getNetInfo: NetInfo.fetch
  };
}
