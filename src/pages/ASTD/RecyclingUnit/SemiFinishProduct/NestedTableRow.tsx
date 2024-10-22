import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../../../themes/icons';

type Products = {
  id: number;
  traditionalName: string;
  simplifiedName: string;
  englishName: string;
  subProducts?: Products[];
};

type NestedTableRowProps = {
  products: Products;
};

const NestedTableRow: React.FC<NestedTableRowProps> = ({ products }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{'& td': { padding: '8px 16px', verticalAlign: 'middle' }}}>
        <TableCell sx={{ padding: '4px 8px' }}>
          {products.subProducts && products.subProducts.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
          {products.traditionalName || '-'}
        </TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.simplifiedName || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.englishName || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{'-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{'-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>
          <IconButton aria-label="edit row" size="small">
            <EDIT_OUTLINED_ICON />
          </IconButton>
          <IconButton aria-label="delete row" size="small">
            <DELETE_OUTLINED_ICON />
          </IconButton>
        </TableCell>
      </TableRow>
      {products.subProducts && products.subProducts.length > 0 && (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="nested table">
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {products.subProducts.map((childRow) => (
                    <NestedTableRow key={childRow.id} products={childRow} />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default NestedTableRow;
