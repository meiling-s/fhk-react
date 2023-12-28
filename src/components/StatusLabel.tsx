import { ReactNode, useState } from 'react'

type TableColumnStatusProps = {
  width?: number
  status?: string
}

const StatusLabel: React.FC<TableColumnStatusProps> = ({ width, status }) => {
  const rowStatus = status?.toLocaleLowerCase()
  return (
    <div
      style={{
        width: width ? `${width}px` : '120px'
      }}
      className={` text-center self-stretch text overflow-hidden shrink-0 flex flex-row items-center justify-start text-smi`}
    >
      <div
        className={`${
          rowStatus === 'deleted'
            ? 'bg-rose-300 text-rose-800'
            : rowStatus === 'inactive'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-light text-green-primary'
        } rounded-lg  flex flex-row items-center justify-center py-1 px-[15px]`}
      >
        <div className="relative tracking-[1px] leading-[20px] font-medium">
          {rowStatus === 'deleted'
            ? '刪除'
            : rowStatus === 'inactive'
            ? '不活跃的'
            : '已啓用'}
        </div>
      </div>
    </div>
  )
}

export default StatusLabel
