import {
  FunctionComponent,
  useState,
  useEffect,
  useRef
} from 'react'
import { useNavigate } from 'react-router-dom'
import RightOverlayForm from '../../../components/RightOverlayForm'
import {
  Grid,
  Box,
  Divider,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { extractError, returnApiToken, showErrorToast, showSuccessToast } from '../../../utils/utils'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { createRecyclingPoint, deleteRecyclingPoint, editRecyclingPoint } from '../../../APICalls/ASTD/recycling'
import { STATUS_CODE } from '../../../constants/constant'

interface siteTypeDataProps {
  createdAt: string
  createdBy: string
  description: string
  remark: string
  siteTypeId: string
  siteTypeNameEng: string
  siteTypeNameSchi: string
  siteTypeNameTchi: string
  status: string
  updatedAt: string
  updatedBy: string
  version: number
}

interface SiteTypeProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action?: 'add' | 'edit' | 'delete'
  rowId?: number,
  selectedItem: siteTypeDataProps | null,
  handleOnSubmitData: (type: string) => void
}

const CreateRecyclingPoint: FunctionComponent<SiteTypeProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  rowId,
  selectedItem,
  handleOnSubmitData
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
  const [errorMsgList, setErrorMsgList] = useState<string[]>([])
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [trySubmited, setTrySubmitted] = useState<boolean>(false)
  const [tChineseName, setTChineseName] = useState<string>('')
  const [sChineseName, setSChineseName] = useState<string>('')
  const [englishName, setEnglishName] = useState<string>('')
  const [equivalent, setEquivalent] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
  const [version, setVersion] = useState<number>(0)
  const isInitialRender = useRef(true) // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
  }, [i18n, currentLanguage])

  useEffect(() => {
    setTrySubmitted(false)
    if (action === 'edit' || action === 'delete') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setTChineseName(selectedItem.siteTypeNameTchi)
        setSChineseName(selectedItem.siteTypeNameSchi)
        setEnglishName(selectedItem.siteTypeNameEng)
        setDescription(selectedItem.description)
        setRemark(selectedItem.remark)
        setVersion(selectedItem.version)
      }
    } else if (action === 'add') {
      resetForm()
    }
  }, [selectedItem, action, drawerOpen])

  const resetForm = () => {
    setTChineseName('')
    setSChineseName('')
    setEnglishName('')
    setEquivalent('')
    setDescription('')
    setRemark('')
    setVersion(0)
  }

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

  const getFormErrorMsg = () => {
    const errorList: string[] = []
    validation.map((item) => {
      errorList.push(`${item.error}`)
    })
    setErrorMsgList(errorList)

    return ''
  }

  useEffect(() => {
    const tempV: { field: string; error: string }[] = []

    tChineseName.trim() === '' &&
      tempV.push({
        field: `${t('packaging_unit.traditional_chinese_name')}`,
        error: `${t(`common.traditionalChineseName`)} ${t(
          'add_warehouse_page.shouldNotEmpty'
        )}`
      })

    sChineseName.trim() === '' &&
      tempV.push({
        field: `${t('packaging_unit.simplified_chinese_name')}`,
        error: `${t(`common.simplifiedChineseName`)} ${t(
          'add_warehouse_page.shouldNotEmpty'
        )}`
      })

    englishName.trim() === '' &&
      tempV.push({
        field: `${t('packaging_unit.english_name')}`,
        error: `${t(`common.englishName`)} ${t(
          'add_warehouse_page.shouldNotEmpty'
        )}`
      })

    setValidation(tempV)
  }, [tChineseName, sChineseName, englishName, i18n, currentLanguage])

  const handleDelete = async () => {
    const { loginId } = returnApiToken();
    const recyclingPointForm = {
      status: 'DELETED',
      updatedBy: loginId,
      version: version
    }

    try {
      if (selectedItem !== null && selectedItem !== undefined) {
        const response = await deleteRecyclingPoint(selectedItem?.siteTypeId, recyclingPointForm)
        if (response) {
          handleOnSubmitData('siteType')
          showSuccessToast(t('notify.successDeleted'))
        }
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message);
      }
    }
  }

  const handleSubmit = () => {
    const { loginId } = returnApiToken();

    const recyclingPointForm = {
      siteTypeNameTchi: tChineseName,
      siteTypeNameSchi: sChineseName,
      siteTypeNameEng: englishName,
      description: description,
      remark: remark,
      status: 'ACTIVE',
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === 'edit' && { version: version })
    }

    const isError = validation.length == 0
    getFormErrorMsg()

    if (validation.length == 0) {
      action == 'add' ? createRecyclingPointData(recyclingPointForm) : editRecyclingPointData(recyclingPointForm)

      setValidation([])
    } else {
      setTrySubmitted(true)
    }
  }

  const createRecyclingPointData = async (data: any) => {
    try {
      const response = await createRecyclingPoint(data)
      if (response) {
        handleOnSubmitData('siteType')
        showSuccessToast(t('notify.successCreated'))
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message
        if (errorMessage.includes('siteTypeNameDuplicate')) {
          showErrorToast(handleDuplicateErrorMessage(errorMessage))
        } else {
          showErrorToast(error.response.data.message);
        }
      } else {
        console.error(error)
        showErrorToast(t('errorCreated.errorCreated'))
      }
    }
  }
  const editRecyclingPointData = async (data: any) => {
    try {
      if (selectedItem !== null && selectedItem !== undefined) {
        const response = await editRecyclingPoint(selectedItem?.siteTypeId, data)
        if (response) {
          handleOnSubmitData('siteType')
          showSuccessToast(t('notify.SuccessEdited'))
        }
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message
        if (errorMessage.includes('siteTypeNameDuplicate')) {
          showErrorToast(handleDuplicateErrorMessage(errorMessage))
        } else {
          showErrorToast(error.response.data.message);
        }
      }

    }
  }

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      '[tchi]': 'Traditional Chinese Name',
      '[eng]': 'English Name',
      '[schi]': 'Simplified Chinese Name'
    };

    let result = input.replace(/\[siteTypeNameDuplicate\]/, '');

    const matches = result.match(/\[(tchi|eng|schi)\]/g);

    if (matches) {
      const replaced = matches.map(match => replacements[match as keyof typeof replacements]);

      let formatted: string;
      if (replaced.length === 1) {
        formatted = replaced[0];
      } else if (replaced.length === 2) {
        formatted = replaced.join(' and ');
      } else if (replaced.length === 3) {
        formatted = `${replaced[0]}, ${replaced[1]} and ${replaced[2]}`;
      }

      result = result.replace(/\[(tchi|eng|schi)\]+/, formatted!);

      result = result.replace(/\[(tchi|eng|schi)\]/g, '');
    }

    return result.trim();
  };

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'delete'
                ? t('common.delete')
                : '',
          subTitle: t('recycling_point.engineering_land'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t('common.deleteMessage')
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.traditional_chinese_name')} mandatory>
              <CustomTextField
                id="tChineseName"
                value={tChineseName}
                disabled={action === 'delete'}
                placeholder={t('packaging_unit.traditional_chinese_name_placeholder')}
                onChange={(event) => setTChineseName(event.target.value)}
                error={trySubmited && checkString(tChineseName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.simplified_chinese_name')} mandatory>
              <CustomTextField
                id="sChineseName"
                value={sChineseName}
                disabled={action === 'delete'}
                placeholder={t('packaging_unit.simplified_chinese_name_placeholder')}
                onChange={(event) => setSChineseName(event.target.value)}
                error={trySubmited && checkString(sChineseName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.english_name')} mandatory>
              <CustomTextField
                id="englishName"
                value={englishName}
                disabled={action === 'delete'}
                placeholder={t('packaging_unit.english_name_placeholder')}
                onChange={(event) => setEnglishName(event.target.value)}
                error={trySubmited && checkString(englishName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.introduction')}>
              <CustomTextField
                id="description"
                placeholder={t('packaging_unit.introduction_placeholder')}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
                disabled={action === 'delete'}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.remark')}>
              <CustomTextField
                id="remark"
                placeholder={t('packaging_unit.remark_placeholder')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
                disabled={action === 'delete'}
              />
            </CustomField>
          </Box>
          <Grid item sx={{ width: '92%' }}>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={val.error}
                  type={'error'}
                />
              ))}
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default CreateRecyclingPoint
