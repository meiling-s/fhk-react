import { Typography, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {}

export default function VehicleRouteTracker({ }: Props) {
    const { t } = useTranslation()
    return (
        <Stack sx={{padding: '1rem'}}>
            <Typography variant='body1' color='grey'>{t('common.pageUnderConstruction')}</Typography>
        </Stack >
    )
}