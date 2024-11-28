import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { returnApiToken } from 'src/utils/utils'

type Props = {}

export default function VehicleRouteTracker({ }: Props) {
    const { i18n } = useTranslation()
    const { tenantId } = returnApiToken()

    let lang = 'en'
    switch(i18n.language) {
        case 'enus':
            lang = 'en'
            break
        case 'zhch':
            lang = 'sc'
            break
        case 'zhhk':
            lang = 'tc'
            break
    }

    const baseURL: string = window.baseURL.socif
    const iFrameURL: string = `${baseURL}#/login?astd-tenantId=${tenantId}&password=astd-${tenantId}pw&redirect=/manage/trace-view&embedded=true&lang=${lang}`

    return (
        <Stack sx={{padding: '1rem'}}>
            <iframe
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