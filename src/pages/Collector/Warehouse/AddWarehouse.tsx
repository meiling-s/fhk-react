import {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import { useNavigate } from 'react-router-dom'
import RightOverlayForm from '../../../components/RightOverlayForm'
import TextField from '@mui/material/TextField'
import {
  Grid,
  FormHelperText,
  Autocomplete,
  Modal,
  Box,
  Stack,
  Divider,
  Typography
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from '../../../themes/icons'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import {
  extractError,
  showErrorToast,
  showSuccessToast
} from '../../../utils/utils'
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
  getRecycleType
} from '../../../APICalls/warehouseManage'
import { set } from 'date-fns'
import { getLocation } from '../../../APICalls/getLocation'
import { get } from 'http'
import { getCommonTypes } from '../../../APICalls/commonManage'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { STATUS_CODE } from '../../../constants/constant'

interface RecyleItem {
  recycTypeId: string
  recycSubTypeId: string
  recycSubTypeCapacity: number
  recycTypeCapacity: number
}

interface Warehouse {
  id: number
  warehouseId: number
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  physicalFlg: string | boolean
  contractNo: string[]
  status: string
  warehouseRecyc: RecyleItem[]
}

interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action?: 'add' | 'edit' | 'delete'
  onSubmitData?: (type: string, id?: number, error?: boolean) => void
  rowId: number
  warehouseList: Warehouse[]
}

interface recyleItem {
  recycTypeId: string
  recycSubTypeId: string
  recycSubTypeCapacity: number
  recycTypeCapacity: number
}

