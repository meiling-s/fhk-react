import { FunctionComponent, useCallback, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import RightOverlayForm from '../../../components/RightOverlayForm'
import TextField from '@mui/material/TextField'
import { Grid, FormHelperText, Autocomplete, Modal, Box, Stack, Divider, Typography, Button, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switches from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from '../../../themes/icons'
import { useTranslation } from 'react-i18next'
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
  getRecycleType,
} from '../../../APICalls/warehouseManage'
import { set } from 'date-fns'
import { getLocation } from '../../../APICalls/getLocation'
import { get } from 'http'
import { getCommonTypes, getUserGroup, addTheUserAccount } from '../../../APICalls/commonManage'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import CustomField from "../../../components/FormComponents/CustomField";
import ColPointTypeList from '../../../components/SpecializeComponents/CollectionPointTypeList'
import {
    colPointType,
    premiseType,
    recycType,
    siteType,
    colPtRoutine,
    formValidate
  } from '../../../interfaces/common'
import CustomItemList, { il_item } from "../../../../src/components/FormComponents/CustomItemList";
import axiosInstance from '../../../constants/axiosInstance'
import { returnApiToken } from '../../../utils/utils'

interface AddUserAccount {
    loginId: string
    realm: string
    tenantId: string
    staffId: string
    groupId: number
    status: string
    createdBy: string
    updatedBy: string
    firstName: string
    lastName: string
    sex: string
    email: string
    role: [
        string
    ],
    phoneNumber: string
    actions: [
        string
    ]
}

interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action?: 'add' | 'edit' | 'delete'
  onSubmitData?: (type: string, id?: number, error?: boolean) => void
  theLoginId: string
  rowId: number
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
  // warehouseNameTchi: string
  // warehouseNameSchi: string
  // warehouseNameEng: string
  staffId: string
  loginId: string
}

interface DropdownOption {
  groupId: number;
  roleName: string;
}

interface UserAccount {
  loginId: string
  tenantId: string
  realm: string
  password: string
  staffId: string
  userGroup: 
  {
    groupId: number
    tenantId: string
    roleName: string
    status: string
    createdBy: string
    updatedBy: string
    updatedAt: string
    createdAt:string
    version: number
  }
  status: string,
  lastLoginDatetime: string
  createdBy: string
  updatedBy: string
  updatedAt: string
  createdAt: string
}

