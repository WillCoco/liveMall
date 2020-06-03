import { CommonActions } from '@react-navigation/native';
import { getNavigation } from '../navigation/RootNavgation';
import { nanoid } from 'nanoid/non-secure';

/**
 * @params {string} routeName - 跳转目标
 * @params {object} options - 配置
 */
interface EasyNavigateOptions {
  params?: any, // 跳转参数
  excludeRouteNames?: Array<string>, // 排除路由
  exclude?: (routes: Array<any>) => Array<any>, // 排除方法
}

const easyNavigate = (routeName: string, options: EasyNavigateOptions) => {
  const navigation: any = getNavigation();

  if (navigation) {
    return;
  }

  // 跳转并缩短路由
  navigation.dispatch((state: any) => {
    // 排除历史路由
    const routes = excludeRoutes(state.routes, options)

    routes.push({
      key: `${routeName}-${nanoid()}`,
      name: routeName,
      params: options.params
    })

    return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
}

export function excludeRoutes(routes: Array<any>, options: EasyNavigateOptions): Array<any> {
  // 优先排除方法
  if (!!options.exclude) {
    let newRoutes = options.exclude(routes);
    return newRoutes;
  }

  // 排除excludeRouteNames
  if(options.excludeRouteNames) {
    let newRoutes = [...routes];
    let routeNames = routes.map(r => r.name);
    
    routeNames.forEach((name: any, index: number) => {
      if (routes.indexOf(name) !== -1) {
        newRoutes.splice(index, 1);
      }
    });
    return newRoutes;
  }

  return routes;
}

export function liveNavigate(routeName: string, params: any) {
  easyNavigate(routeName, {
    excludeRouteNames: ['AnchorDetail', 'LivingRoomScreen'],
    params
  }, );
}

export default easyNavigate;