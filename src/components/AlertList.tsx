import { Alert, Stack } from '@mui/material'

type Props = {
  formik: any,
  disableTouched?: boolean,
}

export default function AlertList({
  formik,
  disableTouched,
}: Props) {

  const arrError = Object.keys(formik?.errors)

  return (
    <Stack spacing={2}>
      {
        arrError?.length > 0 &&
        arrError?.map((key, index) => {

          let errMessage = ''

          try {

            let isTouched = formik.touched[key as keyof object]

            if (disableTouched) {
              isTouched = true
            }

            errMessage = isTouched ? formik.errors[key as keyof object] : ''

          }
          catch (err) {


          }

          return (
            <>
              {
                errMessage &&
                <Alert severity="error" key={'alert-list-' + index + '-' + key}>{errMessage}</Alert>
              }
            </>
          )
        })

      }
    </Stack>
  )
}