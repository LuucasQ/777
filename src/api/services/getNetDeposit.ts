import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestNetDeposit = {
  from?: string | Date
  to?: string | Date
}

export type ResponseNetDeposit = {
  value: number
  date: string
}

export const getNetDeposit = async ({ from, to }: RequestNetDeposit) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseNetDeposit[]> = await api.get('netDeposits')

  if(from && to){
    return data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.date).isSame(from))
  }

  return data
}