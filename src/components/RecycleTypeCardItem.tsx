import { Box, Typography } from "@mui/material"
import CustomField from "./FormComponents/CustomField"
import { useTranslation } from "react-i18next"

const RecycleTypeCardItem = ({
  index,
  localstyles,
  data,
  item,
  type,
}: {
  index: number,
  localstyles: any,
  data?: any,
  item?: any,
  type: 'product' | 'recyclable',
}) => {

  const { t } = useTranslation()

  let label = {
    typeLabel: '',
    subTypeLabel: '',
    addonTypeLabel: '',
  }

  switch (type) {

    case 'recyclable': {
      label.typeLabel = t('pick_up_order.card_detail.main_category')
      label.subTypeLabel = t('pick_up_order.card_detail.subcategory')
    } break
    case 'product': {
      label.typeLabel = t('pick_up_order.card_detail.product_type_label')
      label.subTypeLabel = t('pick_up_order.card_detail.sub_product_type_label')
      label.addonTypeLabel = t('pick_up_order.card_detail.addon_product_type_label')
    } break

  }

  const dataValid = (data && data?.length > 0 && data[index]) || item

  const typeName = dataValid?.typeName
  const subtType = dataValid?.subTypeName
  const addonTypeName = dataValid?.addonTypeName

  return (
    <Box key={index}>
      <CustomField
        label={label?.typeLabel}
      >
        <Typography sx={localstyles.typo_fieldContent}>
          {typeName || '-'}
        </Typography>
      </CustomField>
      <CustomField
        label={label?.subTypeLabel}
        style={{ marginTop: '12px' }}
      >
        <Typography sx={localstyles.typo_fieldContent}>
          {subtType || '-'}
        </Typography>
      </CustomField>
      {
        addonTypeName &&
        <CustomField
          label={label?.addonTypeLabel}
          style={{ marginTop: '12px' }}
        >
          <Typography sx={localstyles.typo_fieldContent}>
            {addonTypeName || '-'}
          </Typography>
        </CustomField>
      }
    </Box>
  )
}

export default RecycleTypeCardItem