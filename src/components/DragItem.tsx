import React from 'react';
import { useDrag } from 'react-dnd';

const DragItem = ({ name } : { name:string }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { name },
        // collect: (monitor) => ({
        //     isDragging: monitor.isDragging(),
        // }),
        collect: (monitor) => {
            return {
              isDragging: monitor.isDragging(),
            };
          },
    }));

    return (
        // <div
        //     ref={drag}
        //     style={{
        //         opacity: isDragging ? 0.5 : 1,
        //         cursor: 'move',
        //         border: '1px solid #ccc',
        //         padding: '10px',
        //         borderRadius: '5px',
        //         margin: '5px',
        //         backgroundColor: 'lightblue',
        //     }}>
        //     {name}
        // </div>
        <button
            ref={drag}
            key={'index'}
            className="bg-[#FBFBFB] py-1 px-2 hover:cursor-pointer text-[##717171]"
            style={{ borderRadius: '4px', borderColor: '#E2E2E2' }}
            // onClick={(event) => onChangeContent(index)}
          > 
            [{name}] 
          </button>
    );
};

export default DragItem;
