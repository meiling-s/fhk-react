import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import LoadingCircle from '../../components/LoadingCircle'
import { useNavigate } from 'react-router-dom'

const LoadingPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const downloadUrl = params.get('downloadUrl')
    const typeFile = params.get('typeFile')
    const reportName = params.get('reportName')

    const downloadFile = async (url: string) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: '*/*'
          }
        })

        const blob = await response.blob()
        const urlObject = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = urlObject
        let extension = ''
        switch (typeFile) {
          case 'XLS':
            extension = 'xlsx'
            break
          case 'WORD':
            extension = 'doc'
            break
          default:
            break
        }
        console.log('urlObject', response)
        a.download = reportName
          ? `${reportName}.${extension}`
          : `download-report.${extension}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(urlObject)
        window.close()
      } catch (error) {
        console.error('Download failed:', error)
      }
    }

    if (downloadUrl) {
      downloadFile(decodeURIComponent(downloadUrl))
    }
  }, [])

  return (
    <Box sx={localStyle.loadPageContainer}>
      <LoadingCircle />
    </Box>
  )
}

const localStyle = {
  loadPageContainer: {
    background: '#7d7d7d',
    minHeight: '100vh',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: {
      sm: 'flex-start',
      md: 'center'
    }
  }
}

export default LoadingPage
