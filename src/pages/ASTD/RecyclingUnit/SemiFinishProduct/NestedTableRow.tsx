import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Box
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ProductAddon, Products, ProductSubType } from '../../../../types/settings';
import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../../../themes/icons';
import SemiFinishProductForm from './SemiFinishProductForm';
import { getProductType, getProductSubtype, getProductAddonType } from '../../../../APICalls/ASTD/settings/productType';


type NestedTableRowProps = {
  products: Products;
};

const NestedTableRow: React.FC<NestedTableRowProps> = ({ products }) => {
  const [open, setOpen] = useState(false);
  const [subtypeOpen, setSubtypeOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [activetab, setActiveTab] = useState<number>(0)
  
  const [initialDataProduct, setInitialData] = useState<any>({});

  const toggleSubtypeOpen = (id: string) => {
    setSubtypeOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  
  const handleFetchInitialData = async (id: string) => {
    try {
      const response = await getProductType(id);
      console.log(response.data)
      setInitialData(response.data); 
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleFetchSubtypeData = async (id: string) => {
    try {
      const response = await getProductSubtype(id);
      setInitialData(response.data); 
      
    } catch (error) {
      console.error('Failed to fetch subtype data:', error);
    }
  };
  
  const handleFetchAddonData = async (id: string) => {
    try {
      const response = await getProductAddonType(id);
      setInitialData(response.data); 
      
    } catch (error) {
      console.error('Failed to fetch addon data:', error);
    }
  };

  const handleEditProduct = (id: string) => {
    setIsOpenForm(true);
    setActiveTab(0)
    handleFetchInitialData(id);
  };

  const handleEditSubProduct = (id: string) => {
    setIsOpenForm(true);
    setActiveTab(1)
    handleFetchSubtypeData(id);
  };

  const handleEditProductAddon = (id: string) => {
    setIsOpenForm(true);
    setActiveTab(2)
    handleFetchAddonData(id);
  };

  const handleDeleteProduct = (id: string) => {
    console.log('Delete Product:', id);
  };

  const handleDeleteSubProduct = (id: string) => {
    console.log('Delete Sub-Product:', id);
  };

  const handleDeleteProductAddon = (id: string) => {
    console.log('Delete Product Addon:', id);
  };
  
  const handleClose = () => {
    setInitialData('')
    setIsOpenForm(false)
    setActiveTab(0)
  }

  return (
    <>
      <TableRow sx={{ '& td': { padding: '8px 24px', verticalAlign: 'middle' } }}>
        <TableCell sx={{ padding: '4px 8px' }}>
          {products.productSubType && products.productSubType.length > 0 && (
            <IconButton
              data-testId=""
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
        <TableCell sx={{ padding: '4px 8px', display: 'flex', justifyContent: 'flex-end'}} >
         <Box display="flex" alignItems="center" gap="8px">
         <IconButton data-testId="" aria-label="edit row" size="small" onClick={() => handleEditProduct(products.productTypeId)}>
            <EDIT_OUTLINED_ICON />
          </IconButton>
          <IconButton data-testId="" aria-label="delete row" size="small" onClick={() => handleDeleteProduct(products.productTypeId)}>
            <DELETE_OUTLINED_ICON />
          </IconButton>
         </Box>
        </TableCell>
      </TableRow>

      {products.productSubType && products.productSubType.length > 0 && (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="sub-product table" padding="none">
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {products.productSubType.map((subProduct: ProductSubType) => (
                    <React.Fragment key={subProduct.productSubTypeId}>
                      <TableRow>
                        <TableCell sx={{ paddingLeft: 4 }}>
                          {subProduct.productAddonType && subProduct.productAddonType.length > 0 && (
                            <IconButton
                              data-testId=""
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleSubtypeOpen(subProduct.productSubTypeId)}
                            >
                              {subtypeOpen[subProduct.productSubTypeId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          )}
                          {subProduct.productNameTchi || '-'}
                        </TableCell>
                        <TableCell>{subProduct.productNameSchi || '-'}</TableCell>
                        <TableCell>{subProduct.productNameEng || '-'}</TableCell>
                        <TableCell>{subProduct.description || '-'}</TableCell>
                        <TableCell>{subProduct.remark || '-'}</TableCell>
                        <TableCell sx={{ padding: '4px 8px', display: 'flex', justifyContent: 'flex-end'}} >
                        <Box display="flex" alignItems="center" gap="8px">
                        <IconButton data-testId="" aria-label="edit row" size="small" onClick={() => handleEditSubProduct(subProduct.productSubTypeId)}>
                            <EDIT_OUTLINED_ICON />
                          </IconButton>
                          <IconButton data-testId="" aria-label="delete row" size="small" onClick={() => handleDeleteSubProduct(subProduct.productSubTypeId)}>
                            <DELETE_OUTLINED_ICON />
                          </IconButton>
                        </Box>
                        </TableCell>
                      </TableRow>

                      {subProduct.productAddonType && subProduct.productAddonType.length > 0 && (
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={subtypeOpen[subProduct.productSubTypeId]} timeout="auto" unmountOnExit>
                              <Table size="small" aria-label="addon table" padding="none">
                                <TableBody sx={{ backgroundColor: '#f9f9f9' }}>
                                  {subProduct.productAddonType.map((addon: ProductAddon) => (
                                    <TableRow key={addon.productAddonTypeId}>
                                      <TableCell sx={{ paddingLeft: 8 }}>{addon.productNameTchi || '-'}</TableCell>
                                      <TableCell>{addon.productNameSchi || '-'}</TableCell>
                                      <TableCell>{addon.productNameEng || '-'}</TableCell>
                                      <TableCell>{addon.description || '-'}</TableCell>
                                      <TableCell>{addon.remark || '-'}</TableCell>
                                      <TableCell sx={{ padding: '4px 8px', display: 'flex', justifyContent: 'flex-end'}} >
                                        <Box display="flex" alignItems="center" gap="8px">
                                        <IconButton data-testId="" aria-label="edit row" size="small" onClick={() => handleEditProductAddon(addon.productAddonTypeId)}>
                                            <EDIT_OUTLINED_ICON />
                                          </IconButton>
                                          <IconButton data-testId="" aria-label="delete row" size="small" onClick={() => handleDeleteProductAddon(addon.productAddonTypeId)}>
                                            <DELETE_OUTLINED_ICON />
                                          </IconButton>
                                        </Box>
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
      <SemiFinishProductForm
        activeTab={activetab}
        isEditMode
        initialData={initialDataProduct}
        open={isOpenForm}
        handleClose={() => handleClose()}
        handleSubmit={() => {}}
      />
    </>
  );
};

export default NestedTableRow;
