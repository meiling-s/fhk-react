import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { styles, primaryColor, primaryLightColor } from '../../constants/styles'

//item list's item
export type il_item = {
  name: string
  id: string
}

export type itemList = {
  bgColor: string
  borderColor: string
}

type props = {
  items: il_item[]
  withSubItems?: string[]
  singleSelect?: (s: string) => void
  multiSelect?: (s: string[]) => void
  defaultSelected?: string[] | string //just for setting the defaultSelected value of selectMulti
  setLastSelect?: (s: string) => void //for determinding the last selected item
  error?: boolean
  editable?: boolean
  itemColor?: itemList | null
  needPrimaryColor?: boolean
  noSubItems?: string[]
}
function CustomItemList({
  items,
  withSubItems,
  singleSelect,
  multiSelect,
  defaultSelected,
  setLastSelect,
  error,
  editable,
  itemColor,
  needPrimaryColor,
  noSubItems
}: props) {
  const triggerdItem = {
    ...styles.listItemTemp,
    backgroundColor: itemColor?.bgColor
      ? itemColor?.bgColor
      : primaryLightColor,
    borderColor: itemColor?.borderColor ? itemColor?.borderColor : primaryColor,
    color: needPrimaryColor ? primaryColor : '#535353',
    '&.MuiButton-root:hover': {
      borderColor: itemColor?.borderColor
        ? itemColor?.borderColor
        : primaryColor
    }
  }

  const [selectSingle, setSelectSingle] = useState<string>('')
  const [selectMulti, setSelectMulti] = useState<string[]>([])
  const [LS, setLS] = useState<string>(' ') //last select

  const setSelectedItem = () => {
    if (defaultSelected && Array.isArray(defaultSelected) && multiSelect) {
      setSelectMulti(defaultSelected)
    } else if (defaultSelected && !Array.isArray(defaultSelected)) {
      setSelectSingle(defaultSelected)
    }
  }

  useEffect(() => {
    setSelectedItem()
  }, [])

  if (!(singleSelect || multiSelect)) {
    //if none of the select method exist
    return <></>
  }

  //determine currently using single select or multi select, do action accordingly
  const handleSelect = (select: string) => {
    if (editable != undefined && !editable) {
      return
    }

    var selectAction: boolean = true //true = doing select, false = doing unselect
    if (singleSelect) {
      if (selectSingle != '' && selectSingle == select) {
        //if selected, do unselect
        selectAction = false
      } else {
        //if unselected, do select
        setSelectSingle(select)
        singleSelect(select)
      }
    } else if (multiSelect) {
      const selected = Object.assign([], selectMulti)
      if (!selected.includes(select)) {
        selected.push(select)
        setSelectMulti(selected)
        multiSelect(selected)
      }
    }

    if (setLastSelect) {
      setLastSelect(selectAction ? select : ' ')
      setLS(selectAction ? select : ' ')
    }
  }

  const handleDoubleSelect = (select: string) => {
    if (editable != undefined && !editable) {
      return
    }

    var selectAction: boolean = true //true = doing select, false = doing unselect
    if (singleSelect) {
      if (selectSingle != '' && selectSingle == select) {
        //if selected, do unselect
        setSelectSingle('')
        singleSelect('')
        selectAction = false
      } else {
        //if unselected, do select
        setSelectSingle(select)
        singleSelect(select)
      }
    } else if (multiSelect) {
      const selected = Object.assign([], selectMulti)
      if (selected.includes(select)) {
        //if selected, do unselect
        setSelectMulti(Object.values(selected).filter((s) => s != select))
        multiSelect(Object.values(selected).filter((s) => s != select))
        selectAction = false
      } else {
        //if unselected, do select
        selected.push(select)
        setSelectMulti(selected)
        multiSelect(selected)
      }
    }

    if (setLastSelect) {
      setLastSelect(selectAction ? select : ' ')
      setLS(selectAction ? select : ' ')
    }
  }

  const returnTheme = (s: string) => {
    var theme = localstyles.item
    var edit = editable != undefined ? editable : true
    const hasNoSubItems = noSubItems?.includes(s)

    if (singleSelect) {
      if (selectSingle == s && edit) {
        theme = triggerdItem
      } else if (selectSingle == s && !edit) {
        theme = localstyles.uneditable
      }
    } else if (multiSelect) {
      if (selectMulti.includes(s)) {
        if (!edit) {
          theme = localstyles.uneditable
        } else if (
          hasNoSubItems ||
          (withSubItems && withSubItems.includes(s))
        ) {
          theme = localstyles.withSubItems
        } else {
          theme = triggerdItem
        }
      }
    }
    return theme
  }
  return (
    <Box sx={localstyles.container}>
      {items.map((item, index) => (
        <Button
          key={index}
          variant="outlined"
          sx={error ? localstyles.error : returnTheme(item.id)}
          style={{ marginRight: '6px', marginBottom: '6px' }}
          onClick={() => {
            handleSelect(item.id)
          }}
          onDoubleClick={() => {
            handleDoubleSelect(item.id)
          }}
        >
          {item.name}
        </Button>
      ))}
    </Box>
  )
}
const localstyles = {
  container: {
    mt: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    ...styles.listItemTemp,
    backgroundColor: 'white',
    borderColor: '#D1D1D1',
    color: '#535353',
    '&.MuiButton-root:hover': {
      borderColor: '#D1D1D1'
    }
  },
  withSubItems: {
    ...styles.listItemTemp,
    backgroundColor: '#79CA25',
    borderColor: '#79CA25',
    color: '#FFFFFF',
    '&.MuiButton-root:hover': {
      borderColor: '#79CA25'
    }
  },
  error: {
    ...styles.listItemTemp,
    backgroundColor: 'white',
    borderColor: '#d32f2f',
    color: '#535353',
    '&.MuiButton-root:hover': {
      borderColor: '#d32f2f',
      backgroundColor: '#F0F0F0'
    }
  },
  uneditable: {
    ...styles.listItemTemp,
    backgroundColor: '#C7C7C7',
    borderColor: '#D1D1D1',
    color: '#808080',
    '&.MuiButton-root:hover': {
      borderColor: '#D1D1D1',
      backgroundColor: '#C7C7C7'
    }
  }
}
export default CustomItemList
