import { Button, InputAdornment, TextField } from "@mui/material"
import { styles } from "../../constants/styles"

type props = {
    id: string,
    placeholder: string,
    value?: string | number,
    defaultValue?: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    endAdornment?: JSX.Element,
    error?: boolean,
    className?: string;
}

function CustomTextField({
    id,
    placeholder,
    value,
    defaultValue,
    onChange,
    endAdornment,
    error,
    className
}: props) {
    return(
        <TextField
            error={error}
            className={className}
            hiddenLabel
            id={id}
            value={value}
            placeholder={placeholder}
            defaultValue={defaultValue? defaultValue : ''}
            onChange={onChange}
            sx={styles.textField}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{height: "100%"}}>
                        {endAdornment&& endAdornment}
                    </InputAdornment>
                ),
                sx: styles.inputProps
            }}
        />
    )
}

export default CustomTextField