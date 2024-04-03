import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'

type RequestUsers = {
  from?: string | Date
  to?: string | Date
}

export type ResponseUsers = {
  name: string
  kyc: boolean
  blocked: boolean
  created_At: string
}

export const getUsers = async ({ from, to }: RequestUsers) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const { data }: AxiosResponse<ResponseUsers[]> = await api.get('users')

  if(from && to){
    return data.filter((item) => moment(item.created_At).isSameOrAfter(from) && moment(item.created_At).isSameOrBefore(to))
  }else if(from){
    return data.filter((item) => moment(item.created_At).isSame(from))
  }
  
  return data
}