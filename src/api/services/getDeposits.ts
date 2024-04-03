import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestDeposit = {
  from?: string | Date
  to?: string | Date
}

export type ResponseDeposit = {
  value: number
  date: string
}

export const getDeposit = async ({ from, to }: RequestDeposit) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseDeposit[]> = await api.get('deposits')

  if(from && to){
    return data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.date).isSame(from))
  }

  return data
}