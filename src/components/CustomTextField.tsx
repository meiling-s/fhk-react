import { Button, InputAdornment, TextField } from "@mui/material"
import { styles } from "../constants/styles"

type props = {
    id: string,
    placeholder: string,
    value?: string | number,
    onChange: (s: string) => void
    endAdornment?: JSX.Element
}

function CustomTextField({
    id,
    placeholder,
    value,
    onChange,
    endAdornment
}: props) {
    return(
        <TextField
            hiddenLabel
            id={id}
            placeholder={placeholder}
            defaultValue={value? value : ''}
            onChange={(event: { target: { value: string } }) => {onChange(event.target.value)}}
            sx={styles.textField}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{height: "100%"}}>
                        {endAdornment&& endAdornment}
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default CustomTextField