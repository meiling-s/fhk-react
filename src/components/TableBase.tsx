import { ReactNode, useState } from 'react'
import { Checkbox } from '@mui/material'
import CustomCheckbox from './FormComponents/CustomCheckbox'
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
  id: number
  [key: string]: any
}

type TableProps = {
  header: HeaderTable[]
  dataRow: TableRow[]
  onDelete?: (type: string, row: TableRow) => void
  onEdit?: (type: string, row: TableRow) => void
  checkboxSelection?: boolean
  checkAll?: boolean
  onCheckAll?: (checked: boolean) => void
  checkedRows?: TableRow[]
  onCheckRow?: (checked: boolean, row: TableRow) => void
  useAction?: boolean
}

const TableColumnStatus: React.FC<TableColumnStatusProps> = ({
  children,
  width,
  status
}) => {
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

const TableBase: React.FC<TableProps> = ({
  header,
  dataRow,
  onDelete,
  onEdit,
  checkboxSelection = true,
  checkAll,
  onCheckAll,
  checkedRows,
  onCheckRow,
  useAction = true
}) => {
  const sortedRow = dataRow.sort((a, b) => a.id - b.id)
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

  const handleCheckAll = (checked: boolean) => {
    if (onCheckAll) {
      onCheckAll(checked)
    }
  }

  const handleCheckRow = (checked: boolean, row: TableRow) => {
    if (onCheckRow) {
      onCheckRow(checked, row)
    }
  }

  return (
    <div className="table-container overflow-y-hidden w-full">
      <table className="w-[95%] border-separate border-spacing-y-3 rounded-lg">
        <thead>
          <tr className="p-2">
            {checkboxSelection && (
              <th className="p1">
                <CustomCheckbox
                  className="px-3"
                  checked={checkAll}
                  onChange={handleCheckAll}
                />
              </th>
            )}
            {header.map((headerItem, index) => (
              <th
                className={`font-bold leading-[20px] text-base text-left p-1`}
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
          {sortedRow.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={`overflow-x-auto overflow-y-hidden whitespace-nowrap bg-white rounded-lg mb-3 ${
                checkedRows?.some(
                  (row) => JSON.stringify(row) === JSON.stringify(item)
                )
                  ? 'checked'
                  : ''
              }`}
            >
              {checkboxSelection && (
                <td className="rounded-tl-lg rounded-bl-lg">
                  <CustomCheckbox
                    className="px-3"
                    checked={checkedRows?.some(
                      (checkedRow) =>
                        JSON.stringify(checkedRow) === JSON.stringify(item)
                    )}
                    onChange={(isChecked) => handleCheckRow(isChecked, item)}
                  />
                </td>
              )}
              {header.map((headerItem, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`py-4 ${
                    columnIndex === header.length - 1
                      ? 'rounded-tr-lg rounded-br-lg'
                      : ''
                  }`}
                >
                  {headerItem.type === 'status' ? (
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
              {useAction && (
                <td className="px-3 py-0 rounded-tr-lg rounded-br-lg">
                  {item?.status === 'DELETED' ? (
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
                        className="cursor-pointer text-grey-dark mr-2"
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
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableBase
