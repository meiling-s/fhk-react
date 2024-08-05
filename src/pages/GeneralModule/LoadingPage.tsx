import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import LoadingCircle from '../../components/LoadingCircle'
import { useNavigate } from 'react-router-dom'

const LoadingPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const downloadUrl = decodeURIComponent(params.get('downloadUrl') || '')
    const typeFile = decodeURIComponent(params.get('typeFile') || '')
    const reportName = decodeURIComponent(params.get('reportName') || '')
    console.log('downloadUrl', downloadUrl)
    const downloadFile = async (url: string) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: '*/*'
          }
        })

        //check if response ok && reader exist
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Failed to get reader from response body')
        }

        const contentLength = response.headers.get('Content-Length')
        let receivedLength = 0
        const chunks: Uint8Array[] = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          if (value) {
            chunks.push(value)
            receivedLength += value.length
            console.log(`Received ${receivedLength} of ${contentLength}`)
          }
        }

        const blob = new Blob(chunks)
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

        a.download = reportName
          ? `${reportName}.${extension}`
          : `download-report.${extension}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(urlObject)

        setTimeout(() => {
          window.close()
        }, 4000)
      } catch (error) {
        console.error('Download failed:', error)
      }
    }

    if (downloadUrl) {
      downloadFile(downloadUrl)
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
