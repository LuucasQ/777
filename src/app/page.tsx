"use client"

import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, Calendar as CalendarIcon, UserRoundPlusIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { ResponseDeposit, getDeposit } from "@/api/services/getDeposits"
import { ResponseFTDs, getFTDs } from "@/api/services/getFTDs"
import { ResponseNetDeposit, getNetDeposit } from "@/api/services/getNetDeposit"
import { ResponseUsers, getUsers } from "@/api/services/getUsers"
import { ResponseWallets, getWallets } from "@/api/services/getWallets"
import { ResponseWithdrawals, getWithdrawals } from "@/api/services/getWithdrawals"
import { CardUser } from "@/components/Card/CardUser"
import { CardVolume } from "@/components/Card/CardVolume"
import { CardWallet } from "@/components/Card/CardWallet"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { currencyFormat } from "@/utils/currencyFormat"
import { AreaChart, Card } from "@tremor/react"
import { useEffect, useState } from "react"

type DataProps = {
  deposits: ResponseDeposit[]
  widthdrawals: ResponseWithdrawals[]
  netDeposits: ResponseNetDeposit[]
  FTDs: ResponseFTDs[]
  users: ResponseUsers[]
  wallets: ResponseWallets[]
}

export default function Home() {
  const [ date, setDate ] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const [ loading, setLoading ] = useState(true)
  const [ data, setData ] = useState<DataProps>({
    deposits: [],
    FTDs: [],
    netDeposits:[],
    users: [],
    wallets: [],
    widthdrawals: []
  })

  const fetchData = async () => {
    setLoading(true)

    const deposits = await getDeposit({
      from: date?.from,
      to: date?.to
    })

    const widthdrawals = await getWithdrawals({
      from: date?.from,
      to: date?.to
    })

    const netDeposits = await getNetDeposit({
      from: date?.from,
      to: date?.to
    })

    const FTDs = await getFTDs({
      from: date?.from,
      to: date?.to
    })

    const users = await getUsers({
      from: date?.from,
      to: date?.to
    })

    const wallets = await getWallets({
      from: date?.from,
      to: date?.to
    })

    await new Promise(resolve => setTimeout(resolve, 2000))

    setData({
      deposits,
      FTDs,
      netDeposits,
      users,
      wallets,
      widthdrawals
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [date])

  const chartdata = data.deposits.map((deposit) => ({
    date: deposit.date,
    Depósito: deposit.value
  }))

  return (
    <main className="flex flex-col min-h-screen items-center p-6 bg-zinc-900">
      <div className="flex max-w-7xl w-full items-center justify-between">
        <h1 className="text-slate-50 text-2xl">Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"link"}
              className={cn(
                "w-[300px] px-4 py-2 justify-start text-left font-normal bg-black border-zinc-600 border-2 text-zinc-400",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Escolha uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-4  max-w-7xl w-full mt-7 ">
        <CardVolume 
          title="Depósitos"
          loading={loading}
          icon={<ArrowUpIcon className="mr-2 h-4 w-4 text-orange-500" />}
          data={{
            volume: currencyFormat(data.deposits.reduce((curr, acc) => curr + acc.value, 0), 2),
            quantity: data.deposits.length,
            averageTicket: currencyFormat(data.deposits.reduce((curr, acc) => curr + acc.value, 0) / data.deposits.length, 2)
          }}
        />

        <CardVolume
          title="Saques"
          loading={loading}
          icon={<ArrowDownIcon className="m-2 h-4 w-4 text-orange-500" />}
          data={{
            volume: currencyFormat(data.widthdrawals.reduce((curr, acc) => curr + acc.value, 0), 2),
            quantity: data.widthdrawals.length,
            averageTicket: currencyFormat(data.widthdrawals.reduce((curr, acc) => curr + acc.value, 0) / data.widthdrawals.length, 2)
          }}
        />

        <CardVolume 
          title="NET Deposit"
          loading={loading}
          icon={<ArrowDownIcon className="m-2 h-4 w-4 text-orange-500" />}
          data={{
            volume: currencyFormat(data.netDeposits.reduce((curr, acc) => curr + acc.value, 0), 2),
            quantity: data.netDeposits.length,
            averageTicket: currencyFormat(data.netDeposits.reduce((curr, acc) => curr + acc.value, 0) / data.netDeposits.length, 2)
          }}
        />

        <CardVolume 
          title="FTDs"
          loading={loading}
          icon={<UserRoundPlusIcon className="m-2 h-4 w-4 text-orange-500" />}
          data={{
            volume: currencyFormat(data.FTDs.reduce((curr, acc) => curr + acc.value, 0), 2),
            quantity: data.FTDs.length,
            averageTicket: currencyFormat(data.FTDs.reduce((curr, acc) => curr + acc.value, 0) / data.FTDs.length, 2)
          }}
        />

        <CardUser 
          title="Usuários"
          loading={loading}
          icon={<UserRoundPlusIcon className="m-2 h-4 w-4 text-orange-500" />}
          data={{
            quantity: data.users.length,
            blockeds: data.users.filter(user => user.blocked).length,
            kyc: data.users.filter(user => user.kyc).length,
          }}
        />

        <CardWallet 
          title="Carteiras"
          loading={loading}
          icon={<UserRoundPlusIcon className="m-2 h-4 w-4 text-orange-500" />}
          data={{
            real: currencyFormat(data.wallets.reduce((curr, acc) => curr + acc.value, 0), 2),
            bonus: currencyFormat(data.wallets.reduce((curr, acc) => curr + acc.bonus, 0), 2),
            demo: currencyFormat(data.wallets.reduce((curr, acc) => curr + acc.demo, 0), 2)
          }}
        />

        <Card className="max-w-4xl bg-black rounded-lg ">
          <p className="text-base font-semibold text-slate-50">
            Transações diárias
          </p>

          {/**
           * Achei bem bugado esses CHARTS, talvez por nunca ter usado, mas fiz esse para demonstração.
           * Não deu para mudar a cor de texto dos itens dentro do chart, então deixei branco só para visualizar.
           */}
         
          <AreaChart
            className="mt-2 h-80"
            data={chartdata}
            index="date"
            categories={["Depósito"]}
            colors={['orange']}
            yAxisWidth={70}
            valueFormatter={(number) => {
              return `R$ ${currencyFormat(number, 2)}`
            }}
            style={{ backgroundColor: 'white', borderRadius: '8px' }}
            onValueChange={(value) => console.log(value, 22)}
          />
        </Card>
      </div>
    </main>
  );
}
