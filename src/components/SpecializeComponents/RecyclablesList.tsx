import { Collapse } from '@mui/material'
import CustomField from '../FormComponents/CustomField'
import { il_item } from '../FormComponents/CustomItemList'
import CustomItemListRecyble from '../FormComponents/CustomItemListRecyble'
import { useEffect, useState } from 'react'
import { recycType } from '../../interfaces/common'
import { useTranslation } from 'react-i18next'
import { recyclable } from '../../interfaces/collectionPoint'
import { Item } from '../../interfaces/pickupOrder'

type recycItem = {
  recycType: il_item
  recycSubType: il_item[]
}

type props = {
  showError?: boolean
  showErrorSubtype?: boolean
  defaultRecycL?: recyclable[]
  recycL: recycType[]
  setState: (s: recyclable[]) => void
  value?: Item
  subTypeRequired?: boolean
}

export default function RecyclablesList({
  showError,
  showErrorSubtype,
  defaultRecycL,
  recycL,
  setState,
  subTypeRequired = false
}: props) {
  const [recycTypeList, setRecycTypeList] = useState<string[]>([])
  const [curRecyc, setCurRecyc] = useState<string>(' ') //Current selected recyclables
  const [subTypeList, setSubTypeList] = useState<string[]>([]) //all selected sub type
  const [recyWithNoSubItems, setRecyWithNoSubItems] = useState<string[]>([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (defaultRecycL) {
      setRecycTypeList(recyclables_getRecycTypes(defaultRecycL))
      setSubTypeList(recyclables_getSubTypes(defaultRecycL))
    }
  }, [])

  useEffect(() => {
    setState(toRecyclables())
  }, [recycTypeList, subTypeList, defaultRecycL, recycL])

  useEffect(() => {
    const recycTypes = returnRecycTypes()
    const noSubItems = recycTypes
      .filter((item) => item.recycSubType.length === 0)
      .map((item) => item.recycType.id)
    setRecyWithNoSubItems(noSubItems)
  }, [recycL, i18n.language])

  const returnRecycTypes = () => {
    const recycItem: recycItem[] = []
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

    //set recycItem
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
    const recyTypeId = recycId != undefined ? recycId : recycTypeList?.[0]
    const item: recycItem | undefined = returnRecycTypes().find((recycType) => {
      return recycType.recycType.id === recyTypeId
    })
    if (item) {
      const subItems = item.recycSubType
      return subItems
    } else {
      return []
    }
  }

  const returnSubTypesId = (id: string) => {
    var subTypesId: string[] = []
    const re = returnRecycTypes().find((recyc) => {
      //find the corresponding recyclable object
      return recyc.recycType.id == id
    })
    if (re) {
      re.recycSubType.map((sub) => {
        subTypesId.push(sub.id)
      })
    }
    return subTypesId
  }

  const returnWithSubItem = () => {
    var withSubItem: string[] = [] //store the ids of recycType that have selected sub item
    recycTypeList.map((id) => {
      const subId = returnSubTypesId(id)
      subId.map((sub) => {
        if (subTypeList.includes(sub)) {
          withSubItem.push(id)
        }
      })
    })
    return withSubItem
  }

  const selectRecyc = (str: string[]) => {
    //do select and unselect action for main item
    if (recycTypeList.length < str.length) {
      //selecting new item
      setRecycTypeList(str)
    } else if (recycTypeList.length > str.length) {
      //unselecting an item
      const removeRecyc = recycTypeList.find((recyc) => {
        //find the item that has been removed
        return !str.includes(recyc)
      })
      if (removeRecyc) {
        const subId = returnSubTypesId(removeRecyc)
        const subList = subTypeList.filter((sub) => {
          //remove the sub items of unselected item from sub type list
          return !subId.includes(sub)
        })
        setSubTypeList(subList)
      }
      setRecycTypeList(str)
    }
  }
  const selectSubRecyc = (selectedSubType: string[]) => {
    console.log('selectedSubType', selectedSubType)
    setSubTypeList(selectedSubType)
  }

  const recyclables_getRecycTypes = (recycs: recyclable[]) => {
    const reTypes: string[] = recycs.map((recyc) => {
      return recyc.recycTypeId
    })
    return reTypes
  }

  const recyclables_getSubTypes = (recycs: recyclable[]) => {
    var subTypes: string[] = []
    recycs.map((recyc) => {
      recyc.recycSubTypeId.map((sub) => {
        subTypes.push(sub)
      })
    })

    return subTypes
  }

  const toRecyclables = () => {
    var recyclableS: recyclable[] = []
    recycTypeList.map((recyc) => {
      const recycType = recycL.find((r) => r.recycTypeId === recyc)
      if (recycType && recycType.recycSubType.length > 0) {
        const subId = returnSubTypesId(recyc)
        const subList = subTypeList.filter((sub) => {
          return subId.includes(sub)
        })
        recyclableS.push({ recycTypeId: recyc, recycSubTypeId: subList })
      } else {
        recyclableS.push({ recycTypeId: recyc, recycSubTypeId: [] })
      }
    })
    return recyclableS
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
      <CustomItemListRecyble
        items={returnRecyclables(returnRecycTypes())}
        withSubItems={returnWithSubItem()}
        multiSelect={selectRecyc}
        setLastSelect={setCurRecyc}
        error={showError && recycTypeList.length == 0}
        defaultSelected={
          defaultRecycL ? recyclables_getRecycTypes(defaultRecycL) : []
        }
        noSubItems={recyWithNoSubItems}
      />
      {}
      {curRecyc != ' ' && !recyWithNoSubItems.includes(curRecyc) && (
        <Collapse sx={{ mt: 1 }} in={recycTypeList.length > 0} unmountOnExit>
          <CustomField
            label={getNameFromRecycId(curRecyc)}
            mandatory={subTypeRequired}
          >
            <CustomItemListRecyble
              items={returnSubRecyclables(curRecyc)}
              multiSelect={selectSubRecyc}
              defaultSelected={subTypeList}
              error={
                showErrorSubtype &&
                !returnSubRecyclables(curRecyc).some((it) =>
                  subTypeList.includes(it.id)
                )
              }
            />
          </CustomField>
        </Collapse>
      )}
    </>
  )
}
