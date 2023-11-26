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
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from '../themes/icons'
import { useTranslation } from 'react-i18next'
import { createWarehouse } from "../APICalls/warehouseManage";

interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action?: 'add' | 'edit' | 'delete'
  onSubmitData?: (
    formData: WarehouseFormData,
    type: string,
    id?: 'string'
  ) => void
  rowId?: string
}

interface WarehouseFormData {
  id: string
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  physicalFlag: boolean
  contractNo: string[]
  status: string
  warehouseRecyc: { recyle_type: string; subtype: string; weight: string }[]
}

interface WarehouseNewForm {
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  locationGps: number[]
  physicalFlg: boolean
  contractNo: string[]
  status: string
  createdBy: string
  updatedBy: string
  warehouseRecyc: {recycTypeId: string; recycSubtypeId: string; recycSubtypeCapacity: string }
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

  //mapping data
  useEffect(() => {
    if (action === 'add') {
      resetForm()
    } else if (action === 'edit' || action === 'delete') {
      // Assuming you have some sample data for edit action
      const editData: WarehouseFormData = {
        id: '1',
        warehouseNameTchi: 'Sample Warehouse Tchi',
        warehouseNameSchi: 'Sample Warehouse Schi',
        warehouseNameEng: 'Sample Warehouse Eng',
        location: 'Sample Location',
        physicalFlag: true,
        contractNo: ['123456', '789012'],
        status: 'active',
        warehouseRecyc: [
          {
            recyle_type: '請輸入重量',
            subtype: '紙皮 2',
            weight: '10'
          },
          {
            recyle_type: '請輸入重量',
            subtype: '紙皮 2',
            weight: '20'
          }
        ]
      }

      setNamesField({
        warehouseNameTchi: editData.warehouseNameTchi,
        warehouseNameSchi: editData.warehouseNameSchi,
        warehouseNameEng: editData.warehouseNameEng
      })
      setContractNum([...editData.contractNo])
      setPlace(editData.location)
      setPysicalLocation(editData.physicalFlag)
      setStatus(editData.status === 'active')

      setRecycleCategory([...editData.warehouseRecyc])
    }
  }, [action])

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

