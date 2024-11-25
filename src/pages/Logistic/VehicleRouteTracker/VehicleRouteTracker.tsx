import React from 'react'
import { Stack } from '@mui/material'

type Props = {}

export default function VehicleRouteTracker({ }: Props) {
    const baseURL: string = window.baseURL.socif
    const iFrameURL: string = `${baseURL}#/manage/trace-view?embedded=true`

    return (
        <Stack sx={{padding: '1rem'}}>
            <iframe
            id='vehicleIframe'
            style={localstyles.iFrame} 
            title='VehicleRoute' 
            src={iFrameURL} ></iframe>
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