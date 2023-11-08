import { Button, InputAdornment, TextField } from "@mui/material"
import { styles } from "../../constants/styles"

type props = {
    id: string,
    placeholder: string,
    value?: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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
            value={value}
            placeholder={placeholder}
            defaultValue={value? value : ''}
            onChange={onChange}
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