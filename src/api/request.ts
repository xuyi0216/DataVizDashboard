import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { createLogger } from '@/utils/logger'

const logger = createLogger('request')

/**
 * 统一请求实例。
 * 业务层只依赖本实例与 api/ 下的接口函数，切换 Mock / 真实 API 时无需改动业务代码。
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
})

instance.interceptors.request.use(
  (config) => {
    logger.debug(`request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截直接剥离 AxiosResponse，业务层拿到纯数据
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    logger.error('request failed', error?.message)
    return Promise.reject(error)
  },
)

export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return instance.request(config) as Promise<T>
}

export default instance
