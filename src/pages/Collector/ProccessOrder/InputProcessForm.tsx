import { useState } from 'react'

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
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'

const InputProcessForm = ({
  drawerOpen,
  handleDrawerClose
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
}) => {
  const { t, i18n } = useTranslation()
  const { recycType } = useContainer(CommonTypeContainer)
  const [clasififcation, setClasification] = useState<string>('')
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()

  const clasificationList = () => {
    const colList: il_item[] = [
      {
        name: t('processOrder.create.classification'),
        id: 'classification'
      },
      {
        name: t('processOrder.create.sol'),
        id: 'sol'
      },
      {
        name: t('processOrder.create.package'),
        id: 'package'
      }
    ]
    return colList
  }

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

  const handleSubmit = () => {}

  const handleDelete = () => {}

  return (
    <>
      <Box>
        <ToastContainer></ToastContainer>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'add'}
          headerProps={{
            title: t('top_menu.add_new'),
            subTitle: t('processOrder.porCategory'),
            submitText: t('add_warehouse_page.save'),
            cancelText: t('add_warehouse_page.delete'),
            onCloseHeader: handleDrawerClose,
            onSubmit: handleSubmit,
            onDelete: handleDelete
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
                    items={clasificationList()}
                    singleSelect={(selectedItem) => {
                      setClasification(selectedItem)
                    }}
                    defaultSelected={clasififcation}
                    needPrimaryColor={false}
                  />
                </CustomField>
              </Grid>
              {/* item 1 */}
              <Grid item>
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
                    <CustomField label={t('processOrder.create.itemCategory')}>
                      <CustomItemList
                        items={itemCategory()}
                        singleSelect={(selectedItem) => {
                          //setClasification(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('processOrder.create.manuProduct')}>
                      <CustomItemList
                        items={[
                          { id: '1號膠', name: '1號膠' },
                          { id: '2號膠', name: '2號膠' }
                        ]}
                        singleSelect={(selectedItem) => {
                          //setUserStatus(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField
                      label={t('processOrder.create.plasticCategory')}
                    >
                      <CustomItemList
                        items={[
                          { id: '水樽', name: '水樽' },
                          { id: '膠杯', name: '膠杯' },
                          { id: '菲林', name: '菲林' }
                        ]}
                        singleSelect={(selectedItem) => {
                          //setUserStatus(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('processOrder.create.waterBottle')}>
                      <CustomItemList
                        items={[
                          { id: '500ml', name: '500ml' },
                          { id: '1L', name: '1L' },
                          { id: '2L', name: '2L' }
                        ]}
                        singleSelect={(selectedItem) => {
                          //setUserStatus(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('processOrder.create.warehouse')}>
                      <CustomItemList
                        items={[
                          { id: '貨倉1', name: '貨倉1' },
                          { id: '貨倉2', name: '貨倉2' },
                          { id: '貨倉3', name: '貨倉3' }
                        ]}
                        singleSelect={(selectedItem) => {
                          //setUserStatus(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('pick_up_order.recyclForm.weight')}>
                      <CustomTextField
                        id="weight"
                        placeholder={t('userAccount.pleaseEnterNumber')}
                        onChange={(event) => {}}
                        onBlur={(event) => {}}
                        value={0}
                        sx={{ width: '100%' }}
                        endAdornment={
                          <InputAdornment position="end">kg</InputAdornment>
                        }
                        dataTestId="astd-create-edit-pickup-order-form-weight-input-field-2997"
                      ></CustomTextField>
                    </CustomField>
                  </Grid>
                </Box>
              </Grid>
              {/* item 2 */}
              <Grid item sx={{ marginBottom: 4 }}>
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
                    <CustomField label={t('processOrder.create.itemCategory')}>
                      <CustomItemList
                        items={itemCategory()}
                        singleSelect={(selectedItem) => {
                          //setUserStatus(selectedItem)
                        }}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item>
                    <CustomField label={t('col.recycType')} mandatory>
                      <RecyclablesListSingleSelect
                        recycL={recycType ?? []}
                        setState={(values) => {}}
                        defaultRecycL={defaultRecyc}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('processOrder.create.warehouse')}>
                      <CustomItemList
                        items={[
                          { id: '貨倉1', name: '貨倉1' },
                          { id: '貨倉2', name: '貨倉2' },
                          { id: '貨倉3', name: '貨倉3' }
                        ]}
                        singleSelect={(selectedItem) => {}}
                        defaultSelected={clasififcation}
                        needPrimaryColor={false}
                      />
                    </CustomField>
                  </Grid>
                  <Grid item sx={{ marginBottom: 2 }}>
                    <CustomField label={t('pick_up_order.recyclForm.weight')}>
                      <CustomTextField
                        id="weight"
                        placeholder={t('userAccount.pleaseEnterNumber')}
                        onChange={(event) => {}}
                        onBlur={(event) => {}}
                        value={0}
                        sx={{ width: '100%' }}
                        endAdornment={
                          <InputAdornment position="end">kg</InputAdornment>
                        }
                        dataTestId="astd-create-edit-pickup-order-form-weight-input-field-2997"
                      ></CustomTextField>
                    </CustomField>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </RightOverlayForm>
      </Box>
    </>
  )
}

export default InputProcessForm
