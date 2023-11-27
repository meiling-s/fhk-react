import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RightOverlayForm from './RightOverlayForm'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switcher from './FormComponents/CustomSwitch'
import LabelField from './FormComponents/CustomField'
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from '../themes/icons'
import { useTranslation } from 'react-i18next'
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
  getRecycleType
} from '../APICalls/warehouseManage'
import { set } from 'date-fns'

interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action?: 'add' | 'edit' | 'delete'
  onSubmitData?: (
    formData: WarehouseFormData,
    type: string,
    id?: number
  ) => void
  rowId: number
}

interface recyleItem {
  recycTypeId: string
  recycSubtypeId: string
  recycSubtypeCapacity: number
  recycTypeCapacity: number
}

interface recyleSubtyeData {
  recycTypeId: string
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
  recycSubtype: recyleSubtyeData[]
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
  recycTypeId: string
  list: recyleSubtyeData[]
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
  rowId
}) => {
  const { t } = useTranslation()
  const [recycleType, setRecycleType] = useState<recyleTypeOption[]>([])
  const [recycleSubType, setSubRecycleType] = useState<recyleSubtypeOption[]>(
    []
  )
  const [selectedSubType, setSelectedSubType] = useState<recyleSubtypeOption>()

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

        const data: recyleSubtypeOption[] = response.data.map(
          (item: recyleTypeData) => ({
            recycTypeId: item.recycTypeId,
            list: item.recycSubtype
          })
        )
        setRecycleType(dataReycleType)
        setSubRecycleType(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    setNamesField({
      warehouseNameTchi: '',
      warehouseNameSchi: '',
      warehouseNameEng: ''
    })
    setContractNum([...initContractNum])
    setPlace('')
    setPysicalLocation(false)
    setStatus(false)
    setRecycleCategory([...initRecyleCategory])
  }

  const getWarehousebyId = async () => {
    try {
      const response = await getWarehouseById(rowId)
      if (response) {
        //mapping data
        console.log(response)
        const warehouse = response.data
        setNamesField({
          warehouseNameTchi: warehouse.warehouseNameTchi,
          warehouseNameSchi: warehouse.warehouseNameSchi,
          warehouseNameEng: warehouse.warehouseNameEng
        })
        setContractNum([...warehouse.contractNo])
        setPlace(warehouse.location)
        setPysicalLocation(warehouse.physicalFlg)
        setStatus(warehouse.status === 'active')
        setRecycleCategory([...warehouse.warehouseRecyc])
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRecyleCategory()

    if (action === 'add') {
      resetForm()
    } else if (action === 'edit' || action === 'delete') {
      getWarehousebyId()
    }
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
  // name fields
  const [nameValue, setNamesField] = useState<nameFields>({
    warehouseNameTchi: '',
    warehouseNameSchi: '',
    warehouseNameEng: ''
  })

  // contract field
  const initContractNum: string[] = ['']
  const [contractNum, setContractNum] = useState<string[]>(initContractNum)

  // place field
  const [place, setPlace] = useState('')
  const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(event.target.value)
  }

  // pysical location field
  const [pysicalLocation, setPysicalLocation] = useState(false)

  // status field
  const [status, setStatus] = useState(false)

  // recyle category field
  const initRecyleCategory: recyleItem[] = [
    {
      recycTypeId: '',
      recycSubtypeId: '',
      recycSubtypeCapacity: 0,
      recycTypeCapacity: 0
    }
  ]

  const [recycleCategory, setRecycleCategory] =
    useState<recyleItem[]>(initRecyleCategory)

  const handleChange = (fieldName: string, value: string) => {
    setNamesField({ ...nameValue, [fieldName]: value })
    console.log('nameValue', nameValue)
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

  const handleContactonChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedContacts = [...contractNum]
    updatedContacts[index] = event.target.value
    setContractNum(updatedContacts)
  }

  const handleAddRecycleCategory = () => {
    const updatedRecycleCategory = [
      ...recycleCategory,
      {
        recycTypeId: '',
        recycSubtypeId: '',
        recycSubtypeCapacity: 0,
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
    setSelectedSubType(
      recycleSubType.find((item) => {
        return item.recycTypeId == event.target.value
      })
    )
  }

  const handleChangeSubtype = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].recycSubtypeId = event.target.value as string
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeWeight = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].recycSubtypeCapacity = Number(
      event.target.value
    )
    setRecycleCategory(updatedRecycleCategory)
  }

  const createWareHouseData = async (addWarehouseForm: any) => {
    try {
      const response = await createWarehouse(addWarehouseForm)
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
  const handleSubmit = () => {
    // real form data
    const editWarehouseForm = {
      id: rowId,
      warehouseId: rowId,
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      physicalFlg: pysicalLocation,
      contractNo: contractNum,
      status: 'ACTIVE',
      createdBy: 'string',
      updatedBy: 'string',
      warehouseRecyc: recycleCategory
    }

    let statusWarehouse = status ? 'ACTIVE' : 'INACTIVE'
    if (action == 'delete') {
      statusWarehouse = 'DELETED'
    }

    const addWarehouseForm = {
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: [0],
      physicalFlg: pysicalLocation,
      contractNo: contractNum,
      status: statusWarehouse,
      createdBy: 'string',
      updatedBy: 'string',
      warehouseRecyc: recycleCategory
    }

    if (
      onSubmitData &&
      typeof onSubmitData === 'function' &&
      typeof rowId === 'number'
    ) {
      onSubmitData(editWarehouseForm, action, rowId)
    }

    // MOVE API CAL TO PARENT DATA, ONLY PARSING DATA HERE
    if (action === 'add') {
      createWareHouseData(addWarehouseForm)
    } else {
      editWarehouseData(addWarehouseForm)
    }

    handleDrawerClose()
  }

  return (
    <div className="add-warehouse">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title: t('top_menu.add_new'),
          subTitle: t('top_menu.workshop'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleSubmit
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
                    onChange={(e) => handleChange(item.field, e.target.value)}
                    fullWidth
                    placeholder={item.placeholder}
                    id={`fullWidth-${index}`}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textField
                    }}
                    sx={styles.inputState}
                    disabled={action === 'delete'}
                  />
                </FormControl>
              </div>
            ))}
            {/* <Switcher  Physical location/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField
                label={t('warehouse_page.location')}
                mandatory={true}
              />
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
              <LabelField label={t('col.contractNo')} mandatory={true} />
              <div className="self-stretch flex flex-col items-start justify-start">
                <div className="self-stretch ">
                  {contractNum.map((contact, index) => (
                    <div
                      className="flex flex-row items-center justify-start gap-[8px] mb-2"
                      key={contact + index}
                    >
                      <FormControl fullWidth variant="standard">
                        <TextField
                          value={contractNum[index]}
                          fullWidth
                          placeholder={t('col.enterNo')}
                          id="fullWidth"
                          InputLabelProps={{ shrink: false }}
                          InputProps={{
                            sx: styles.textField
                          }}
                          sx={styles.inputState}
                          disabled={action === 'delete'}
                          onChange={(
                            event: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            handleContactonChange(
                              event as React.ChangeEvent<HTMLInputElement>,
                              index
                            )
                          }}
                        />
                      </FormControl>
                      {index === contractNum.length - 1 ? (
                        <ADD_CIRCLE_ICON
                          fontSize="small"
                          className="text-green-primary cursor-pointer"
                          onClick={handleAddContact}
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
                            onClick={() => handleRemoveContact(index)}
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
                    onChange={handlePlaceChange}
                    fullWidth
                    multiline
                    placeholder={t('add_warehouse_page.place')}
                    rows={4}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textArea
                    }}
                    sx={styles.inputState}
                    disabled={action === 'delete'}
                  />
                </FormControl>
              </div>
            </div>
            {/* <Switcher status/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t('warehouse_page.status')} mandatory={true} />
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
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{
                              borderRadius: '12px' // Adjust the value as needed
                            }}
                          >
                            <MenuItem value="">
                              <em>-</em>
                            </MenuItem>
                            {recycleType.map((item, index) => (
                              <MenuItem value={item.id} key={index}>
                                {item.recyclableNameEng}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <Select
                            value={item.recycSubtypeId}
                            onChange={(event: SelectChangeEvent<string>) =>
                              handleChangeSubtype(event, index)
                            }
                            displayEmpty
                            disabled={action === 'delete'}
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{
                              borderRadius: '12px'
                            }}
                          >
                            <MenuItem value="">
                              <em>-</em>
                            </MenuItem>
                            {selectedSubType?.list?.map((item, index) => (
                              <MenuItem
                                value={selectedSubType.recycTypeId}
                                key={index}
                              >
                                {item.recyclableNameEng}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="standard">
                          <OutlinedInput
                            value={item.recycSubtypeCapacity}
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
                          />
                        </FormControl>
                        {index === recycleCategory.length - 1 ? (
                          <ADD_CIRCLE_ICON
                            fontSize="small"
                            className="text-green-primary cursor-pointer"
                            onClick={handleAddRecycleCategory}
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
                              onClick={() => handleRemoveReycleCategory(index)}
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
  }
}

export default AddWarehouse