  // name field
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
    warehouseNameTchi: '',
    warehouseNameSchi: '',
    warehouseNameEng: ''
  })

  const handleChange = (fieldName: string, value: string) => {
    setNamesField({ ...nameValue, [fieldName]: value })
    console.log('nameValue', nameValue)
  }

  // contract field
  const initContractNum: string[] = ['', '']
  const [contractNum, setContractNum] = useState<string[]>(initContractNum)

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
  const recycleType = ['請輸入重量', '紙皮', '請輸入重量']
  const subType = ['請輸入重量 1', '紙皮 2', '請輸入重量 3']

  const initRecyleCategory: {
    recyle_type: string
    subtype: string
    weight: string
  }[] = [
    {
      recyle_type: '',
      subtype: '',
      weight: ''
    },
    {
      recyle_type: '',
      subtype: '',
      weight: ''
    }
  ]

  const [recycleCategory, setRecycleCategory] =
    useState<{ recyle_type: string; subtype: string; weight: string }[]>(
      initRecyleCategory
    )

  const handleAddReycleCategory = () => {
    const updatedrecycleCategory = [
      ...recycleCategory,
      { recyle_type: '', subtype: '', weight: '' }
    ]
    setRecycleCategory(updatedrecycleCategory)
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
    updatedRecycleCategory[index].recyle_type = event.target.value
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeSubtype = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].subtype = event.target.value as string
    setRecycleCategory(updatedRecycleCategory)
  }

  const handleChangeWeight = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedRecycleCategory = [...recycleCategory]
    updatedRecycleCategory[index].weight = event.target.value
    setRecycleCategory(updatedRecycleCategory)
  }

  //submit data
  const handleSubmit = () => {
    // real form data
    const warehouseForm = {
      id: '',
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      physicalFlag: pysicalLocation,
      contractNo: contractNum,
      status: status === true ? 'active' : 'deleted',
      warehouseRecyc: recycleCategory
    }
    console.log('submited data ', warehouseForm)

    // const formData = {
    //   id: '5',
    //   traditionalName: 'New Warehouse',
    //   simplifiedName: 'New Simplified Warehouse',
    //   englishName: 'New English Warehouse',
    //   location: 'Yes',
    //   place: 'New Warehouse Location',
    //   status: 'activated',
    //   recyclableSubcategories: 'New Recyclable Categories'
    // }
    if (
      onSubmitData &&
      typeof onSubmitData === 'function' &&
      typeof rowId === 'string'
    ) {
      onSubmitData(warehouseForm, action, rowId as 'string')
    }

    // api call
    const newWarehouseForm = {
      "warehouseNameTchi": "string",
      "warehouseNameSchi": "string",
      "warehouseNameEng": "string",
      "location": "string",
      "locationGps": [
        0
      ],
      "physicalFlg": true,
      "contractNo": [
        "string"
      ],
      "status": "ACTIVE",
      "createdBy": "string",
      "updatedBy": "string",
      "warehouseRecyc": [
        {
          "recycTypeId": "string",
          "recycSubtypeId": "string",
          "recycSubtypeCapacity": 0,
          "recycTypeCapacity": 0
        }
      ]
    }

    const fetchData = async () => {
      try {
          const response = await createWarehouse(newWarehouseForm);
          if (response) {
              //setWarehouses(response.data.content); // Extract the 'data' property
              console.log(response);
          }
      } catch (error) {
          console.error(error);
      }
  };

    fetchData()
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
                key={index}
                className="self-stretch flex flex-col items-start justify-center gap-2"
              >
                <div className="relative tracking-1px leading-20px text-left">
                  {item.label}
                </div>
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
              <div className="relative tracking-[1px] leading-[20px] text-left">
                {t('warehouse_page.location')}
              </div>
              <Switcher
                onText={t('add_warehouse_page.yes')}
                offText={t('add_warehouse_page.no')}
                defaultValue={pysicalLocation}
                setState={(newValue) => {
                  setPysicalLocation(newValue) // Update the state in your parent component
                }}
              />
            </div>
            {/* contact number */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
              <div className="relative text-smi tracking-[1px] leading-[20px] text-grey-middle text-left">
                {t('col.contractNo')}
              </div>
              <div className="self-stretch flex flex-col items-start justify-start">
                <div className="self-stretch ">
                  {contractNum.map((contact, index) => (
                    <div className="flex flex-row items-center justify-start gap-[8px] mb-2">
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
              <div className="relative tracking-[1px] leading-[20px]">
                {t('warehouse_page.place')}
              </div>
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
              <div className="relative tracking-[1px] leading-[20px] text-left">
                {t('warehouse_page.status')}
              </div>
              <Switcher
                onText={t('add_warehouse_page.yes')}
                offText={t('add_warehouse_page.no')}
                defaultValue={status}
                setState={(newValue) => {
                  setStatus(newValue) // Update the state in your parent component
                }}
              />
            </div>
            {/* Recyle category */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
              <div className="relative tracking-[1px] leading-[20px]">
                {t('warehouse_page.recyclable_subcategories')}
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                  <div className="w-full ">
                    {recycleCategory.map((item, index) => (
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <Select
                            value={item.recyle_type}
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
                              <em>{t('add_warehouse_page.recycle_type')}</em>
                            </MenuItem>
                            {recycleType.map((item, index) => (
                              <MenuItem value={item} key={index}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <Select
                            value={item.subtype}
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
                              <em>{t('add_warehouse_page.subtype')}</em>
                            </MenuItem>
                            {subType.map((item, index) => (
                              <MenuItem value={item} key={index}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="standard">
                          <OutlinedInput
                            value={item.weight}
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
                            onClick={handleAddReycleCategory}
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
