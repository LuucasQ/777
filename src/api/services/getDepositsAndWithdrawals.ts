import { AxiosResponse } from 'axios'
import moment from 'moment'
import { api } from '../api'
import { ResponseDeposit } from './getDeposits'
import { ResponseWithdrawals } from './getWithdrawals'

type RequestDepositsAndWithdrawals = {
  from?: string | Date
  to?: string | Date
}


export const getDepositsAndWithdrawals = async ({ from, to }: RequestDepositsAndWithdrawals) => {
  // JSON-SERVER não oferece suporte para filtros avançados, então optei por fazer manual
  const responseWidthdrawal: AxiosResponse<ResponseWithdrawals[]> = await api.get('withdrawals')
  const responseDeposit: AxiosResponse<ResponseDeposit[]> = await api.get('deposits')

  if(from && to){
    return {
      deposits: responseDeposit.data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to)),
      widthdrawal: responseWidthdrawal.data.filter((item) => moment(item.date).isSameOrAfter(from) && moment(item.date).isSameOrBefore(to)),
    }
  }else if(from){
    return {
      deposits: responseDeposit.data.filter((item) => moment(item.date).isSame(from)),
      widthdrawal: responseWidthdrawal.data.filter((item) => moment(item.date).isSame(from))
    }
  }

  return {
    deposits: responseDeposit.data,
    widthdrawal: responseWidthdrawal.data
  }
}