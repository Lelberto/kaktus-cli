import axios, { AxiosRequestConfig } from 'axios';

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return await (await axios.get<T>(url, config)).data;
}
