import * as React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

type props = {
    id: string;
    placeholder: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange: (value: string, type: string) => void;
    onFocusCapture?: () => void;
    onClick?: (event: React.SyntheticEvent<HTMLTextAreaElement, Event>) => void;
    error?: boolean;
    className?: string;
    multiline?: boolean;
    rows?: number;
    sx?: any;
    helperText?: any;
    disabled?: boolean;
    textarea?: boolean;
    minRows: number
};

export default function UnstyledTextareaIntroduction({
    placeholder,
    minRows,
    onFocusCapture,
    value,
    onClick,
    onChange
}: props) {
    const TextareaAutosize = styled(BaseTextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        width: 800px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        padding: 10px;
        border-radius: 12px;
      
        &:focus {
          border-color: #79CA25;
        }
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    return <TextareaAutosize 
        aria-label="empty textarea" 
        placeholder={placeholder} 
        minRows={minRows}
        value={value}
        onClick={onClick}
        onFocusCapture={onFocusCapture}
        onChange={(event) => onChange(event.target.value, 'content')}
    />;
}

