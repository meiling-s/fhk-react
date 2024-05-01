import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box} from '@mui/material'
import { DataGrid, GridColDef, GridRowParams, GridRowSpacingParams, GridRenderCellParams,} from '@mui/x-data-grid'
import {  EDIT_OUTLINED_ICON} from '../../../themes/icons'
import { useTranslation } from 'react-i18next'
import { NotifTemplate } from '../../../interfaces/notif'
import { getListNotifTemplatePO, getListNotifTemplateStaff } from '../../../APICalls/notify'
import { useNavigate } from 'react-router-dom'
import { Roles, localStorgeKeyName } from '../../../constants/constant'
import { returnApiToken } from '../../../utils/utils'

function createNotifTemplate(
  templateId: string,
  notiType: string,
  variables:  string[],
  lang: string,
  title: string,
  senders: string[],
  receivers: string[],
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
): NotifTemplate {
  return {
    templateId,
    notiType,
    variables,
    lang,
    title,
    senders,
    receivers,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  }
}

interface CurrentMenuProps {
  selectedTab: number,
}

const CurrentMenu: FunctionComponent<CurrentMenuProps> = ({
  selectedTab,
}) => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const [notifTemplate, setNotifTemplateList] = useState<NotifTemplate[]>([])
  const [filteredTemplate, setFillteredTemplate] = useState<NotifTemplate[]>([])
  const [selectedRow, setSelectedRow] = useState<NotifTemplate | null>(null)
  const [action, setAction] = useState<'edit'>('edit')
  const navigate = useNavigate();
  const { realmApiRoute,  } = returnApiToken()
  const realm = localStorage.getItem(localStorgeKeyName.realm);
  
  useEffect(() => {
    if(selectedTab === 0) {
      setFillteredTemplate([])
      initRecyclablesList()
    } else if(selectedTab === 1) {
      setFillteredTemplate([])
      initStaffList()
    }
  }, [selectedTab])

  const initStaffList = async () => {
    const result = await getListNotifTemplateStaff();
    if (result) {
      const data = result.data
    
      let notifMappingTemplate: NotifTemplate[] = []
      data.map((item: any) => {
        notifMappingTemplate.push(
          createNotifTemplate(
            item?.templateId,
            item?.notiType,
            item?.variables,
            item?.lang,
            item?.title,
            item?.senders,
            item?.receivers,
            item?.createdBy,
            item?.updatedBy,
            item?.createdAt,
            item?.updatedAt,
          )
        )
      })
      setNotifTemplateList(notifMappingTemplate)
      setFillteredTemplate(notifMappingTemplate)
    }
  }

  const initRecyclablesList = async () => {
    const result = await getListNotifTemplatePO()
    if (result) {
      const data = result.data
      var notifMappingTemplate: NotifTemplate[] = []
      data.map((item: any) => {
        notifMappingTemplate.push(
          createNotifTemplate(
            item?.templateId,
            item?.notiType,
            item?.variables,
            item?.lang,
            item?.title,
            item?.senders,
            item?.receivers,
            item?.createdBy,
            item?.updatedBy,
            item?.createdAt,
            item?.updatedAt,
          )
        )
      })
      setNotifTemplateList(notifMappingTemplate)
      setFillteredTemplate(notifMappingTemplate)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'templateId',
      headerName: t('notification.menu_staff.name'),
      width: 225,
      type: 'string'
    },
    {
      field: 'notiType',
      headerName: t('notification.menu_staff.type'),
      width: 100,
      type: 'string'
    },
    {
      field: 'title',
      headerName: t('notification.menu_staff.title'),
      width: 250,
      type: 'string'
    },
    {
      field: 'lang',
      headerName: t('notification.menu_staff.language'),
      width: 300,
      type: 'string'
    },
    {
      field: 'edit',
      headerName: '',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                const selected = notifTemplate.find(
                  (item) => item.templateId == params.row.templateId
                )
                event.stopPropagation()
                handleAction(params, 'edit')
                if (selected) setSelectedRow(selected)
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]
  
  const handleAction = (
    params: GridRenderCellParams,
    action: 'edit'
  ) => {
    navigate(`/${realm}/notice/${params.row.notiType}/${params.row.templateId}`)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
      <Box
        sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', pr: 4}}
      >
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, maxWidth: '1460px' }}>
            <DataGrid
              rows={filteredTemplate}
              getRowId={(row) => row.templateId}
              hideFooter
              columns={columns}
              checkboxSelection
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
                },
                '& .MuiDataGrid-row': {
                  bgcolor: 'white',
                  borderRadius: '10px'
                },
                '&>.MuiDataGrid-main': {
                  '&>.MuiDataGrid-columnHeaders': {
                    borderBottom: 'none'
                  }
                }
              }}
            />
          </Box>
        </div>
      </Box>
  )
}

export default CurrentMenu
