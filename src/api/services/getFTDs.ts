import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestFTDs = {
  from?: string | Date
  to?: string | Date
}

export type ResponseFTDs = {
  value: number
  date: string
}

export const getFTDs = async ({ from, to }: RequestFTDs) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseFTDs[]> = await api.get('withdrawals')

  if(from && to){
    return data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.date).isSame(from))
  }

  return data
}