const AddUserAccount: FunctionComponent<AddWarehouseProps> = ({
  drawerOpen,
  handleDrawerClose,
  action = 'add',
  onSubmitData,
  rowId,
  theLoginId
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
  const [errorMsgList, setErrorMsgList] = useState<string[]>([])
  const [openDelete , setOpenDelete] = useState<boolean>(false)

  const [recycleType, setRecycleType] = useState<recyleTypeOption[]>([])
  const [recycleSubType, setSubRecycleType] = useState<recyleSubtypeOption>({})
  const [contractList, setContractList] = useState<
    { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
  >([])
  const [userGroup, setUserGroup] = useState({ roleName: '', groupId: null });
  const [pysicalLocation, setPysicalLocation] = useState<boolean>(false) // pysical location field
  const [status, setStatus] = useState(true) // status field
  const isInitialRender = useRef(true); // Add this line
  const [colType, setCOLType] = useState<string>('')
  const [typeList, setTypeList] = useState<{
    colPoint: colPointType[]
    premise: premiseType[]
    site: siteType[]
    recyc: recycType[]
  }>({ colPoint: [], premise: [], site: [], recyc: [] })

  const [staffId, setStaffId] = useState<string>('')
  const [loginId, setLoginId] = useState<string>('')
  const [chosenUserGroup, setChosenUserGroup] = useState<number>(4)
  const [chosenState, setChosenState] = useState<string>('')
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [userAccountItems, setUserAccountItems] = useState<UserAccount[]>([])

  const token = returnApiToken()

  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
  }, [i18n, currentLanguage])

  useEffect(() => {
    initType()
    fecthDataUserGroup()
    fetchDataUserAccount()
  }, [])

  const initType = async () => {
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
  }

  async function fecthDataUserGroup() {
    try {
      const response = await axiosInstance.get('http://10.166.22.250/api/v1/administrator/userGroup/t/861341');
      const data = response.data;
      setOptions(data);
    } catch (error) {
      console.error("fetchDataUserGroup ERROR", error);
    }
  }

  async function fetchDataUserAccount() {
    try {
      const response = await axiosInstance.get('http://10.166.22.250/api/v1/administrator/userAccount/windatest1');
      // const userAccountData = response.data
      const userAccountData = response.data.map( (item: UserAccount) => ({
        ...item,
      }));
      console.log("!!! >> ", theLoginId);
      setUserAccountItems(userAccountData)
    } catch (error) {
      console.error("fetchDataUserAccount ERROR", error);
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
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    console.log('reset form')
    setNamesField({
      // warehouseNameTchi: '',
      // warehouseNameSchi: '',
      // warehouseNameEng: ''
      staffId: '',
      loginId: ''
    })
    setContractNum([...initContractNum])
    setPlace('')
    setPysicalLocation(true)
    setStatus(true)
    setRecycleCategory([...initRecyleCategory])
  }

//   const getWarehousebyId = async () => {
//     try {
//       const response = await getWarehouseById(rowId)
//       if (response) {
//         //mapping data
//         const warehouse = response.data
//         setNamesField({
//           warehouseNameTchi: warehouse.warehouseNameTchi,
//           warehouseNameSchi: warehouse.warehouseNameSchi,
//           warehouseNameEng: warehouse.warehouseNameEng
//         })
//         setContractNum([...warehouse.contractNo])
//         setPlace(warehouse.location)
//         setPysicalLocation(warehouse.physicalFlg)
//         setStatus(warehouse.status === 'ACTIVE')
//         setRecycleCategory([...warehouse.warehouseRecyc])
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }


  useEffect(() => {
    console.log('action', action)
   
      if (action === 'add') {
        resetForm()
        setTrySubmited(false)
      } else if (action === 'edit' || action === 'delete') {
        // getWarehousebyId()
      }
 
    console.log('physicalFlg', pysicalLocation)
    getRecyleCategory()
  }, [action, handleDrawerClose])

  const name_fields = [
    {
      field: 'staffId',
      label: '以編號新增',
      placeholder: '請輸入編號'
    },
    {
      field: 'loginId',
      label: '登入名稱',
      placeholder: '請輸入名稱'
    },
  ]
  const [nameValue, setNamesField] = useState<nameFields>({
    // name fields
    // warehouseNameTchi: '',
    // warehouseNameSchi: '',
    // warehouseNameEng: ''
    staffId: '',
    loginId: ''
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
        console.log('Fecthing google map api error: ', err)
      })
  }, [place])

  const isRecycleTypeIdUnique = recycleCategory.every((item, index, arr) => {
    const filteredArr = arr.filter((i) => 
      (i.recycTypeId === item.recycTypeId))
    return filteredArr.length === 1
  })

  const isRecycleSubUnique = recycleCategory.every((item, index, arr) => {
    const filteredArr = arr.filter((i) => 
      (i.recycSubTypeId === item.recycSubTypeId))
    return filteredArr.length === 1
  })

  // validation input text
  useEffect(() => {
    const tempV: { field: string; error: string }[] = []

    // Object.keys(nameValue).forEach((fieldName) => {
    //   nameValue[fieldName as keyof nameFields].trim() === '' &&
    //     tempV.push({
    //       field: fieldName,
    //       error: `${t(`add_warehouse_page.${fieldName}`)} ${t('add_warehouse_page.shouldNotEmpty')}`
    //     })
    // })

    // place.trim() === '' &&
    //   tempV.push({
    //     field: 'place',
    //     error: `${t(`add_warehouse_page.place`)} ${t('add_warehouse_page.shouldNotEmpty')}`
    //   })

    // contractNum.some((value) => value.trim() === '') &&
    //   tempV.push({
    //     field: 'contractNum',
    //     error: `${t(`add_warehouse_page.contractNum`)} is required`
    //   })

    const isRecyleHaveUniqId = isRecycleTypeIdUnique
    const isRecyleUnselected = recycleCategory.every((item, index, arr) => {
      return (
        item.recycTypeId.trim() !== '' &&
        item.recycSubTypeId.trim() !== '' &&
        item.recycSubTypeCapacity === 0
      )
    })

    //console.log('isRecycleTypeIdUnique', isRecycleTypeIdUnique)

    isRecyleUnselected &&
      tempV.push({
        field: 'warehouseRecyc',
        error: `${t(`add_warehouse_page.warehouseRecyc`)} ${t('add_warehouse_page.shouldNotEmpty')}`
      })

    !isRecyleHaveUniqId && !isRecycleSubUnique &&
      tempV.push({
        field: 'warehouseRecyc',
        error: `${t(`add_warehouse_page.warehouseRecyc`)} can't duplicated`
      })

    setValidation(tempV)
    //console.log(tempV)
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
  const handleChangeStaffId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaffId(event.target.value);
  };

  const handleChangeLoginId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(event.target.value);
  };

  const handleChangeUserGroup = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

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

  // const handleChange = (event: SelectChangeEvent) => {
  //   setChosenUserGroup(event.target.value);
  // };

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
    if(Number(event.target.value) >= 0) {
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
        console.log('added', response)
      }
    } catch (error) {
      console.error('Cannot add the user account', error)
    }
  }

  const addTheUserAccountData = async (addTheUserAccountForm: any) => {
    try {
      const response = await addTheUserAccount(addTheUserAccountForm)
      if (response) {
        console.log('added', response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const editWarehouseData = async (addWarehouseForm: any) => {
    try {
      const response = await editWarehouse(addWarehouseForm, rowId)
      if (response) {
        console.log('edited', response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  //submit data
  const handleSubmit = async () => {
    
    let statusWarehouse = status ? 'ACTIVE' : 'INACTIVE'
    if (action == 'delete') {
      statusWarehouse = 'DELETED'
    } 
    

    const addWarehouseForm = {
      // warehouseNameTchi: nameValue.warehouseNameTchi,
      // warehouseNameSchi: nameValue.warehouseNameSchi,
      // warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: locationGps,
      physicalFlg: pysicalLocation,
      contractNo: contractNum,
      status: statusWarehouse,
      createdBy: 'string',
      updatedBy: 'string',
      warehouseRecyc: recycleCategory
    }
    console.log("addWarehouseForm", addWarehouseForm)

    let theStatusState = ''
    if (chosenState === '1') {
      theStatusState = 'ACTIVE'
    } else if (chosenState === '2') {
      theStatusState = 'INACTIVE'
    } else {
      theStatusState = 'INACTIVE'
    }

    const addTheUserAccountForm = {
      loginId: loginId,
      realm: "admin",
      tenantId: token.tenantId,
      staffId: staffId,
      groupId: selectedOption,
      status: theStatusState,
      createdBy: "admin",
      updatedBy: "admin",
      firstName: "wistkey",
      lastName: "dev",
      sex: "Male",
      email: "wistkeydev@mail.com",
      role: [
        "ADMIN"
      ],
      phoneNumber: "1234123",
      actions: [
        "UPDATE_PASSWORD"
      ]
    }
    console.log("addTheUserAccountForm", addTheUserAccountForm)

    const isError = validation.length == 0
    getFormErrorMsg()

    if (validation.length == 0) {
      action === 'add'
        ? //MOVE API CAL TO PARENT DATA, ONLY PARSING DATA HERE
          // createWareHouseData(addWarehouseForm)
          addTheUserAccountData(addTheUserAccount)
        : editWarehouseData(addWarehouseForm)

      if (
        onSubmitData &&
        typeof onSubmitData === 'function' &&
        typeof rowId === 'number'
      ) {
        onSubmitData(action, rowId, !isError)
      }
      console.log(addWarehouseForm)
      setValidation([])
    } else {
      console.log(validation)
      setTrySubmited(true)
    }
  }

  const getFormErrorMsg = () => { 
      const errorList: string[] = []
      validation.map(item =>{
        errorList.push(`${item.error}`)
      })
      setErrorMsgList(errorList)
 
    return ''
  }

  const handleDelete  = () => {
    setOpenDelete(true)
  }

  const onDeleteModal = () => {
    // handleSubmit()
    // handleConfirmDelete()
    setOpenDelete(false)
  }

  type DeleteModalProps = {
    open: boolean
    onClose: () => void
    onDelete: () => void
  }

  const DeleteModal: React.FC<DeleteModalProps> = ({
    open,
    onClose,
    onDelete
  }) => {
    const { t } = useTranslation()  


    console.log("THE DATA >> ", userAccountItems)


    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Stack spacing={2}>
            <Box>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: 'bold' }}
              >
                {t('check_out.confirm_approve')}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ alignSelf: 'center' }}>
              <button
                className="primary-btn mr-2 cursor-pointer"
                onClick={() => {
                  onDelete()
                }}
              >
                {t('check_in.confirm')}
              </button>
              <button
                className="secondary-btn mr-2 cursor-pointer"
                onClick={() => {
                  onClose()
                }}
              >
                {t('check_out.cancel')}
              </button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    )
  }

  const activityItems = () => {
    const colList: il_item[] = [
      {
        name: "已啓用",
        id: "1"
      },
      {
        name: "已關閉",
        id: "2"
      },
      {
        name: "已停用",
        id: "3"
      },
    ]
    return colList
  };

  return (
    <div className="add-warehouse">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title: t('top_menu.add_new'),
          subTitle: '用戶',
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete
        }}
      >
        {/* form warehouse */}
        <div
          style={{ borderTop: '1px solid lightgrey' }}
          className="form-container"
        >
          <div className="self-stretch flex flex-col items-start justify-start pt-[25px] px-[25px] pb-[75px] gap-[25px] text-left text-smi text-grey-middle">
            {/* {name_fields.map((item, index) => (
              // staffid & loginId
              <div
                key={index + 'name'}
                className="self-stretch flex flex-col items-start justify-center gap-2"
              >
                <LabelField label={item.label} mandatory={index === 0 ? false : true} />
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
            ))} */}

            <LabelField label='以編號新增' mandatory={false} />
            <TextField 
              id="outlined-basic"
              label="請輸入編號"
              variant="outlined"
              value={staffId}
              onChange={handleChangeStaffId}
            />

            <LabelField label='登入名稱' mandatory={true} />
            <TextField 
              id="outlined-basic"
              label="請輸入名稱"
              variant="outlined"
              value={loginId}
              onChange={handleChangeLoginId}
            />

            {/* usergroup
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
              <LabelField label='用戶群組' mandatory={true} />
              <div className="self-stretch flex flex-col items-start justify-start">
                <div className="self-stretch ">
                  {contractNum.map((contact, index) => (
                    <div
                      className="flex flex-row items-center justify-start gap-[8px] mb-2"
                      key={contact + index}
                    >
                      <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-label">請選擇群組</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          // value={age}
                          label="用戶群組"
                          // onChange={handleChange}
                        >
                          <MenuItem value={'4'}>{userGroup.roleName}</MenuItem>
                        </Select>
                      </FormControl>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            <LabelField label='用戶群組' mandatory={true} />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">請選擇群組</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                label="Option"
                onChange={handleChangeUserGroup}
              >
                {options.map((option) => (
                  <MenuItem key={option.groupId} value={option.groupId}>
                    {option.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <Switcher  Physical location/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField
                label='是否批核者'
                mandatory={true}
              />
              <Switches
                onText='是'
                offText='否'
                disabled={action === 'delete'}
                defaultValue={pysicalLocation}
                setState={(newValue) => {
                  setPysicalLocation(newValue)
                }}
              />
            </div>

            <CustomField label='狀態' mandatory={true}>
              <CustomItemList
                items={activityItems()}
                singleSelect={(selectedItem) => {
                  console.log("THE SELECTED ITEM", selectedItem)
                  setChosenState(selectedItem)
                }}
                editable={true}
                defaultSelected={"1"}
              />
            </CustomField>
            
            
            {/* error msg */}
            {validation.length > 0 && trySubmited && (
            <Grid item className="pt-3 w-full">
              {errorMsgList?.map((item, index) => (
                <div className='bg-[#F7BCC6] text-red p-2 rounded-xl mb-2'>
                   <FormHelperText error={true}>{item}</FormHelperText>
                </div>         
              ) ) }         
            </Grid>
          )}
          <DeleteModal
            open={openDelete}
            onClose={() => {
              setOpenDelete(false)
            }}
            onDelete={onDeleteModal} />
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

export default AddUserAccount