interface recyleSubtyeData {
  recycSubTypeId: string
  recyclableNameEng: string
  recyclableNameSchi: string
  recyclableNameTchi: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

interface recyleTypeData {
  createdAt: string
  createdBy: string
  description: string
  recycSubType: recyleSubtyeData[]
  recycTypeId: string
  recyclableNameEng: string
  recyclableNameSchi: string
  recyclableNameTchi: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

interface recyleTypeOption {
  id: string
  recyclableNameEng: string
  recyclableNameSchi: string
  recyclableNameTchi: string
}

interface recyleSubtypeOption {
  [key: string]: recyleSubtyeData[]
}

interface WarehouseFormData {
  id: number
  warehouseId: number
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  physicalFlg: string | boolean
  contractNo: string[]
  status: string
  warehouseRecyc: recyleItem[]
}

interface nameFields {
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
}

const AddWarehouse: FunctionComponent<AddWarehouseProps> = ({
  drawerOpen,
  handleDrawerClose,
  action = 'add',
  onSubmitData,
  rowId,
  warehouseList = []
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
  const [errorMsgList, setErrorMsgList] = useState<string[]>([])
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const [recycleType, setRecycleType] = useState<recyleTypeOption[]>([])
  const [recycleSubType, setSubRecycleType] = useState<recyleSubtypeOption>({})
  const [contractList, setContractList] = useState<
    { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
  >([])
  const [pysicalLocation, setPysicalLocation] = useState<boolean>(false) // pysical location field
  const [status, setStatus] = useState(true) // status field
  const duplicateRecycleTypeIds = new Set<string>()
  const [zeroCapacityItems, setZeroCapacityItems] = useState<
    recyleTypeOption[]
  >([])
  const isInitialRender = useRef(true) // Add this line
  const [existingWarehouse, setExisitingWarehouse] = useState<Warehouse[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
  }, [i18n, currentLanguage])

  useEffect(() => {
    initType()
  }, [])

  const initType = async () => {
    try {
      const result = await getCommonTypes()
      if (result?.contract) {
        var conList: {
          contractNo: string
          isEpd: boolean
          frmDate: string
          toDate: string
        }[] = []
        result.contract.map((con) => {
          conList.push({
            contractNo: con.contractNo,
            isEpd: con.epdFlg,
            frmDate: con.contractFrmDate,
            toDate: con.contractToDate
          })
        })
        setContractList(conList)
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const getRecyleCategory = async () => {
    try {
      const response = await getRecycleType()
      if (response) {
        const dataReycleType: recyleTypeOption[] = response.data.map(
          (item: recyleTypeData) => ({
            id: item.recycTypeId,
            recyclableNameEng: item.recyclableNameEng,
            recyclableNameSchi: item.recyclableNameSchi,
            recyclableNameTchi: item.recyclableNameTchi
          })
        )

        const subTypeMapping: recyleSubtypeOption = {}
        response.data.forEach((item: recyleTypeData) => {
          if (!subTypeMapping[item.recycTypeId]) {
            subTypeMapping[item.recycTypeId as keyof recyleTypeData] =
              item.recycSubType
          } else {
            subTypeMapping[item.recycTypeId] = [
              ...subTypeMapping[item.recycTypeId],
              ...item.recycSubType
            ]
          }
        })

        setRecycleType(dataReycleType)
        setSubRecycleType(subTypeMapping)
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }
  const resetForm = () => {
    // console.log('reset form')
    setNamesField({
      warehouseNameTchi: '',
      warehouseNameSchi: '',
      warehouseNameEng: ''
    })
    setContractNum([...initContractNum])
    setPlace('')
    setPysicalLocation(true)
    setStatus(true)
    setRecycleCategory([...initRecyleCategory])
  }

  const getWarehousebyId = async () => {
    try {
      const response = await getWarehouseById(rowId)
      if (response) {
        //mapping data
        const warehouse = response.data
        setNamesField({
          warehouseNameTchi: warehouse.warehouseNameTchi,
          warehouseNameSchi: warehouse.warehouseNameSchi,
          warehouseNameEng: warehouse.warehouseNameEng
        })
        setContractNum([...warehouse.contractNo])
        setPlace(warehouse.location)
        setPysicalLocation(warehouse.physicalFlg)
        setStatus(warehouse.status === 'ACTIVE')
        setRecycleCategory([...warehouse.warehouseRecyc])

        setExisitingWarehouse(
          warehouseList.filter((item) => item.id != warehouse.warehouseId)
        )
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    // console.log('action', action)
    if (action === 'add') {
      resetForm()
      setTrySubmited(false)
      setExisitingWarehouse(warehouseList)
    } else if (action === 'edit' || action === 'delete') {
      getWarehousebyId()
    }

    getRecyleCategory()
  }, [action])

  const name_fields = [
    {
      field: 'warehouseNameTchi',
      label: t('warehouse_page.trad_name'),
      placeholder: t('add_warehouse_page.type_name')
    },
    {
      field: 'warehouseNameSchi',
      label: t('warehouse_page.simp_name'),
      placeholder: t('add_warehouse_page.type_name')
    },
    {
      field: 'warehouseNameEng',
      label: t('warehouse_page.english_name'),
      placeholder: 'Please type a name'
    }
  ]
  const [nameValue, setNamesField] = useState<nameFields>({
    // name fields
    warehouseNameTchi: '',
    warehouseNameSchi: '',
    warehouseNameEng: ''
  })
  const initContractNum: string[] = [''] // contract field
  const [contractNum, setContractNum] = useState<string[]>(initContractNum)
  const [place, setPlace] = useState('') // place field

  const initRecyleCategory: recyleItem[] = [
    // recyle category field
    {
      recycTypeId: '',
      recycSubTypeId: '',
      recycSubTypeCapacity: 0,
      recycTypeCapacity: 0
    }
  ]
  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  const [recycleCategory, setRecycleCategory] =
    useState<recyleItem[]>(initRecyleCategory)

  const [locationGps, setLocationGps] = useState<number[]>([])

  //get location from google map api
  useEffect(() => {
    getLocation(place)
      .then((res) => {
        if (res.data.results) {
          const latitude = res.data.results[0].geometry.location.lat
          const longitude = res.data.results[0].geometry.location.lng

          const newLocation = [latitude, longitude]
          setLocationGps(newLocation)
        }
      })
      .catch((err) => {
        // console.log('Fecthing google map api error: ', err)
      })
  }, [place])

  const isRecycleTypeIdUnique = recycleCategory.every((item, index, arr) => {
    const filteredArr = arr.filter((i) => i.recycTypeId === item.recycTypeId)

    if (filteredArr.length > 1) {
      duplicateRecycleTypeIds.add(item.recycTypeId)
    }

    return filteredArr.length === 1
  })

  const isRecycleSubUnique = recycleCategory.every((item, index, arr) => {
    const filteredArr = arr.filter(
      (i) => i.recycSubTypeId === item.recycSubTypeId
    )
    return filteredArr.length === 1
  })

  // validation input text
  useEffect(() => {
    const tempV: { field: string; error: string }[] = []

    Object.keys(nameValue).forEach((fieldName) => {
      nameValue[fieldName as keyof nameFields].trim() === '' &&
        tempV.push({
          field: fieldName,
          error: `${t(`add_warehouse_page.${fieldName}`)} ${t(
            'add_warehouse_page.shouldNotEmpty'
          )}`
        })
    })

    existingWarehouse.forEach((item) => {
      if (
        item.warehouseNameTchi.toLowerCase() ===
        nameValue.warehouseNameTchi.toLowerCase()
      ) {
        tempV.push({
          field: nameValue.warehouseNameTchi,
          error: `${t('common.traditionalChineseName')} ${t(
            'form.error.alreadyExist'
          )}`
        })
      }
      if (
        item.warehouseNameSchi.toLowerCase() ===
        nameValue.warehouseNameSchi.toLowerCase()
      ) {
        tempV.push({
          field: nameValue.warehouseNameSchi,
          error: `${t('common.simplifiedChineseName')} ${t(
            'form.error.alreadyExist'
          )}`
        })
      }
      if (
        item.warehouseNameEng.toLowerCase() ===
        nameValue.warehouseNameEng.toLowerCase()
      ) {
        tempV.push({
          field: nameValue.warehouseNameEng,
          error: `${t('common.englishName')} ${t('form.error.alreadyExist')}`
        })
      }
      if (item.location.toLowerCase() === place.toLowerCase()) {
        tempV.push({
          field: 'place',
          error: `${t('add_warehouse_page.place')} ${t(
            'form.error.alreadyExist'
          )}`
        })
      }
    })

    place.trim() === '' &&
      tempV.push({
        field: 'place',
        error: `${t(`add_warehouse_page.place`)} ${t(
          'add_warehouse_page.shouldNotEmpty'
        )}`
      })

    // const isRecyleHaveUniqId = isRecycleTypeIdUnique
    const isRecyleUnselected = recycleCategory.every((item, index, arr) => {
      return item.recycTypeId.trim() != '' && item.recycSubTypeId.trim() != ''
    })

    !isRecyleUnselected &&
      tempV.push({
        field: 'warehouseRecyc',
        error: `${t(`add_warehouse_page.warehouseRecyc`)} ${t(
          'add_warehouse_page.shouldNotEmpty'
        )}`
      })

    //check value not zero
    if (isRecyleUnselected) {
      recycleCategory.forEach((item) => {
        if (item.recycSubTypeCapacity === 0) {
          const recybles = recycleType.find(
            (type: recyleTypeOption) => type.id === item.recycTypeId
          )

          const subtype = recycleSubType[item.recycTypeId].find(
            (sub: any) => sub.recycSubTypeId === item.recycSubTypeId
          )

          const recycTypeName =
            currentLanguage === 'zhhk'
              ? recybles?.recyclableNameTchi
              : currentLanguage === 'zhch'
              ? recybles?.recyclableNameSchi
              : recybles?.recyclableNameEng || '-'

          const recycSubTypeName =
            currentLanguage === 'zhhk'
              ? subtype?.recyclableNameTchi
              : currentLanguage === 'zhch'
              ? subtype?.recyclableNameSchi
              : subtype?.recyclableNameEng || '-'

          tempV.push({
            field: 'warehouseRecyc',
            error: `${recycTypeName} - ${recycSubTypeName}, ${t(
              'form.error.shouldGreaterThanZero'
            )}`
          })
        }
      })
    }

    //check duplicated recytype
    if (!isRecycleTypeIdUnique || !isRecycleSubUnique) {
      duplicateRecycleTypeIds.forEach((recycTypeId) => {
        recycleCategory.forEach((item) => {
          if (item.recycTypeId === recycTypeId) {
            const recybles = recycleType.find(
              (type: recyleTypeOption) => type.id === item.recycTypeId
            )
            const subtype = recycleSubType[item.recycTypeId].find(
              (sub: any) => sub.recycSubTypeId === item.recycSubTypeId
            )

            const recycTypeName =
              currentLanguage === 'zhhk'
                ? recybles?.recyclableNameTchi
                : currentLanguage === 'zhch'
                ? recybles?.recyclableNameSchi
                : recybles?.recyclableNameEng || '-'

            const recycSubTypeName =
              currentLanguage === 'zhhk'
                ? subtype?.recyclableNameTchi
                : currentLanguage === 'zhch'
                ? subtype?.recyclableNameSchi
                : subtype?.recyclableNameEng || '-'

            tempV.push({
              field: 'warehouseRecyc',
              error: `${recycTypeName} - ${recycSubTypeName} ${t(
                'add_warehouse_page.shouldNotDuplicate'
              )}`
            })
          }
        })
      })
    }

    console.group('tempV')

    setValidation(tempV)
  }, [nameValue, place, contractNum, recycleCategory])

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const checkNumber = (s: number) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == 0
  }

  //handle methods
  const handleNameFields = (fieldName: string, value: string) => {
    setNamesField({ ...nameValue, [fieldName]: value })
  }

  const handlePlaceChange = (fieldName: string, value: string) => {
    setPlace(value)
  }

  const handleRemoveContact = (indexToRemove: number) => {
    const updatedContractNum = contractNum.filter(
      (_, index) => index !== indexToRemove
    )
    setContractNum(updatedContractNum)
  }

  const handleAddContact = () => {
    const updatedContractNum = [...contractNum, '']
    setContractNum(updatedContractNum)
  }

  const handleContractChange = (value: string, index: number) => {
    const updatedContacts = [...contractNum]
    updatedContacts[index] = value
    setContractNum(updatedContacts)
  }

  const handleAddRecycleCategory = () => {
    const updatedRecycleCategory = [
      ...recycleCategory,
      {
        recycTypeId: '',
        recycSubTypeId: '',
        recycSubTypeCapacity: 0,
        recycTypeCapacity: 0
      }
    ]
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleRemoveReycleCategory = (indexToRemove: number) => {
    const updatedRecycleCategory = recycleCategory.filter(
      (_, index) => index !== indexToRemove
    )
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeRecycleType = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].recycTypeId = event.target.value
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeSubtype = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].recycSubTypeId = event.target.value as string
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeWeight = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (Number(event.target.value) >= 0) {
      const updatedRecycleCategory = [...recycleCategory]
      updatedRecycleCategory[index].recycSubTypeCapacity = Number(
        event.target.value
      )
      setRecycleCategory(updatedRecycleCategory)
    }
  }

  const createWareHouseData = async (addWarehouseForm: any) => {
    try {
      const response = await createWarehouse(addWarehouseForm)
      if (response) {
        // console.log('added', response)
        showSuccessToast(t('common.saveSuccessfully'))
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        console.error(error)
        showErrorToast(t('common.saveFailed'))
      }
    }
  }

  const editWarehouseData = async (addWarehouseForm: any, type: string) => {
    try {
      const response = await editWarehouse(addWarehouseForm, rowId)
      if (response) {
        showSuccessToast(
          type == 'edit'
            ? t('common.editSuccessfully')
            : t('common.deletedSuccessfully')
        )
        handleDrawerClose()
      }
    } catch (error: any) {
      showErrorToast(
        type == 'edit' ? t('common.editFailed') : t('common.deleteFailed')
      )
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  //submit data
  const handleSubmit = async () => {
    let statusWarehouse = status ? 'ACTIVE' : 'INACTIVE'
    if (action == 'delete') {
      statusWarehouse = 'DELETED'
    }

    const filteredContractNum = contractNum.filter((num) => num !== '')

    // console.log('action', action)

    const addWarehouseForm = {
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: locationGps,
      physicalFlg: pysicalLocation,
      contractNo: filteredContractNum,
      status: statusWarehouse,
      createdBy: 'string',
      updatedBy: 'string',
      warehouseRecyc: recycleCategory
    }
    // console.log('addWarehouseForm', addWarehouseForm)
    // console.log('rowId', rowId)

    const isError = validation.length == 0
    getFormErrorMsg()

    console.log('addWarehouseForm', validation)

    if (validation.length == 0) {
      action === 'add'
        ? //MOVE API CAL TO PARENT DATA, ONLY PARSING DATA HERE
          createWareHouseData(addWarehouseForm)
        : editWarehouseData(addWarehouseForm, 'edit')

      if (
        onSubmitData &&
        typeof onSubmitData === 'function' &&
        typeof rowId === 'number'
      ) {
        onSubmitData(action, rowId, !isError)
      }
      // console.log(addWarehouseForm)
      setValidation([])
    } else {
      // console.log(validation)
      setTrySubmited(true)
    }
  }

  useEffect(() => {
    getFormErrorMsg()
  }, [validation])

  const getFormErrorMsg = () => {
    const errorList: string[] = []
    const seenErrors = new Set()

    validation.forEach((item) => {
      if (item.field === 'contractNo') {
        if (!seenErrors.has('contractNo')) {
          errorList.push(item.error)
          seenErrors.add('contractNo')
        }
      } else {
        errorList.push(item.error)
      }
    })

    setErrorMsgList(errorList)
  }

  const handleDelete = () => {
    setOpenDelete(true)
  }

  const handleClose = () => {
    setValidation([])
    setErrorMsgList([])
    setTrySubmited(false)
    handleDrawerClose()
  }

  const onDeleteModal = () => {
    //handleSubmit()
    //setOpenDelete(false)
    // console.log('rowId', rowId)
    const deleteform = {
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: locationGps,
      physicalFlg: pysicalLocation,
      contractNo: contractNum,
      status: 'DELETED',
      createdBy: 'string',
      updatedBy: 'string',
      warehouseRecyc: recycleCategory
    }

    editWarehouseData(deleteform, 'delete')
  }

  return (
    <div className="add-warehouse">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'delete'
              ? t('add_warehouse_page.delete')
              : t('userGroup.change'),
          subTitle: t('top_menu.workshop'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleClose,
          onSubmit: handleSubmit,
          onDelete: onDeleteModal
        }}
      >
        {/* form warehouse */}
        <div
          style={{ borderTop: '1px solid lightgrey' }}
          className="form-container"
        >
          <div className="self-stretch flex flex-col items-start justify-start pt-[25px] px-[25px] pb-[75px] gap-[25px] text-left text-smi text-grey-middle">
            {name_fields.map((item, index) => (
              <div
                key={index + 'name'}
                className="self-stretch flex flex-col items-start justify-center gap-2"
              >
                <LabelField label={item.label} mandatory={true} />
                <FormControl fullWidth variant="standard">
                  <TextField
                    value={nameValue[item.field as keyof nameFields]}
                    onChange={(e) =>
                      handleNameFields(item.field, e.target.value)
                    }
                    fullWidth
                    placeholder={item.placeholder}
                    id={`fullWidth-${index}`}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textField
                    }}
                    sx={styles.inputState}
                    disabled={action === 'delete'}
                    error={checkString(
                      nameValue[item.field as keyof nameFields]
                    )}
                  />
                </FormControl>
              </div>
            ))}
            {/* <Switcher  Physical location/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t('warehouse_page.location')} />
              <Switcher
                onText={t('add_warehouse_page.yes')}
                offText={t('add_warehouse_page.no')}
                disabled={action === 'delete'}
                defaultValue={pysicalLocation}
                setState={(newValue) => {
                  setPysicalLocation(newValue)
                }}
              />
            </div>
            {/* contact number */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
              <LabelField label={t('col.contractNo')} />
              <div className="self-stretch flex flex-col items-start justify-start">
                <div className="self-stretch ">
                  {contractNum.map((contact, index) => (
                    <div
                      className="flex flex-row items-center justify-start gap-[8px] mb-2"
                      key={contact + index}
                    >
                      <FormControl fullWidth variant="standard">
                        <Autocomplete
                          disablePortal
                          fullWidth
                          disabled={action === 'delete'}
                          options={contractList
                            .filter(
                              (contract) =>
                                !contractNum.includes(contract.contractNo)
                            )
                            .map((contract) => contract.contractNo)}
                          value={contractNum[index]}
                          onChange={(_, value) => {
                            handleContractChange(value || '', index)
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder={t('col.enterNo')}
                              InputLabelProps={{
                                shrink: false
                              }}
                              InputProps={{
                                ...params.InputProps,
                                sx: styles.textField
                              }}
                              sx={styles.inputState}
                              disabled={action === 'delete'}
                            />
                          )}
                          noOptionsText={t('common.noOptions')}
                        />
                      </FormControl>
                      {index === contractNum.length - 1 ? (
                        <ADD_CIRCLE_ICON
                          fontSize="small"
                          className={`${
                            action === 'delete'
                              ? 'text-gray'
                              : 'text-green-primary'
                          } " cursor-pointer"`}
                          onClick={
                            action !== 'delete' ? handleAddContact : undefined
                          }
                        />
                      ) : (
                        index !== contractNum.length - 1 && (
                          <REMOVE_CIRCLE_ICON
                            fontSize="small"
                            className={`text-grey-light ${
                              contractNum.length === 1
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer'
                            } `}
                            onClick={() =>
                              action !== 'delete'
                                ? handleRemoveContact(index)
                                : undefined
                            }
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Adress field */}
            <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
              <LabelField label={t('warehouse_page.place')} mandatory={true} />
              <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-center text-mini text-grey-darker">
                <FormControl fullWidth variant="standard">
                  <TextField
                    value={place}
                    onChange={(e) => handlePlaceChange('place', e.target.value)}
                    fullWidth
                    multiline
                    placeholder={t('add_warehouse_page.place_placeholders')}
                    rows={4}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textArea
                    }}
                    sx={styles.inputState}
                    disabled={action === 'delete'}
                    error={checkString(place)}
                  />
                </FormControl>
              </div>
            </div>
            {/* <Switcher status/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t('warehouse_page.status')} />
              <Switcher
                onText={t('add_warehouse_page.open')}
                offText={t('add_warehouse_page.close')}
                disabled={action === 'delete'}
                defaultValue={status}
                setState={(newValue) => {
                  setStatus(newValue)
                }}
              />
            </div>
            {/* Recyle category */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
              <LabelField
                label={t('warehouse_page.recyclable_subcategories')}
                mandatory={true}
              />
              <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                  <div className="w-full ">
                    {recycleCategory.map((item, index) => (
                      <div
                        className="flex justify-center items-center gap-2 mb-2"
                        key={index + 'recyle'}
                      >
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <Select
                            value={item.recycTypeId}
                            onChange={(event: SelectChangeEvent<string>) =>
                              handleChangeRecycleType(event, index)
                            }
                            displayEmpty
                            disabled={action === 'delete'}
                            inputProps={{
                              'aria-label': 'Without label'
                            }}
                            sx={{
                              borderRadius: '12px' // Adjust the value as needed
                            }}
                            error={
                              checkString(item.recycTypeId) ||
                              !isRecycleTypeIdUnique
                            }
                          >
                            <MenuItem value="">
                              <em>-</em>
                            </MenuItem>
                            {recycleType.length > 0 ? (
                              recycleType.map((item, index) => (
                                <MenuItem value={item.id} key={index}>
                                  {currentLanguage === 'zhhk'
                                    ? item.recyclableNameTchi
                                    : currentLanguage === 'zhch'
                                    ? item.recyclableNameSchi
                                    : item.recyclableNameEng}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled value="">
                                <em>{t('common.noOptions')}</em>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <Select
                            value={item.recycSubTypeId}
                            onChange={(event: SelectChangeEvent<string>) =>
                              handleChangeSubtype(event, index)
                            }
                            displayEmpty
                            disabled={action === 'delete'}
                            inputProps={{
                              'aria-label': 'Without label'
                            }}
                            sx={{
                              borderRadius: '12px'
                            }}
                            error={
                              checkString(item.recycSubTypeId) ||
                              !isRecycleSubUnique
                            }
                          >
                            <MenuItem value="">
                              <em>-</em>
                            </MenuItem>
                            {recycleSubType[item.recycTypeId]?.length > 0 ? (
                              recycleSubType[item.recycTypeId]?.map(
                                (item, index) => (
                                  <MenuItem
                                    value={item.recycSubTypeId}
                                    key={index}
                                  >
                                    {currentLanguage === 'zhhk'
                                      ? item.recyclableNameTchi
                                      : currentLanguage === 'zhch'
                                      ? item.recyclableNameSchi
                                      : item.recyclableNameEng}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <MenuItem disabled value="">
                                <em>{t('common.noOptions')}</em>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="standard">
                          <OutlinedInput
                            value={item.recycSubTypeCapacity}
                            type="number"
                            onChange={(
                              event: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) =>
                              handleChangeWeight(
                                event as React.ChangeEvent<HTMLInputElement>,
                                index
                              )
                            }
                            fullWidth
                            id="outlined-adornment-weight"
                            placeholder={t('add_warehouse_page.weight')}
                            endAdornment={
                              <InputAdornment position="end">kg</InputAdornment>
                            }
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              'aria-label': 'weight',
                              sx: styles.textField
                            }}
                            sx={styles.textField}
                            disabled={action === 'delete'}
                            error={checkNumber(item.recycSubTypeCapacity)}
                          />
                        </FormControl>
                        {index === recycleCategory.length - 1 ? (
                          <ADD_CIRCLE_ICON
                            fontSize="small"
                            className={`${
                              action === 'delete'
                                ? 'text-gray'
                                : 'text-green-primary'
                            } " cursor-pointer"`}
                            onClick={
                              action !== 'delete'
                                ? handleAddRecycleCategory
                                : undefined
                            }
                          />
                        ) : (
                          index !== recycleCategory.length - 1 && (
                            <REMOVE_CIRCLE_ICON
                              fontSize="small"
                              className={`text-grey-light ${
                                contractNum.length === 1
                                  ? 'cursor-not-allowed'
                                  : 'cursor-pointer'
                              } `}
                              onClick={() =>
                                action !== 'delete'
                                  ? handleRemoveReycleCategory(index)
                                  : undefined
                              }
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* error msg */}
            {validation.length > 0 && trySubmited && (
              <Grid item className="pt-3 w-full">
                {errorMsgList?.map((item, index) => (
                  <div className="bg-[#F7BCC6] text-red p-2 rounded-xl mb-2">
                    <FormHelperText error={true}>{item}</FormHelperText>
                  </div>
                ))}
              </Grid>
            )}
            {/* <DeleteModal
              open={openDelete}
              onClose={() => {
                setOpenDelete(false)
              }}
              onDelete={onDeleteModal}
            /> */}
          </div>
        </div>
      </RightOverlayForm>
    </div>
  )
}

let styles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '15px 20px',
      margin: 0
    }
  },
  textArea: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: 0,
      margin: 0
    }
  },
  inputState: {
    '& .MuiOutlinedInput-root': {
      margin: 0,
      '&:not(.Mui-disabled):hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      }
    }
  },
  dropDown: {
    '& .MuiOutlinedInput-root-MuiSelect-root': {
      borderRadius: '10px'
    }
  },
  modal: {
    position: 'absolute',
    top: '50%',
    width: '34%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5,

    '@media (max-width: 768px)': {
      width: '70%' /* Adjust the width for mobile devices */
    }
  }
}

export default AddWarehouse
