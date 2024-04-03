import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"
import { ReactElement } from "react"
import { Card, CardContent, CardTitle } from "../ui/card"

type Props = {
  title: string
  loading?: boolean
  icon: ReactElement
  data: {
    real: string
    bonus: string
    demo: string
  }
}

export const CardWallet = ({ title, loading, icon, data }: Props) => {
  return (
    <Card className={cn("bg-black px-6 py-5 border-none")}>
      <CardTitle className={cn("flex items-center justify-between")}>
        <p className="text-slate-50 text-base">{title}</p>
        {icon}
      </CardTitle>
      <CardContent className={cn("p-0 mt-4")}>
        {loading ? (
          <div className="w-full">
            <LoaderIcon className="m-auto h-4 w-4 text-orange-500" />
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <p className="text-zinc-600">REAL: </p>
              <p className="text-slate-50">R$ {data.real}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-zinc-600">BÔNUS: </p>
              <p className="text-slate-50">{data.bonus}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-zinc-600">DEMO: </p>
              <p className="text-slate-50">R$ {data.demo}</p>
            </div>
          </>
          )}
      </CardContent>
    </Card>
  )
}