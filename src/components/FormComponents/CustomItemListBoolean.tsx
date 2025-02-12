import { Box, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { styles} from "../../constants/styles"
import { getPrimaryColor, getPrimaryLightColor } from "../../utils/utils"

//item list's item
export type il_item = {
    name: string,
    id: string
}

export type itemList = {
    bgColor: string
    borderColor: string
  }

type props = {
    items: il_item[],
    setServiceFlg?: (s: number) => void
    dbClickSelect?: boolean,
    error?: boolean,
    editable?: boolean
    value?:number
    itemColor?: itemList | null,
    needPrimaryColor?: boolean
}

function CustomItemList({
    items,
    setServiceFlg,
    error,
    editable,
    value,
    itemColor,
    needPrimaryColor,
}: props){

    const triggerdItem = {
        ...styles.listItemTemp,
        backgroundColor: itemColor?.bgColor ? itemColor?.bgColor : getPrimaryLightColor,
        borderColor: itemColor?.borderColor ? itemColor?.borderColor : getPrimaryColor,
        color: needPrimaryColor ? getPrimaryColor : '#535353',
        '&.MuiButton-root:hover': {
          borderColor:itemColor?.borderColor ? itemColor?.borderColor : getPrimaryColor
        }
      }

    const handleSingleClick = (index: number) => {
        if ((editable != undefined && !editable) || !setServiceFlg) {
            return
          }
        //if(!setServiceFlg) return
        setServiceFlg(index)
    }

    return(
        <Box sx={localstyles.container}>
            {
                items.map((item, index) => (
                    <Button
                        key={index}
                        variant="outlined"
                        sx={value === index ? (editable ? triggerdItem : localstyles.uneditable) : localstyles.item}
                        onClick={()=>{ handleSingleClick(index)}}
                    >
                        {item.name}
                    </Button>
                ))
            }
        </Box>
    )
}
const localstyles = {
    container: {
        mt: 1,
        display: "flex",
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    item: {
        ...styles.listItemTemp,
        backgroundColor: "white",
        borderColor: "#D1D1D1",
        color: "#535353",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#D1D1D1"
        }
    },
    withSubItems: {
        ...styles.listItemTemp,
        backgroundColor: "#79CA25",
        borderColor: "#79CA25",
        color: "#FFFFFF",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#79CA25"
        }
    },
    error: {
        ...styles.listItemTemp,
        backgroundColor: "white",
        borderColor: "#d32f2f",
        color: "#535353",
        '&.MuiButton-root:hover':{
            borderColor: "#d32f2f",
            backgroundColor: "#F0F0F0"
        }
    },
    unselected: {
        ...styles.listItemTemp,
        backgroundColor: '#79CA25',
        borderColor: '#79CA25',
        color: '#FFFFFF',
        '&.MuiButton-root:hover': {
          backgroundColor: getPrimaryLightColor(),
          borderColor: '#79CA25'
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