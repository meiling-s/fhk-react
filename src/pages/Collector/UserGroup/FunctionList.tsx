import { Button } from "@mui/joy";
import { SetStateAction, useEffect, useState } from "react";
import { Functions } from "../../../interfaces/userGroup";
import { styles } from '../../../constants/styles'

import i18next from "i18next";

export default function FunctionList({
    key,
    item,
    functions,
    disabled,
    setFunctions
}: {
    key: number,
    item: Functions,
    functions: number[],
    disabled: boolean,
    setFunctions: (value: SetStateAction<number[]>) => void
}) {
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        const index = functions.indexOf(item.functionId)
        if (index !== -1) {
            setSelected(true)
        } else {
            setSelected(false)
        }
    }, [functions])

    return (
        <Button
            key={key}
            value={item.functionId}
            color="success"
            variant={selected ? 'soft' : 'outlined'}
            sx={[selected ? styles.tagOutlineActive : styles.tagOutlineDefault, {
                width: 'max-content',
                height: '40px'
            }]}
            style={{ borderRadius: 50, margin: 4 }}
            disabled={disabled}
            onClick={() => {
                const index = functions?.indexOf(item.functionId);
                let newValue = functions
                if (index !== -1) {
                    newValue.splice(index, 1)
                } else {
                    newValue.push(item.functionId)
                }
                setFunctions(newValue);
                // console.log(functions)
                setSelected(!selected);
            }}
        >
            {i18next.language === 'enus' && item.functionNameEng}
            {i18next.language === 'zhch' && item.functionNameSChi}
            {i18next.language === 'zhhk' && item.functionNameTChi}
        </Button>
    )
}
