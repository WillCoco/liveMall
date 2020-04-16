import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LiveHomeScreen from '../pages/Live/LiveHomeScreen';
import AnchorDetailScreen from '../pages/Live/AnchorDetailScreen';
import LivingRoomScreen from '../pages/Live/LivingRoomScreen';

const LiveStack = createStackNavigator();

export default function LiveRouter() {
  return (
    <LiveStack.Navigator
      initialRouteName="LiveHome"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
      }}
    >
      <LiveStack.Screen
        name="LiveHome"
        component={LiveHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <LiveStack.Screen
        name="LivingRoomScreen"
        component={LivingRoomScreen}
        options={{
          title: 'My profile',
        }}
      />
      <LiveStack.Screen
        name="AnchorDetailScreen"
        component={AnchorDetailScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </LiveStack.Navigator>
  );
}


function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  return routeName
}
