import configStore from "../../store";
import Toast from "react-native-tiny-toast";
import { toggleLoginState, setToke, setUserInfo } from "../../actions/user";
const { store } = configStore();
import { sleep } from "../../utils/tools";
import {getParam} from "./getParams";

const timeout = async (
  ms: number,
  path: string | RequestInfo
): Promise<any> => {
  await sleep(ms);
  return { timeout: path };
};

const DEFAULT_TIMEOUT = 100 * 1000; // 普通接口超时时间
const DEFAULT_UPLOAD_TIMEOUT = 2 * 60 * 1000; // 上传超时时间

// toRemove
// store.dispatch(setToke("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5NTk3MTA4NyIsImV4cCI6MTYyMDg5OTI5NCwidXVpZCI6IjlkMjAyN2EzYzY3ZDRjMGE5ZTk0NjgyZjI4MWU5YTg0IiwiaWF0IjoxNTg5MzYzMjk0fQ.N2bAajPgPfCuJRyNs0n2LabiSfAWZLD2epbhk-VFscM"));


let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  platform: "app",
  authentication: "",
};

interface Options {
  timeout?: number, // 超时时间
}

/**
 * get方法
 * @param path 
 * @param data 
 * @param options 
 */
export const get = (path: any, data?: any, options: Options = {}) => {
  console.log(path, data, 1111000000)
  // 加token
  const { userData } = store.getState();
  if (userData.token) {
    headers["authentication"] = userData.token;
  }

  // 处理参数
  if (data) {
    path = `${path}?${getParam(data)}`;
  }

  console.log("%cToken:", "color: red; font-size: 20px; ", userData.token);
  console.log("%cPath:", "color: red; font-size: 20px; ", path);
  console.log("%cParams:", "color: red; font-size: 20px; ", data);

  const fn = fetch(path, { headers })
    .then(async (response: any) => {
      const r1 = await response.text();
      const r2 = r1.trim && r1.trim();
      return r2 && JSON.parse(r2);
    });

  // 超时
  const raceTimeout = Promise.race([fn, timeout(options.timeout || DEFAULT_TIMEOUT, path)]);

  return raceTimeout;
};

/**
 * get方法
 * @param path 
 * @param data 
 * @param options 
 */
export const post = (path: RequestInfo, data: any, options: Options = {}) => {
  // 加token
  const { userData } = store.getState();
  if (userData.token) {
    headers["authentication"] = userData.token;
  }

  console.log("%cPath:", "color: red; font-size: 20px; ", path);
  console.log("%cParams:", "color: red; font-size: 20px; ", data);

  const fn = fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })
    .then(async (response: { text: () => any; status: number }) => {
      const r1 = await response.text();
      const r2 = r1.trim && r1.trim();
      return r2 && JSON.parse(r2);
    });

  const raceTimeout = Promise.race([fn, timeout(options.timeout || DEFAULT_TIMEOUT, path)]);

  return raceTimeout;
};

/**
 * 直播上传接口
 */
export interface FileType {
  uri: string;
  name: string;
  type: string;
}

export const uploadWorkMedia = (
  path: RequestInfo,
  params: UpdateParams,
  options: Options = {}
): any => {
  let formData = new FormData();
  console.log(params, "file");
  formData.append("fileType", params.fileType);
  formData.append("file", params.file as any);

  const { userData } = store.getState();

  const headers = {
    authentication: "",
    platform: "app",
  };

  if (userData.token) {
    headers["authentication"] = userData.token;
  }

  const fn = fetch(path, {
    method: "POST",
    headers,
    body: formData,
  })
    .then((response: { json: () => any }) => response.json());

  const raceTimeout = Promise.race([fn, timeout(options.timeout || DEFAULT_UPLOAD_TIMEOUT, path)]);

  return raceTimeout;
};


/**
 * 上传接口
 */
export interface UpdateParams {
  size: string;
  fileType: string;
  unit: string;
  file: FileType;
}

export const liveUpload = (path: RequestInfo, params: UpdateParams, options: Options = {}): any => {
  let formData = new FormData();
  formData.append("fileType", params.fileType);
  formData.append("unit", params.unit);
  formData.append("size", params.size);
  formData.append("file", params.file as any);

  const headers = {
    // 'Content-Type': 'multipart/form-data',
    authentication: "",
    platform: "app",
  };

  const { userData } = store.getState();

  if (userData.token) {
    headers["authentication"] = userData.token;
  }

  const fn = fetch(path, {
    method: "POST",
    headers,
    body: formData,
  })
    .then((response: { json: () => any }) => response.json())
    .catch((error: any) => console.error(error));

  const raceTimeout = Promise.race([fn, timeout(options.timeout || DEFAULT_UPLOAD_TIMEOUT, path)]);

  return raceTimeout
};
