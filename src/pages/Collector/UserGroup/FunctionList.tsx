import { Button } from "@mui/joy";
import { SetStateAction, useEffect, useState } from "react";
import { Functions } from "../../../interfaces/userGroup";
import i18next from "i18next";

export default function FunctionList({
    key,
    item,
    functions,
    setFunctions
}: {
    key: number,
    item: Functions,
    functions: number[],
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
            style={{borderRadius: 50, margin: 4}}
            onClick={() => {
                const index = functions?.indexOf(item.functionId);
                let newValue = functions
                if (index !== -1) {
                    newValue.splice(index, 1)
                } else {
                    newValue.push(item.functionId)
                }
                setFunctions(newValue);
                console.log(functions)
                setSelected(!selected);
            }}
        >
            {i18next.language === 'enus' && item.functionNameEng}
            {i18next.language === 'zhch' && item.functionNameSChi}
            {i18next.language === 'zhhk' && item.functionNameTChi}
        </Button>
    )
}