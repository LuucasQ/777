import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestWithdrawals = {
  from?: string | Date
  to?: string | Date
}

export type ResponseWithdrawals = {
  value: number
  date: string
}

export const getWithdrawals = async ({ from, to }: RequestWithdrawals) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseWithdrawals[]> = await api.get('withdrawals')

  if(from && to){
    return data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.date).isSame(from))
  }

  return data
}