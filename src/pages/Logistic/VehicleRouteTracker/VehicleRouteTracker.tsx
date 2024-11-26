import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {}

export default function VehicleRouteTracker({ }: Props) {
    const { i18n } = useTranslation()
    let lang = 'en'
    switch(i18n.language) {
        case 'enus':
            lang = 'en'
            break
        case 'zhch':
            lang = 'ch'
            break
        case 'zhhk':
            lang = 'zh'
            break
    }
    const baseURL: string = window.baseURL.socif
    const iFrameURL: string = `${baseURL}#/manage/trace-view?embedded=true&lang=${lang}`

    return (
        <Stack sx={{padding: '1rem'}}>
            <iframe
                id='vehicleIframe'
                style={localstyles.iFrame} 
                title='VehicleRoute' 
                src={iFrameURL} />
        </Stack >
    )
}

const localstyles = {
    iFrame: {
        height: '100vh',
        width: '80vw',
        border: 'unset'
    }
}