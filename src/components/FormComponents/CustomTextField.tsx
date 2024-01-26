import { Button, InputAdornment, TextField, makeStyles } from "@mui/material"
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
    multiline?: boolean
    rows?:number
    sx?:any
    helperText?:any,
    disabled?: boolean
    
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
    multiline = false,
    rows,
    sx,
    helperText,
    disabled  =false,

}: props) {

  
    return(
        <TextField
            error={error}
            className={className}
            hiddenLabel
            id={id}
            value={value}
            multiline={multiline}
            rows={multiline ? 4 : rows}
            placeholder={placeholder}
            defaultValue={defaultValue? defaultValue : ''}
            onChange={onChange}
            sx={{...styles.textField,...sx}}
            helperText={helperText}
            disabled={disabled}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{height: "100%"}}>
                        {endAdornment&& endAdornment}
                    </InputAdornment>
                ),
                sx: [styles.inputProps, {cursor: disabled ? 'no-drop' : ""}]
            }}
        />
    )
}

export default CustomTextField