import { Collapse } from '@mui/material'
import CustomField from '../FormComponents/CustomField'
import CustomItemList, { il_item } from '../FormComponents/CustomItemList'
import { useEffect, useState } from 'react'
import { recycType } from '../../interfaces/common'
import { useTranslation } from 'react-i18next'
import { recyclable, singleRecyclable } from '../../interfaces/collectionPoint'
import { Item } from '../../interfaces/pickupOrder'

type recycItem = {
  recycType: il_item
  recycSubType: il_item[]
}

export type itemList = {
  bgColor: string
  borderColor: string
}

type props = {
  showError?: boolean
  showErrorSubtype?: boolean
  defaultRecycL?: singleRecyclable
  recycL: recycType[]
  setState: (s: singleRecyclable) => void
  value?: Item
  itemColor?: itemList
}

export default function RecyclablesListSingleSelect({
  showError,
  showErrorSubtype,
  defaultRecycL,
  recycL,
  setState,
  value,
  itemColor
}: props) {
  const [curRecyc, setCurRecyc] = useState<string>(' ') //Current selected recyclables
  const [recycType, setRecycType] = useState<string>('')
  const [subType, setSubType] = useState<string>('') //selected sub type
  const [choosenRecycType, setChoosenRecycType] = useState<recycType | null>(
    null
  )
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (curRecyc !== null) {
      const filteredRecyc = recycL.filter(
        (value) => value.recycTypeId === curRecyc
      ) as recycType[]
      if (filteredRecyc !== undefined && filteredRecyc.length > 0) {
        setChoosenRecycType(filteredRecyc[0])
      }
    }
  }, [curRecyc])
  useEffect(() => {
    //console.log("defaultRecycL:",defaultRecycL);
    if (defaultRecycL) {
      setRecycType(defaultRecycL.recycTypeId)
      setSubType(defaultRecycL.recycSubTypeId)
      setCurRecyc(defaultRecycL.recycTypeId)
    }
  }, [defaultRecycL])

  useEffect(() => {
    setState(toSingleRecyclable())
    // console.log(toSingleRecyclable());
  }, [recycType, subType])

  const returnRecycTypes = () => {
    const recycItem: recycItem[] = []
    //console.log("recycL: ", recycL);
    recycL.map((re) => {
      var reItem: recycItem = {
        recycType: { name: '', id: '' },
        recycSubType: []
      }
      var subItem: il_item[] = []
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = re.recyclableNameEng
          break
        case 'zhch':
          name = re.recyclableNameSchi
          break
        case 'zhhk':
          name = re.recyclableNameTchi
          break
        default:
          name = re.recyclableNameTchi //default fallback language is zhhk
          break
      }
      reItem.recycType = { name: name, id: re.recycTypeId }

      re.recycSubType.map((sub) => {
        var subName = ''
        switch (i18n.language) {
          case 'enus':
            subName = sub.recyclableNameEng
            break
          case 'zhch':
            subName = sub.recyclableNameSchi
            break
          case 'zhhk':
            subName = sub.recyclableNameTchi
            break
          default:
            subName = sub.recyclableNameTchi //default fallback language is zhhk
            break
        }
        subItem.push({ name: subName, id: sub.recycSubTypeId })
      })
      reItem.recycSubType = subItem

      recycItem.push(reItem)
    })
    return recycItem
  }

  const returnRecyclables = (recycS: recycItem[]) => {
    //transforming recyclables to string array with main items name only
    const recyclables: il_item[] = recycS.map((recyc) => {
      return recyc.recycType
    })
    return recyclables
  }

  const returnSubRecyclables = (recycId: string) => {
    //return sub items of recyc
    const item: recycItem | undefined = returnRecycTypes().find((recycType) => {
      return recycType.recycType.id === recycId
    })
    if (item) {
      const subItems = item.recycSubType
      return subItems
    } else {
      return []
    }
  }

  const toSingleRecyclable = () => {
    const singleRecyc: singleRecyclable = {
      recycTypeId: recycType,
      recycSubTypeId: subType
    }
    return singleRecyc
  }

  const getNameFromRecycId = (id: string) => {
    const reType = recycL.find((re) => {
      return re.recycTypeId == id
    })
    if (reType) {
      switch (i18n.language) {
        case 'enus':
          return reType.recyclableNameEng
        case 'zhch':
          return reType.recyclableNameSchi
        case 'zhhk':
          return reType.recyclableNameTchi
        default:
          return reType.recyclableNameTchi //default fallback language is zhhk
      }
    }
    return ''
  }

  return (
    <>
      <CustomItemList
        items={returnRecyclables(returnRecycTypes())}
        singleSelect={(s) => {
          setRecycType(s)
          setSubType('')
        }}
        itemColor={itemColor ? itemColor : null}
        setLastSelect={setCurRecyc}
        error={showError && recycType.length == 0}
        defaultSelected={defaultRecycL ? defaultRecycL.recycTypeId : []}
        dataTestId="astd-create-edit-pickup-order-form-recyc-main-category-select-button-5238"
      />
      <Collapse
        sx={{ mt: 1 }}
        in={
          curRecyc != ' ' &&
          recycType.length > 0 &&
          choosenRecycType?.recycSubType !== undefined &&
          choosenRecycType?.recycSubType.length > 0
        }
        unmountOnExit
      >
        <CustomField
          label={
            curRecyc == ' '
              ? ''
              : getNameFromRecycId(curRecyc) +
                ' ' +
                t('pick_up_order.detail.subcategory')
          }
          key={recycType}
          mandatory={true}
        >
          <CustomItemList
            items={returnSubRecyclables(curRecyc)}
            singleSelect={setSubType}
            defaultSelected={subType}
            itemColor={itemColor ? itemColor : null}
            dataTestId="astd-create-edit-pickup-order-form-recyc-sub-category-select-button-1689"
            error={showErrorSubtype && subType === ''}
          />
        </CustomField>
      </Collapse>
    </>
  )
}
