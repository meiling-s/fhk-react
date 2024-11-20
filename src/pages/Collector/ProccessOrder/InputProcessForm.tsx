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
import {
  recyclable,
  singleRecyclable
} from '../../../interfaces/collectionPoint'
import {
  CreateProcessOrderDetailPairs,
  ProcessOrderDetailRecyc,
  ProcessOrderDetailWarehouse,
  QueryEstEndDatetime
} from '../../../interfaces/processOrderQuery'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import {
  extractError,
  formatWeight,
  getThemeCustomList,
  onChangeWeight,
  returnErrorMsg
} from '../../../utils/utils'
import {
  formErr,
  localStorgeKeyName,
  STATUS_CODE
} from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import ProductListSingleSelect, {
  singleProduct
} from '../../../components/SpecializeComponents/ProductListSingleSelect'
import RecyclablesList from 'src/components/SpecializeComponents/RecyclablesList'
import { getEstimateWeight } from 'src/APICalls/processOrder'
import dayjs from 'dayjs'
import { formValidate } from 'src/interfaces/common'
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg'

const InputProcessForm = ({
  drawerOpen,
  handleDrawerClose,
  plannedStartAtInput,
  formType = 'create',
  onSave,
  dataSet,
  editedValue
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
  plannedStartAtInput: string
  formType?: string
  onSave: (
    processOrderDtl: CreateProcessOrderDetailPairs[],
    isUpdate: boolean
  ) => void
  //dataSet: PorDetail[]
  dataSet: CreateProcessOrderDetailPairs[]
  editedValue: CreateProcessOrderDetailPairs[] | null
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    getProcessTypeList,
    processTypeListData,
    recycType,
    getProductType,
    productType,
    decimalVal
  } = useContainer(CommonTypeContainer)
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
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])

  const initDetail: CreateProcessOrderDetailPairs[] = [
    {
      processIn: {
        idPair: 0,
        processTypeId: '',
        itemCategory: 'recycling',
        processAction: 'PROCESS_IN',
        estInWeight: '0',
        plannedStartAt: plannedStartAtInput,
        processOrderDetailProduct: [],
        processOrderDetailRecyc: [],
        processOrderDetailWarehouse: []
      },
      processOut: {
        idPair: 0,
        processTypeId: '',
        itemCategory: 'product',
        processAction: 'PROCESS_OUT',
        estOutWeight: '0',
        plannedEndAt: '',
        processOrderDetailProduct: [],
        processOrderDetailRecyc: [],
        processOrderDetailWarehouse: []
      }
    }
  ]

  const [processOrderDetail, setProcessOrderDetail] =
    useState<CreateProcessOrderDetailPairs[]>(initDetail)

  const mappingData = () => {
    // console.log('edit', editedValue)
    if (editedValue) {
      setProcessTypeId(editedValue[0].processIn.processTypeId)
      setProcessOrderDetail(editedValue)
    }
  }

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
    if (processTypeListData) {
      processTypeListData?.forEach((item: any) => {
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
    getProcessTypeList()
    getProductType()
    initWarehouse()
    initProcessType()
    setValidation([])

    if (editedValue) {
      mappingData()
    }
  }, [drawerOpen])

  const resetForm = () => {
    setProcessTypeId('')
    setProcessOrderDetail(initDetail)
    setValidation([])
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []
      processTypeId === '' &&
        tempV.push({
          field: t('processOrder.porCategory'),
          problem: formErr.empty,
          type: 'error'
        })

      processOrderDetail[0].processIn.processOrderDetailWarehouse.length ===
        0 &&
        tempV.push({
          field:
            t('processOrder.create.warehouse') +
            t('processOrder.table.processIn'),
          problem: formErr.empty,
          type: 'error'
        })

      processOrderDetail[0].processOut.processOrderDetailWarehouse.length ===
        0 &&
        tempV.push({
          field:
            t('processOrder.create.warehouse') +
            t('processOrder.table.processOut'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [processTypeId])

  const onChangeItemCategory = (
    key: 'processIn' | 'processOut',
    selectedItem: string
  ) => {
    setProcessOrderDetail((prev) =>
      prev.map((item) => ({
        ...item,
        [key]: {
          ...item[key],
          itemCategory: selectedItem
        }
      }))
    )
  }

  //to do : change to multiple product select
  const handleProductChange = (type: string, value: singleProduct) => {
    let tempProduct: any[] = []
    if (value.productTypeId && value.productSubTypeId != '')
      tempProduct.push(value)

    setProcessOrderDetail((prevDetails) =>
      prevDetails.map((detail) => ({
        ...detail,
        [type]: {
          ...detail[type as keyof CreateProcessOrderDetailPairs],
          processOrderDetailProduct: tempProduct
        }
      }))
    )
  }

  const handleRecycChange = (type: string, value: recyclable[]) => {
    let tempRecy: any[] = []
    tempRecy = value.flatMap((item) =>
      item.recycSubTypeId.length > 0
        ? item.recycSubTypeId.map((subType) => ({
            recycTypeId: item.recycTypeId,
            recycSubTypeId: subType
          }))
        : [
            {
              recycTypeId: item.recycTypeId,
              recycSubTypeId: ''
            }
          ]
    )

    //update to data to recy key
    setProcessOrderDetail((prevDetails) =>
      prevDetails.map((detail) => ({
        ...detail,
        [type]: {
          ...detail[type as keyof CreateProcessOrderDetailPairs],
          processOrderDetailRecyc: tempRecy
        }
      }))
    )
  }

  const updateWarehouseIds = (newWarehouseIds: string[]) => {
    const parsedWarehouseIds = newWarehouseIds.map((id) => parseInt(id, 10))
    setProcessOrderDetail((prevDetails) =>
      prevDetails.map((detail) => ({
        ...detail,
        processIn: {
          ...detail.processIn,
          processOrderDetailWarehouse: parsedWarehouseIds.map((id) => ({
            warehouseId: id
          }))
        },
        processOut: {
          ...detail.processOut,
          processOrderDetailWarehouse: parsedWarehouseIds.map((id) => ({
            warehouseId: id
          }))
        }
      }))
    )
  }

  const handleWeightChange = (
    value: string,
    field: 'estInWeight' | 'estOutWeight',
    idx: number
  ) => {
    setProcessOrderDetail((prevState) => {
      const newState = [...prevState]

      if (field === 'estInWeight') {
        newState[idx].processIn.estInWeight = value
      } else if (field === 'estOutWeight') {
        newState[idx].processOut.estOutWeight = value
      }

      return newState
    })
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const valLength = (s: string[] | ProcessOrderDetailWarehouse[]) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s.length === 0
  }

  const getEstimateEndDate = async (plannedStartAt: string) => {
    const params: QueryEstEndDatetime = {
      processTypeId: processTypeId,
      estInWeight: Number(processOrderDetail[0].processIn.estInWeight),
      plannedStartAt: dayjs(plannedStartAt).format('YYYY-MM-DDTHH:mm:ss')
    }
    let plannedEndAt = ''
    const result = await getEstimateWeight(params)
    if (result) {
      plannedEndAt = result.data
    }

    return plannedEndAt
  }

  const handleSaveItem = async () => {
    if (validation.length !== 0) {
      setTrySubmited(true)
      return
    }

    /** note :
     * eg: PAIR A
     * plannedEndAtData = plannedStartAt(from input) + duration (from api)
     * next pair eg: PAIR B
     * plannedStartAt = plannedEndAtData B
     * plannedEndAtData = plannedEndAtData B + duration
     * and continues sequence
     * **/
    const plannedStartAtData =
      dataSet.length === 0
        ? plannedStartAtInput
        : dataSet[dataSet.length - 1].processOut.plannedEndAt
    const estEndTime = await getEstimateEndDate(plannedStartAtData)
    const plannedEndAtData = dayjs(estEndTime).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
    )

    let tempRandomId = Math.floor(Math.random() * 90000) + 10000
    let isUpdate = false
    if (processOrderDetail[0].processIn.idPair) {
      tempRandomId = processOrderDetail[0].processIn.idPair
      isUpdate = true
    }
    Object.entries(processOrderDetail[0]).map(([key, value]) => {
      value.processTypeId = processTypeId
      processOrderDetail[0].processIn.plannedStartAt = plannedStartAtData
      processOrderDetail[0].processOut.plannedEndAt = plannedEndAtData
      value.idPair = tempRandomId
    })

    console.log('lala', processOrderDetail)

    onSave(processOrderDetail, isUpdate)
    resetForm()
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
                    error={trySubmited && checkString(processTypeId)}
                  />
                </CustomField>
              </Grid>
              {/* item card */}
              {Object.entries(processOrderDetail[0]).map(([key, value]) => {
                const processKey = key as keyof CreateProcessOrderDetailPairs
                return (
                  <Grid item key={key}>
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
                      {/* item category */}
                      <Grid item sx={{ marginBottom: 2 }}>
                        <CustomField
                          label={t('processOrder.create.itemCategory')}
                        >
                          <CustomItemList
                            items={itemCategory()}
                            singleSelect={(selectedItem) => {
                              onChangeItemCategory(processKey, selectedItem)
                            }}
                            defaultSelected={value.itemCategory}
                            needPrimaryColor={true}
                          />
                        </CustomField>
                      </Grid>
                      {/* item category product / recyle */}
                      {value.itemCategory === 'recycling' ? (
                        <Grid item>
                          <CustomField label={t('col.recycType')}>
                            <RecyclablesList
                              recycL={recycType || []}
                              setState={(value) => {
                                const keyType =
                                  key === 'processIn'
                                    ? 'processIn'
                                    : 'processOut'
                                handleRecycChange(keyType, value)
                              }}
                            />
                          </CustomField>
                        </Grid>
                      ) : value.itemCategory === 'product' ? (
                        <CustomField
                          label={t('pick_up_order.product_type.product')}
                          mandatory
                        >
                          <ProductListSingleSelect
                            label={t('pick_up_order.product_type.product')}
                            options={productType ?? []}
                            setState={(values) => {
                              const keyType =
                                key === 'processIn' ? 'processIn' : 'processOut'
                              handleProductChange(keyType, values)
                            }}
                            itemColor={{
                              bgColor: customListTheme
                                ? customListTheme.bgColor
                                : '#E4F6DC',
                              borderColor: customListTheme
                                ? customListTheme.border
                                : '79CA25'
                            }}
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
                              updateWarehouseIds(selectedItems)
                            }
                            defaultSelected={
                              key === 'processIn'
                                ? processOrderDetail[0].processIn.processOrderDetailWarehouse
                                    .map((item) => item.warehouseId)
                                    .join(',')
                                : processOrderDetail[0].processOut.processOrderDetailWarehouse
                                    .map((item) => item.warehouseId)
                                    .join(',')
                            }
                            needPrimaryColor={false}
                            error={
                              trySubmited &&
                              valLength(
                                key === 'processIn'
                                  ? processOrderDetail[0].processIn
                                      .processOrderDetailWarehouse
                                  : processOrderDetail[0].processOut
                                      .processOrderDetailWarehouse
                              )
                            }
                          />
                        </CustomField>
                      </Grid>

                      {/* weight */}
                      <Grid item sx={{ marginBottom: 2 }}>
                        <CustomField
                          label={t('pick_up_order.recyclForm.weight')}
                        >
                          <CustomTextField
                            id="weight"
                            placeholder={t('userAccount.pleaseEnterNumber')}
                            onChange={(event) => {
                              onChangeWeight(
                                event.target.value,
                                decimalVal,
                                (value: string) => {
                                  const field =
                                    key === 'processIn'
                                      ? 'estInWeight'
                                      : 'estOutWeight'
                                  const idx = key === 'processIn' ? 0 : 1
                                  handleWeightChange(value, field, 0)
                                }
                              )
                            }}
                            onBlur={(event) => {
                              const value = formatWeight(
                                event.target.value,
                                decimalVal
                              )
                              const field =
                                key === 'processIn'
                                  ? 'estInWeight'
                                  : 'estOutWeight'
                              const idx = key === 'processIn' ? 0 : 1
                              handleWeightChange(value, field, 0)
                            }}
                            value={
                              key === 'processIn'
                                ? processOrderDetail[0].processIn.estInWeight
                                : processOrderDetail[0].processOut.estOutWeight
                            }
                            sx={{ width: '100%' }}
                            endAdornment={
                              <InputAdornment position="end">kg</InputAdornment>
                            }
                          ></CustomTextField>
                        </CustomField>
                      </Grid>
                    </Box>
                  </Grid>
                )
              })}
              <Grid item sx={{ width: '100%' }}>
                {trySubmited &&
                  validation.map((val, index) => (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem, t)}
                      type={val.type}
                      dataTestId={val.dataTestId}
                    />
                  ))}
              </Grid>
            </Grid>
          </Box>
        </RightOverlayForm>
      </Box>
    </>
  )
}

export default InputProcessForm
