import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {}

export default function JobOrderScheduleBoard({ }: Props) {
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
    const iFrameURL: string = `${baseURL}#/manage/assign-order?embedded=true&lang=${lang}`

    return (
        <Stack sx={{padding: '1rem'}}>
            <iframe 
                style={localstyles.iFrame}
                title='JobBoard'
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