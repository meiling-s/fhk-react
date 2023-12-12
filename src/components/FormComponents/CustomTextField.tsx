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
    rows?:number
    sx?:any
    
}

function CustomTextField({
    id,
    placeholder,
    value,
    defaultValue,
    onChange,
    endAdornment,
    error,
    className,
    rows,
    sx

}: props) {
    return(
        <TextField
            error={error}
            className={className}
            hiddenLabel
            id={id}
            multiline
            value={value}
            rows={rows}
            placeholder={placeholder}
            defaultValue={defaultValue? defaultValue : ''}
            onChange={onChange}
            sx={{...styles.textField,...sx}}
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