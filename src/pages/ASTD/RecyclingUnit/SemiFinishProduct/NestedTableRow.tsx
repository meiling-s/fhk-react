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
import { ProductAddon, Products, ProductSubType } from '../../../../types/settings'; // Ensure you have the correct types imported
import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../../../themes/icons';

type NestedTableRowProps = {
  products: Products;
};

const NestedTableRow: React.FC<NestedTableRowProps> = ({ products }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{'& td': { padding: '8px 16px', verticalAlign: 'middle' }}}>
        <TableCell sx={{ padding: '4px 8px' }}>
          {products.productSubType && products.productSubType.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
          {products.productNameTchi || '-'}
        </TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.productNameSchi || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.productNameEng || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.description || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>{products.remark || '-'}</TableCell>
        <TableCell sx={{ padding: '4px 8px' }}>
          <IconButton aria-label="edit row" size="small">
            <EDIT_OUTLINED_ICON />
          </IconButton>
          <IconButton aria-label="delete row" size="small">
            <DELETE_OUTLINED_ICON />
          </IconButton>
        </TableCell>
      </TableRow>

      {products.productSubType && products.productSubType.length > 0 && (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="sub-product table">
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {products.productSubType.map((subProduct: ProductSubType) => (
                    <React.Fragment key={subProduct.productSubTypeId}>
                      
                      <TableRow>
                        <TableCell sx={{ paddingLeft: 4 }}>{subProduct.productNameTchi || '-'}</TableCell>
                        <TableCell>{subProduct.productNameSchi || '-'}</TableCell>
                        <TableCell>{subProduct.productNameEng || '-'}</TableCell>
                        <TableCell>{subProduct.description || '-'}</TableCell>
                        <TableCell>{subProduct.remark || '-'}</TableCell>
                        <TableCell>
                          <IconButton aria-label="edit row" size="small">
                            <EDIT_OUTLINED_ICON />
                          </IconButton>
                          <IconButton aria-label="delete row" size="small">
                            <DELETE_OUTLINED_ICON />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                     
                      {subProduct.productAddonType && subProduct.productAddonType.length > 0 && (
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                              <Table size="small" aria-label="addon table">
                                <TableBody sx={{ backgroundColor: '#f9f9f9' }}>
                                  {subProduct.productAddonType.map((addon: ProductAddon) => (
                                    <TableRow key={addon.productAddonTypeId}>
                                      <TableCell sx={{ paddingLeft: 8 }}>{addon.productNameTchi || '-'}</TableCell>
                                      <TableCell>{addon.productNameSchi || '-'}</TableCell>
                                      <TableCell>{addon.productNameEng || '-'}</TableCell>
                                      <TableCell>{addon.description || '-'}</TableCell>
                                      <TableCell>{addon.remark || '-'}</TableCell>
                                      <TableCell>
                                        <IconButton aria-label="edit row" size="small">
                                          <EDIT_OUTLINED_ICON />
                                        </IconButton>
                                        <IconButton aria-label="delete row" size="small">
                                          <DELETE_OUTLINED_ICON />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
