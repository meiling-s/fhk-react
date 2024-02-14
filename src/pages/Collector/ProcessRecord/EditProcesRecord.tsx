import { Box, Grid, Divider, Typography, Button } from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import RightOverlayForm from '../../../components/RightOverlayForm'
import EditRecyclableForm from './EditRecyclableForm'
import CustomField from '../../../components/FormComponents/CustomField'
import theme from '../../../themes/palette'

import { useTranslation } from 'react-i18next'

interface EditProcessRecordProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow?: any | null
}

const EditProcessRecord: FunctionComponent<EditProcessRecordProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow
}) => {
  const { t } = useTranslation()
  const [drawerRecyclable, setDrawerRecyclable] = useState(false)
  const [recycData, setRecycData] = useState<any>({})
  const fieldItem = [
    {
      label: t('processRecord.creationDate'),
      value: '2023/09/20 6:00pm'
    },
    {
      label: t('processRecord.handleName'),
      value: '分類及磅重'
    },
    {
      label: t('processRecord.processingLocation'),
      value: '處理地點'
    },
    {
      label: t('processRecord.handler'),
      value: '陳大文'
    }
  ]

  const [rycleItem, setRycleItem] = useState([
    {
      id: 1 ,
      category: '盒',
      newData: false,
      type: '報紙',
      subtype: '廢紙 | RC12345678',
      weight: '5',
      img: ['../Image.png', '../Image.png']
    },
    {
      id: 2,
      category: '盒',
      newData: false,
      type: '報紙',
      subtype: '廢紙 | RC12345678',
      weight: '5'
      //   img: ['../Image.png']
    }
  ])

  const onSaveData = () => {}

//   const handleCreateRecyc = (data: any) => {
//     console.log('handleCreateRecyc', data)
//     const imgList = data.imagesList.map((item: string) => {
//       const format = item.startsWith('data:image/png') ? 'png' : 'jpeg'
//       return `data:image/${format};base64,${item}`
//     })
//     setRycleItem((prevItems) => [
//       ...prevItems,
//       {
//         category: '盒',
//         newData: data.newData,
//         type: '報紙',
//         subtype: '廢紙 | RC12345678',
//         weight: data.weight,
//         img: imgList
//       }
//     ])
//   }

const handleCreateRecyc = (data: any) => {
    console.log('handleCreateRecyc', data)
    const imgList = data.imagesList.map((item: string) => {
      const format = item.startsWith('data:image/png') ? 'png' : 'jpeg'
      return `data:image/${format};base64,${item}`
    })
  
    const existingItemIndex = rycleItem.findIndex((item) => item.id === data.id);
  
    if (existingItemIndex !== -1) {
      // If the item with the same ID exists, update it
      setRycleItem((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          newData: data.newData,
          weight: data.weight,
          img: imgList
        };
        return updatedItems;
      });
    } else {
      // If the item with the same ID doesn't exist, add it to the array
      setRycleItem((prevItems) => [
        ...prevItems,
        {
          id: data.id,
          category: '盒',
          newData: data.newData,
          type: '報紙',
          subtype: '廢紙 | RC12345678',
          weight: data.weight,
          img: imgList
        }
      ]);
    }
  };
  

  return (
    <>
      <div className="detail-inventory">
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'edit'}
          headerProps={{
            title: t('processRecord.processingRecords'),
            subTitle: 'RC029939993',
            onSubmit: onSaveData,
            onDelete: handleDrawerClose,
            onCloseHeader: handleDrawerClose,
            submitText: t('col.save'),
            cancelText: t('col.cancel'),
            statusLabel:'processing'
          }}
        >
          <Divider />
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
                <Box>
                  <Typography sx={styles.header2}>
                    {t('processRecord.detail.processingData')}
                  </Typography>
                </Box>
              </Grid>
              {fieldItem.map((item, index) => (
                <Grid item key={index}>
                  <CustomField label={item.label}>
                    <Typography sx={localStyle.textField}>
                      {item.value}
                    </Typography>
                  </CustomField>
                </Grid>
              ))}
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('processRecord.detail.recyclingInformation')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box>
                  <div className="recyle-type-weight text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                    處理前的回收物類別及重量
                  </div>
                  {rycleItem.map((item, index) => (
                    <div
                      key={index}
                      className="recyle-item px-4 py-2 rounded-xl border border-solid border-[#E2E2E2] mt-4"
                    >
                      <div className="detail flex justify-between items-center">
                        <div className="recyle-type flex items-center gap-2">
                          <div className="category" style={categoryRecyle}>
                            {item.category}
                          </div>
                          <div className="type-item">
                            <div className="sub-type text-xs text-black font-bold tracking-widest">
                              {item.type}
                            </div>
                            <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                              {item.subtype}
                            </div>
                          </div>
                        </div>
                        <div className='right action flex items-center gap-2'>
                        <div className="weight font-bold font-base">
                          {item.weight}kg
                        </div>
                        {
                            item.newData && (
                                <DriveFileRenameOutlineOutlinedIcon
                                 onClick={() =>{
                                     setRecycData(item) 
                                     setDrawerRecyclable(true)}}
                                 fontSize='small' 
                                 className='text-gray cursor-pointer'/>
                            )
                        }
                        </div>
                        
                      </div>
                      {item.img && (
                        <div className="images mt-3 grid lg:grid-cols-4 sm:rid grid-cols-2 gap-4">
                          {item.img.map((img, index) => (
                            <img
                              src={img}
                              alt=""
                              key={index}
                              className="lg:w-[100px] h-[100px] object-cover sm:w-16"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => setDrawerRecyclable(true)}
                  sx={{
                    padding: '32px',
                    width: '100%',
                    borderColor: theme.palette.primary.main,
                    color: 'black',
                    borderRadius: '10px'
                  }}
                >
                  <div className="inline-grid">
                    <AddCircleIcon
                      sx={{ ...styles.endAdornmentIcon, pl: '3px' }}
                    />
                    {t('pick_up_order.new')}
                  </div>
                </Button>
              </Grid>
            </Grid>
          </Box>
          <EditRecyclableForm
            drawerOpen={drawerRecyclable}
            handleDrawerClose={() => setDrawerRecyclable(false)}
            onCreateRecycle={handleCreateRecyc}
            editedData={recycData}
          />
        </RightOverlayForm>
      </div>
    </>
  )
}

let localStyle = {
  textField: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  card: {
    borderColor: 'ACACAC',
    borderRadius: '10px',
    padding: 2,
    borderWidth: '1px',
    borderStyle: 'solid'
  }
}

const categoryRecyle: React.CSSProperties = {
  height: '25px',
  width: '25px',
  padding: '4px',
  textAlign: 'center',
  background: 'lightskyblue',
  lineHeight: '25px',
  borderRadius: '25px',
  color: 'darkblue'
}
export default EditProcessRecord
