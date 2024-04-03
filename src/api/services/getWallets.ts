import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestWallets = {
  from?: string | Date
  to?: string | Date
}

export type ResponseWallets = {
  value: number
  bonus: number
  demo: number
  date: string
}

export const getWallets = async ({ from, to }: RequestWallets) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseWallets[]> = await api.get('wallets')

  if(from && to){
    return data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.date).isSame(from))
  }

  return data
}