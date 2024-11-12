import { useEffect, useState } from 'react'

import { Box, Divider, Grid, InputAdornment } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import CustomField from '../../../components/FormComponents/CustomField'

import CustomTextField from '../../../components/FormComponents/CustomTextField'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import { singleRecyclable } from '../../../interfaces/collectionPoint'
import { PorDetail } from '../../../interfaces/processOrderQuery'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import {
  extractError,
  formatWeight,
  getThemeCustomList,
  onChangeWeight
} from '../../../utils/utils'
import { localStorgeKeyName, STATUS_CODE } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import ProductListSingleSelect, {
  singleProduct
} from '../../../components/SpecializeComponents/ProductListSingleSelect'

const InputProcessForm = ({
  drawerOpen,
  handleDrawerClose,
  plannedStartAt,
  formType = 'create',
  onSave,
  dataSet
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
  plannedStartAt: string
  formType?: string
  onSave: (processOrderDtl: PorDetail[]) => void
  dataSet: PorDetail[]
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { processType, recycType, productType, decimalVal } =
    useContainer(CommonTypeContainer)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  const [warehouseOption, setWarehouseOption] = useState<il_item[]>([])
  const [processTypeList, setProcessTypeList] = useState<il_item[]>([])
  const [processTypeId, setProcessTypeId] = useState<string>('')
  const itemCategory = () => {
    const colList: il_item[] = [
      {
        name: t('processOrder.create.recycling'),
        id: 'recycling'
      },
      {
        name: t('processOrder.create.product'),
        id: 'product'
      }
    ]
    return colList
  }
  const initDetail: PorDetail[] = [
    {
      id: 0,
      processTypeId: processTypeId,
      itemCategory: '',
      estInWeight: '0',
      estOutWeight: 0,
      plannedStartAt: plannedStartAt,
      processOrderDetailProduct: {
        productTypeId: '',
        productSubTypeId: '',
        productAddonId: '',
        productSubtypeRemark: '',
        productAddonRemark: ''
      },
      processOrderDetailRecyc: {
        recycTypeId: '',
        recycSubTypeId: ''
      },
      processOrderDetailWarehouse: []
    },
    {
      id: 0,
      processTypeId: processTypeId,
      itemCategory: '',
      estInWeight: '0',
      estOutWeight: 0,
      plannedStartAt: plannedStartAt,
      processOrderDetailProduct: {
        productTypeId: '',
        productSubTypeId: '',
        productAddonId: '',
        productSubtypeRemark: '',
        productAddonRemark: ''
      },
      processOrderDetailRecyc: {
        recycTypeId: '',
        recycSubTypeId: ''
      },
      processOrderDetailWarehouse: []
    }
  ]
  const [processOrderDetail, setProcessOrderDetail] =
    useState<PorDetail[]>(initDetail)

  const initWarehouse = async () => {
    try {
      const result = await getAllWarehouse(0, 1000)
      if (result) {
        let warehouse: il_item[] = []
        const data = result.data.content

        data.forEach((item: any) => {
          var warehouseName =
            i18n.language === 'zhhk'
              ? item.warehouseNameTchi
              : i18n.language === 'zhch'
              ? item.warehouseNameSchi
              : item.warehouseNameTchi
          warehouse.push({
            id: item.warehouseId.toString(),
            name: warehouseName
          })
        })
        warehouse.push({
          id: '',
          name: t('check_in.any')
        })
        setWarehouseOption(warehouse)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initProcessType = async () => {
    let processList: il_item[] = []

    if (processType) {
      processType?.forEach((item: any) => {
        var name =
          i18n.language === 'zhhk'
            ? item.processTypeNameTchi
            : i18n.language === 'zhch'
            ? item.processTypeNameSchi
            : item.processTypeNameEng

        processList.push({
          id: item.processTypeId.toString(),
          name: name
        })
      })
      setProcessTypeList(processList)
    }
  }

  useEffect(() => {
    initWarehouse()
    initProcessType()
  }, [])

  useEffect(() => {
    setProcessTypeId('')
    setProcessOrderDetail(initDetail)
  }, [handleDrawerClose])

  const handleInputChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setProcessOrderDetail((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleProductChange = (
    index: number,
    field: string,
    value: singleProduct
  ) => {
    setProcessOrderDetail((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              processOrderDetailProduct: {
                ...item.processOrderDetailProduct
              },
              [field]: value
            }
          : item
      )
    )
  }

  const handleRecycChange = (
    index: number,
    field: string,
    value: singleRecyclable
  ) => {
    setProcessOrderDetail((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              processOrderDetailRecyc: {
                ...item.processOrderDetailRecyc
              },
              [field]: value
            }
          : item
      )
    )
  }

  const handleSaveItem = () => {
    const idx = dataSet.length
    processOrderDetail.map((item, index) => {
      item.id = index + idx
      item.processTypeId = processTypeId
      item.plannedStartAt = plannedStartAt
    })
    onSave(processOrderDetail)
    handleDrawerClose()
  }

  return (
    <>
      <Box>
        <ToastContainer></ToastContainer>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'edit'}
          headerProps={{
            title: t('top_menu.add_new'),
            subTitle: t('processOrder.porCategory'),
            submitText: t('add_warehouse_page.save'),
            cancelText: t('common.cancel'),
            onCloseHeader: handleDrawerClose,
            onSubmit: handleSaveItem,
            onDelete: handleDrawerClose
          }}
        >
          <Divider></Divider>
          <Box sx={{ PaddingX: 2 }}>
            <Grid
              container
              direction={'column'}
              spacing={4}
              sx={{
                width: { xs: '100%' },
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                },
                paddingRight: 2
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <CustomField label={t('processOrder.porCategory')}>
                  <CustomItemList
                    items={processTypeList}
                    singleSelect={(selectedItem) => {
                      setProcessTypeId(selectedItem)
                    }}
                    defaultSelected={processTypeId}
                    needPrimaryColor={true}
                  />
                </CustomField>
              </Grid>
              {/* item card */}
              {processOrderDetail.map((item: PorDetail, idx) => (
                <Grid item key={idx}>
                  <div className="p-4 bg-[#D1D1D1] rounded-t-lg max-w-max text-white font-bold">
                    {t('processOrder.create.itemToProcess')}
                  </div>
                  <Box
                    sx={{
                      border: '1px solid #D1D1D1',
                      padding: 2,
                      borderTopRightRadius: '16px',
                      borderBottomLeftRadius: '16px',
                      WebkitBorderBottomRightRadius: '16px'
                    }}
                  >
                    <Grid item sx={{ marginBottom: 2 }}>
                      <CustomField
                        label={t('processOrder.create.itemCategory')}
                      >
                        <CustomItemList
                          items={itemCategory()}
                          singleSelect={(selectedItem) => {
                            handleInputChange(idx, 'itemCategory', selectedItem)
                          }}
                          defaultSelected={item.itemCategory}
                          needPrimaryColor={true}
                        />
                      </CustomField>
                    </Grid>
                    {item.itemCategory === 'recycling' ? (
                      <Grid item>
                        <CustomField label={t('col.recycType')}>
                          <RecyclablesListSingleSelect
                            recycL={recycType ?? []}
                            setState={(values) => {
                              handleRecycChange(
                                idx,
                                'processOrderDetailRecyc',
                                values
                              )
                            }}
                            //defaultRecycL={item.processOrderDetailRecyc}
                          />
                        </CustomField>
                      </Grid>
                    ) : item.itemCategory === 'product' ? (
                      <CustomField
                        label={t('pick_up_order.product_type.product')}
                        mandatory
                      >
                        <ProductListSingleSelect
                          label={t('pick_up_order.product_type.product')}
                          options={productType ?? []}
                          setState={(values) => {
                            handleProductChange(
                              idx,
                              'processOrderDetailProduct',
                              values
                            )
                          }}
                          itemColor={{
                            bgColor: customListTheme
                              ? customListTheme.bgColor
                              : '#E4F6DC',
                            borderColor: customListTheme
                              ? customListTheme.border
                              : '79CA25'
                          }}
                          //defaultProduct={item.processOrderDetailProduct}
                        />
                      </CustomField>
                    ) : (
                      <div></div>
                    )}
                    {/* warehouse */}
                    <Grid item sx={{ marginBottom: 2, marginTop: 2 }}>
                      <CustomField label={t('processOrder.create.warehouse')}>
                        <CustomItemList
                          items={warehouseOption ?? []}
                          multiSelect={(selectedItems: string[]) =>
                            handleInputChange(
                              idx,
                              'processOrderDetailWarehouse',
                              selectedItems
                            )
                          }
                          defaultSelected={processTypeId}
                          needPrimaryColor={false}
                        />
                      </CustomField>
                    </Grid>
                    {/* weight */}
                    <Grid item sx={{ marginBottom: 2 }}>
                      <CustomField label={t('pick_up_order.recyclForm.weight')}>
                        <CustomTextField
                          id="weight"
                          placeholder={t('userAccount.pleaseEnterNumber')}
                          onChange={(event) => {
                            onChangeWeight(
                              event.target.value,
                              decimalVal,
                              (value: string) => {
                                handleInputChange(idx, 'estInWeight', value)
                              }
                            )
                          }}
                          onBlur={(event) => {
                            const value = formatWeight(
                              event.target.value,
                              decimalVal
                            )
                            handleInputChange(idx, 'estInWeight', value)
                          }}
                          value={item.estInWeight}
                          sx={{ width: '100%' }}
                          endAdornment={
                            <InputAdornment position="end">kg</InputAdornment>
                          }
                        ></CustomTextField>
                      </CustomField>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </RightOverlayForm>
      </Box>
    </>
  )
}

export default InputProcessForm
