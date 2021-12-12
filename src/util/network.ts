import axios, { AxiosRequestConfig } from 'axios';

/**
 * Executes an HTTP `GET` method.
 * 
 * @param url Target URL
 * @param config Configuration
 * @returns Response
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return await (await axios.get<T>(url, config)).data;
}
