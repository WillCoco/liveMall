import AsyncStorage from '@react-native-community/async-storage'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducers from '../reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const persistConfig = {
//   key: 'store',
//   storage: AsyncStorage,
//   blacklist: ['shop', 'im', 'asset', 'live'],
//   // whiteList: ['userData'],
//   timeout: null
// }

// const middleware = [thunkMiddleware, logger]
// const persistedReducer = persistReducer(persistConfig, rootReducer)


// export const store = createStore(persistedReducer, applyMiddleware(...middleware))
// export let persistor = persistStore(store)

// export default function configStore() {
//   // const store = createStore(persistedReducer, applyMiddleware(...middleware))
//   // let persistor = persistStore(store)
//   return { store, persistor }
// }


const localStorageVersion = 1;

// 分级持久化存储配置
const livePersistConfig = {
  key: 'live',
  storage: AsyncStorage,
  version: localStorageVersion,
  whitelist: ['pusherConfig'],
  timeout: null,
  migrate: (state: any) => {
    const version = state?._persist?.version;

    // 更新cameraId
    if (version === 1 && version !== localStorageVersion) {
      const camera = state?.pusherConfig?.profile?.cameraStreamingSetting?.camera;
      if (camera) {
        try {
          state.pusherConfig.profile.cameraStreamingSetting.cameraId = camera;
          delete state.pusherConfig.profile.cameraStreamingSetting.camera;
        } catch (err) {
          console.log('pusherConfig本地数据升级', err)
        }
      }
      return Promise.resolve(state);
    }
    return Promise.resolve(state);
  },
};

const userDataPersistConfig = {
  key: 'userData',
  storage: AsyncStorage,
  version: localStorageVersion,
  whitelist: ['isLogin', 'token', 'userInfo'],
  timeout: null,
  migrate: (state: any) => {
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  ...reducers,
  live: persistReducer(livePersistConfig, reducers.live),
  userData: persistReducer(userDataPersistConfig, reducers.userData),
});

const middleware = [thunk, logger]

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(rootReducer, undefined, enhancer);

export const persistor = persistStore(store)

// function configureStore(initialState?: any) {
//   const store = createStore(rootReducer, initialState, enhancer);
//   return {store, persistor: persistStore(store)};
// }

export default () => {
  return {
    store,
    persistor
  }
};