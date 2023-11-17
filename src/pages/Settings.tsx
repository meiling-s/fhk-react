import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
  ADD_ICON
} from '../themes/icons'
import AddWarehouse from '../components/AddWarehouse'

interface WarehouseItem {
  id: string
  traditionalName: string
  simplifiedName: string
  englishName: string
  location: string
  status: string
  place: string
  recyclableSubcategories: string
}

// todo move to component table
type TableColumnProps = {
  children: ReactNode
}

type TableStatusProps = {
  children: ReactNode
}

const TableColumn: React.FC<TableColumnProps> = ({ children }) => {
  return (
    <div className="self-stretch w-[120px] overflow-hidden shrink-0 flex flex-row items-center justify-start">
      <div className="flex flex-row items-center justify-start">
        <div className="relative tracking-[1.5px] leading-[20px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          {children}
        </div>
      </div>
    </div>
  )
}

const TableStatusProps: React.FC<TableColumnProps> = ({ children }) => {
  return (
    <div className="self-stretch w-[103px] overflow-hidden shrink-0 flex flex-row items-center justify-start text-center text-smi text-green-primary">
      <div className="rounded-lg bg-green-light flex flex-row items-center justify-center py-1 px-[15px]">
        <div className="relative tracking-[1px] leading-[20px] font-medium">
          {children}
        </div>
      </div>
    </div>
  )
}
// end of compoent table
const Warehouse: FunctionComponent = () => {
  // const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  // get real data from api later
  const warehouseItems: WarehouseItem[] = [
    {
      id: '1',
      traditionalName: '火炭',
      simplifiedName: '火炭',
      englishName: 'Fo Tan',
      location: '是',
      place: '火炭拗背灣街14號',
      status: '已啓用',
      recyclableSubcategories: '紙張、金屬、塑膠、玻璃樽'
    },
    {
      id: '2',
      traditionalName: '火炭',
      simplifiedName: '火炭',
      englishName: 'Fo Tan',
      location: '是',
      place: '火炭拗背灣街14號',
      status: '已啓用',
      recyclableSubcategories: '紙張、金屬、塑膠、玻璃樽'
    }
  ]

  const headerTitles = [
    '繁體中文名稱',
    '简体中文名称',
    'English Name',
    '實體地點',
    '地點',
    '狀態',
    '回收物類別',
    '',
    ''
  ]

  return (
    <div className="settings-page relative bg-bg-primary w-full h-[1046px] overflow-hidden flex flex-row items-start justify-start text-center text-mini text-grey-darker font-tag-chi-medium">
      <div className=" self-stretch flex-1 bg-white flex flex-col items-start justify-start text-smi text-grey-middle font-noto-sans-cjk-tc">
        <div className="self-stretch flex-1 bg-bg-primary flex flex-col items-start justify-start text-3xl text-black font-tag-chi-medium">
          <div className="settings-container self-stretch flex-1 flex flex-col items-start justify-start pt-[30px] px-10 pb-[75px] text-mini text-grey-darker">
            <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
              <div className="settings-header self-stretch flex flex-row items-center justify-start gap-[12px] text-base text-grey-dark">
                <b className="relative tracking-[0.08em] leading-[28px]">
                  工場
                </b>
                <div
                  className="rounded-6xl bg-white overflow-hidden flex flex-row items-center justify-center py-2 pr-5 pl-3 gap-[5px] cursor-pointer text-smi text-green-primary border-[1px] border-solid border-green-pale"
                  onClick={handleDrawerOpen}
                >
                  <ADD_ICON />
                  <b className="relative tracking-[1px] leading-[20px]">新增</b>
                </div>
              </div>
              <div className="table-header self-stretch flex flex-row items-center justify-start pt-2 pb-0 pr-[18px] pl-3 gap-[12px] text-smi">
                <div className="overflow-hidden flex flex-row items-start justify-start">
                  <div className="w-7 h-7 flex flex-row items-center justify-center">
                    <div className="rounded bg-white overflow-hidden border-[1px] border-solid border-grey-field" />
                  </div>
                </div>
                {headerTitles.map((title, index) => (
                  <div
                    className={`self-stretch w-[120px] overflow-hidden shrink-0 flex flex-row items-center justify-start`}
                    key={index}
                  >
                    <b className="relative tracking-[1px] leading-[20px]">
                      {title}
                    </b>
                  </div>
                ))}
              </div>
              <div>
                {warehouseItems.map((item) => (
                  <div
                    className="table-content self-stretch rounded-lg bg-white flex flex-row items-center justify-between py-3 pr-[18px] pl-3 text-left mb-6 w-full"
                    key={item.id}
                  >
                    <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                      {/* Content for each column based on item properties 
                      todo move to component */}
                      <div className="overflow-hidden flex flex-row items-start justify-start">
                        <div className="w-7 h-7 flex flex-row items-center justify-center">
                          <div className="rounded bg-white overflow-hidden border-[1px] border-solid border-grey-field" />
                        </div>
                      </div>
                      <TableColumn>{item.traditionalName}</TableColumn>
                      <TableColumn>{item.simplifiedName}</TableColumn>
                      <TableColumn>{item.englishName}</TableColumn>
                      <TableColumn>{item.location}</TableColumn>
                      <TableColumn>{item.place}</TableColumn>
                      <TableStatusProps>{item.status}</TableStatusProps>
                      <TableColumn>{item.recyclableSubcategories}</TableColumn>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-[20px]">
                      {/* Edit and delete action */}
                      <EDIT_OUTLINED_ICON
                        onClick={handleDrawerOpen}
                        className="cursor-pointer text-grey-light"
                        fontSize="small"
                      />
                      <DELETE_OUTLINED_ICON
                        onClick={handleDrawerOpen}
                        className="cursor-pointer text-grey-light"
                        fontSize="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* right drawer */}
      <AddWarehouse
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
      ></AddWarehouse>
    </div>
  )
}

export default Warehouse
