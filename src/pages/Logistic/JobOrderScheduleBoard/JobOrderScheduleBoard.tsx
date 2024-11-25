import { Stack } from '@mui/material'
import React from 'react'

type Props = {}

export default function JobOrderScheduleBoard({ }: Props) {
    const baseURL: string = window.baseURL.socif
    const iFrameURL: string = `${baseURL}#/manage/assign-order?embedded=true`

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