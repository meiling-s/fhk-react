import { ReactNode, useState } from 'react'
import { Checkbox } from '@mui/material'
import {
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
  ADD_ICON
} from '../themes/icons'

type TableColumnStatusProps = {
  children: ReactNode
  width?: number
  status?: string
}

type HeaderTable = {
  type?: string
  label?: string
  field: string
  width?: number
}

type TableRow = {
  [key: string]: string | number | null
}

type TableProps = {
  header: HeaderTable[]
  dataRow: TableRow[]
  onDelete?: (type: string, row: TableRow) => void
  onEdit?: (type: string, row: TableRow) => void
  checkboxSelection?: boolean
}

const TableColumnStatus: React.FC<TableColumnStatusProps> = ({
  children,
  width,
  status
}) => {
  return (
    <div
      style={{
        width: width ? `${width}px` : '120px'
      }}
      className={` text-center self-stretch text overflow-hidden shrink-0 flex flex-row items-center justify-start text-smi`}
    >
      <div
        className={`${
          status === 'deleted'
            ? 'bg-rose-300 text-rose-800'
            : 'bg-green-light text-green-primary'
        } rounded-lg  flex flex-row items-center justify-center py-1 px-[15px]`}
      >
        <div className="relative tracking-[1px] leading-[20px] font-medium">
          {children === 'deleted' ? '刪除' : '已啓用'}
        </div>
      </div>
    </div>
  )
}

const TableBase: React.FC<TableProps> = ({
  header,
  dataRow,
  onDelete,
  onEdit,
  checkboxSelection = true
}) => {
  const handleDelete = (row: TableRow) => {
    if (onDelete) {
      onDelete('delete', row)
    }
  }

  const handleEdit = (row: TableRow) => {
    if (onEdit) {
      onEdit('edit', row)
    }
  }

  return (
    <div className="table-container overflow-x-auto overflow-y-hidden w-full">
      <table className="w-full border-separate border-spacing-y-3 rounded-lg">
        <thead>
          <tr className="p-2">
            {checkboxSelection && (
              <th>
                <Checkbox color="primary" />
              </th>
            )}
            {header.map((headerItem, index) => (
              <th
                className={`font-bold leading-[20px] text-base text-left`}
                key={index}
                style={{
                  width: headerItem.width ? `${headerItem.width}px` : '120px'
                }}
              >
                {headerItem.label}
              </th>
            ))}
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="overflow-x-scroll">
          {dataRow.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="overflow-x-auto overflow-y-hidden whitespace-nowrap bg-white p-2 rounded-lg mb-3"
            >
              {checkboxSelection && (
                <td className="rounded-tl-lg rounded-bl-lg">
                  <Checkbox color="primary" />
                </td>
              )}
              {header.map((headerItem, columnIndex) => (
                <td key={columnIndex}>
                  {headerItem.type == 'status' ? (
                    <TableColumnStatus
                      width={
                        typeof headerItem.width === 'number'
                          ? headerItem.width
                          : 120
                      }
                      status={item[headerItem.field as string] as string}
                    >
                      {item[headerItem.field as string]}
                    </TableColumnStatus>
                  ) : (
                    <div
                      style={{
                        width: headerItem.width
                          ? `${headerItem.width}px`
                          : '120px'
                      }}
                      className="text-left text-smi overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {item[headerItem.field as string]}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-3 py-0">
                {item?.status === 'deleted' ? (
                  <div className="flex justify-around ">
                    <EDIT_OUTLINED_ICON
                      className=" text-grey-light cursor-not-allowed"
                      fontSize="small"
                    />
                    <DELETE_OUTLINED_ICON
                      className="text-grey-light cursor-not-allowed"
                      fontSize="small"
                    />
                  </div>
                ) : (
                  <div className="flex justify-around">
                    <EDIT_OUTLINED_ICON
                      className="cursor-pointer text-grey-dark "
                      fontSize="small"
                      onClick={() => handleEdit(item)}
                    />
                    <DELETE_OUTLINED_ICON
                      className="cursor-pointer text-grey-dark"
                      fontSize="small"
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableBase
