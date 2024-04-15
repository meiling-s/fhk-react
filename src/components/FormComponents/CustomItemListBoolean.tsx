import { Box, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { styles, primaryColor, primaryLightColor } from "../../constants/styles"

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
        backgroundColor: itemColor?.bgColor ? itemColor?.bgColor : primaryLightColor,
        borderColor: itemColor?.borderColor ? itemColor?.borderColor : primaryColor,
        color: needPrimaryColor ? primaryColor : '#535353',
        '&.MuiButton-root:hover': {
          borderColor:itemColor?.borderColor ? itemColor?.borderColor : primaryColor
        }
      }

    const handleSingleClick = (index: number) => {
        if(!setServiceFlg) return
        setServiceFlg(index)
    }

    return(
        <Box sx={localstyles.container}>
            {
                items.map((item, index) => (
                    <Button
                        variant="outlined"
                        sx={value === index ? triggerdItem : localstyles.uneditable}
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
    uneditable: {
        ...styles.listItemTemp,
        backgroundColor: "white",
        borderColor: "#D1D1D1",
        color: "#808080",
        '&.MuiButton-root:hover':{
            borderColor: "#D1D1D1",
            backgroundColor: "#C7C7C7"
        }
    }
}
export default CustomItemList