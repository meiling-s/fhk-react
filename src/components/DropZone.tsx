import { Grid, Typography , TextareaAutosize} from '@mui/material';
import React, { useState } from 'react';
import { useDrop, DropTargetMonitor, } from 'react-dnd';
import { useTranslation } from 'react-i18next';

type props = {
    onDrop: (item:any) => void
    value: string
    handleSelect: (event: React.SyntheticEvent<HTMLTextAreaElement, Event>) => void
}

const DropZone = (
    { 
        onDrop, 
        value,
        handleSelect 
    } : props) => {
    const  { t } = useTranslation();
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    const onHandleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
        const target = event.target as HTMLInputElement;
        // console.log('event', target.selectionStart)
        const cursorPosition = target?.selectionStart;
        if (cursorPosition) setCursorPosition(cursorPosition)
        console.log('cursorPosition',cursorPosition)
    }

    const onHandleDrop = (item:any) => {
        if(cursorPosition){
            onDrop(item)
        }   
    }
        
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => onHandleDrop(item),
        hover: (item) => {
            console.log('item', item)
        },
        // drop: (item: any, monitor: DropTargetMonitor) => {
        //     if (!monitor.isOver()) {
        //         console.log('monitor', monitor)
        //         return
        //     }
      
        //     // if (item.isMoved) {
        //     //   dispatch.components.moveComponent({
        //     //     parentId: componentId,
        //     //     componentId: item.id,
        //     //   })
        //     // } else if (item.isMeta) {
        //     //   dispatch.components.addMetaComponent(builder[item.type](componentId))
        //     // } else {
        //     //   dispatch.components.addComponent({
        //     //     parentName: componentId,
        //     //     type: item.type,
        //     //     rootParentType: item.rootParentType,
        //     //   })
        //     // }
        //   },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        // <div
        //     ref={drop}
        //     style={{
        //         border: `1px dashed ${isOver ? 'green' : 'black'}`,
        //         padding: '10px',
        //     }}>
        //     Drop here
        // </div>
        <Grid display={'flex'} direction={'column'} rowGap={1}>
            <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                {t('notification.modify_template.app.content')}
            </Typography>
            <TextareaAutosize
                ref={drop}
                id="content"
                style={{ width: '1200px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }}
                value={value}
                minRows={7}
                onChange={(event) => {
                    // setNotifTemplate(prev => {
                    //     return {
                    //         ...prev,
                    //         content: event.target.value
                    //     }
                    // })
                }}
                // onFocusCapture={onChangeCursor}
                onMouseMove={(event) => onHandleSelect(event)}
            />
        </Grid>
    );
};

export default DropZone;