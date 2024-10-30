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
import { toast } from 'react-toastify';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ProductAddon, Products, ProductSubType } from '../../../../types/settings';
import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../../../themes/icons';
import SemiFinishProductForm from './SemiFinishProductForm';
import { getProductType, getProductSubtype, getProductAddonType, editProductType, editProductSubtype, editProductAddonType, getProductSubtypesByProductType, getProductAddonTypesByProductSubtype, getProductTypeList } from '../../../../APICalls/ASTD/settings/productType';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useTranslation } from 'react-i18next';
import { useProductContext } from './ProductContext';
type NestedTableRowProps = {
  products: Products;
};

const NestedTableRow: React.FC<NestedTableRowProps> = ({ products }) => {
  const [open, setOpen] = useState(false);
  const [subtypeOpen, setSubtypeOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [activetab, setActiveTab] = useState<number>(0)
  const [paramId, setParamId] = useState<string>('')
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{data: any, id: string; type: string,} | null>(null);
  const {t} = useTranslation()
  const [initialData, setInitialData] = useState<any>({});
  const [initialSubCategory, setInitialSubCategory] = useState<any>([]);
  const [productId, setProductId] = useState<string>('')
  const [productSubId, setProductSubId] = useState<string>('')
  const {dispatch, refetch} = useProductContext()
  const toggleSubtypeOpen = (id: string) => {
    setSubtypeOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  
  const handleFetchInitialData = async (id: string) => {
    try {
      const response = await getProductType(id);
      setInitialData(response.data); 
      setParamId(id)
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleFetchSubtypeData = async (id: string) => {
    try {
      const response = await getProductSubtype(id);
      setInitialData(response.data); 
      setParamId(id)
      
    } catch (error) {
      console.error('Failed to fetch subtype data:', error);
    }
  };
  
  const handleFetchAddonData = async (id: string) => {
    try {
      const response = await getProductAddonType(id);
      setInitialData(response.data); 
      setParamId(id)
      
    } catch (error) {
      console.error('Failed to fetch addon data:', error);
    }
  };
  const handleFetchProductSubTypeByProductType = async (id: string) => {
    try {
      const response = await getProductSubtypesByProductType(id);
      setInitialSubCategory(response.data); 
      // setParamId(id)
      
    } catch (error) {
      console.error('Failed to fetch addon data:', error);
    }
  };

  const handleEditProduct = (id: string) => {
  setIsOpenForm(true);
    setActiveTab(0)
    handleFetchInitialData(id);
  };

  const handleEditSubProduct = (id: string, productId: string) => {
    setIsOpenForm(true);
    setActiveTab(1)
    handleFetchSubtypeData(id);
    setProductId(productId)
   
  };

  const handleEditProductAddon = (productId: string, subTypeId: string, addOnId: string) => {
    setIsOpenForm(true);
    setActiveTab(2)
    handleFetchAddonData(addOnId);
    handleFetchProductSubTypeByProductType(productId)
    setProductId(productId)
    setProductSubId(subTypeId)
  };


  const handleDeleteProduct = async (id: string) => {
    const response = await getProductType(id); 
   if(response.data) {
    const payload = {
      version:  response?.data?.version,
      status: 'INACTIVE',
      updatedBy: localStorage.getItem('username'),
    };
    setDeleteItem({ data: payload, id, type: 'product' });
    setOpenDelete(true);
   }
};
  const handleDeleteSubProduct = async(id: string, productId: string) => {
    const response = await getProductSubtype(id);
    
    if(response.data) {
      const payload = {
        version:  response?.data?.version,
        status: 'INACTIVE',
        productTypeId: productId,
        updatedBy: localStorage.getItem('username') || '',
      };
      setDeleteItem({ data: payload, id, type: 'subProduct'});
    }
    setOpenDelete(true);
  };

  const handleDeleteProductAddon = async (id: string, subProductId: string) => {
  
    const response = await getProductAddonType(id);
    if(response.data) {

      const payload = {
        version:  response.data?.version,
        status: 'INACTIVE',
        productSubTypeId: subProductId,
        updatedBy: localStorage.getItem('username') || '',
      };
  
      setDeleteItem({ data: payload, id, type: 'addon' });
    }
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteItem(null);
  };


  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    const { data, id, type } = deleteItem;
    let response;
    let toastMsg = '';

    try {
      switch (type) {
        case 'product':
          response = await editProductType(id, data);
          if (response?.status === 200) {
            refetch()
            toastMsg = t('notify.successDeleted');
          }
          break;
        case 'subProduct':
          response = await editProductSubtype(id, data);
          if (response?.status === 200) {
            refetch()
            toastMsg = t('notify.successDeleted');
          }
          break;
        case 'addon':
          response = await editProductAddonType(id, data);
          
          if (response?.status === 200) {
            refetch()
          toastMsg = t('notify.successDeleted');
          }
          break;
        default:
          throw new Error("Invalid delete type");
      }

      if (response?.status === 200) {
        if (toastMsg) {
          toast.info(toastMsg, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          })
        }
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error in handleConfirmDelete:", error);
      toast.error(t('notify.ErrorOccurred'), { autoClose: 3000 });
    } finally {
      handleCloseDelete();
    }
  };

  
  const handleClose = () => {
    setInitialData('')
    setIsOpenForm(false)
    setActiveTab(0)
  }

  return (
    <>
      <TableRow sx={{ '& td': { padding: '8px', verticalAlign: 'middle', width: '19.30%' } }}>
        <TableCell sx={{ padding: '4px 24px' }}>
          {products.productSubType && products.productSubType.length > 0 && (
            <IconButton
              data-testId={`astd-semi-product-expand-icon-142-${products.productTypeId}`}
              aria-label="expand sub item"
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
        <TableCell sx={{ width: '12%', display: 'flex', justifyContent: 'flex-end'}} >
         <Box display="flex" alignItems="center" gap="8px">
         <IconButton data-testId={`astd-semi-product-edit-icon-876-${products.productTypeId}`}aria-label="edit row" size="small" onClick={() => handleEditProduct(products.productTypeId)}>
            <EDIT_OUTLINED_ICON />
          </IconButton>
          <IconButton data-testId={`astd-semi-product-delete-icon-659-${products.productTypeId}`} aria-label="delete row" size="small" onClick={() =>  handleDeleteProduct(products.productTypeId)}>
            <DELETE_OUTLINED_ICON />
          </IconButton>
         </Box>
        </TableCell>
      </TableRow>

      {products.productSubType && products.productSubType.length > 0 && (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
           <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="sub-product table" padding="none">
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {products.productSubType.map((subProduct: ProductSubType) => (
                    <React.Fragment key={subProduct.productSubTypeId}>
                      <TableRow>
                        <TableCell sx={{width: '19.30%', paddingLeft: 4 }}>
                            {subProduct.productAddonType && subProduct.productAddonType.length > 0 && (
                              <IconButton
                                data-testId={`astd-semi-product-subtype-expand-icon-934-${subProduct.productSubTypeId}`}
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleSubtypeOpen(subProduct.productSubTypeId)}
                              >
                                {subtypeOpen[subProduct.productSubTypeId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              </IconButton>
                            )}
                            {subProduct.productNameTchi || '-'}
                        </TableCell>
                        <TableCell sx={{ width: '19.30%', }} >{subProduct.productNameSchi || '-'}</TableCell>
                        <TableCell sx={{ width: '19.30%', }} >{subProduct.productNameEng || '-'}</TableCell>
                        <TableCell sx={{ width: '19.30%', }} >{subProduct.description || '-'}</TableCell>
                        <TableCell sx={{ width: '19.30%', }} >{subProduct.remark || '-'}</TableCell>
                        <TableCell sx={{ width: '12%', display: 'flex', justifyContent: 'flex-end'}} >
                          <Box display="flex" alignItems="center" gap="8px">
                            <IconButton data-testId={`astd-semi-product-subtype-edit-icon-471-${subProduct.productSubTypeId}`} aria-label="edit row" size="small" onClick={() => handleEditSubProduct(subProduct.productSubTypeId, products.productTypeId)}>
                              <EDIT_OUTLINED_ICON />
                            </IconButton>
                            <IconButton data-testId={`astd-semi-product-subtype-delete-icon-283-${subProduct.productSubTypeId}`} aria-label="delete row" size="small" onClick={() => handleDeleteSubProduct(subProduct.productSubTypeId, products.productTypeId)}>
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
                                <TableBody sx={{borderBottom: 0, backgroundColor: 'white' }}>
                                  {subProduct.productAddonType.map((addon: ProductAddon) => (
                                    <TableRow key={addon.productAddonTypeId}>
                                      <TableCell sx={{ borderBottom: 0, width: '19.30%', paddingLeft: 8 }}>{addon.productNameTchi || '-'}</TableCell>
                                      <TableCell sx={{ borderBottom: 0, width: '19.30%', }}>{addon.productNameSchi || '-'}</TableCell>
                                      <TableCell sx={{ borderBottom: 0, width: '19.30%', }}>{addon.productNameEng || '-'}</TableCell>
                                      <TableCell sx={{ borderBottom: 0, width: '19.30%', }}>{addon.description || '-'}</TableCell>
                                      <TableCell sx={{ borderBottom: 0, width: '19.30%', }}>{addon.remark || '-'}</TableCell>
                                      <TableCell sx={{ borderBottom: 0, width: '12%', display: 'flex', justifyContent: 'flex-end'}} >
                                        <Box display="flex" alignItems="center" gap="8px">
                                        <IconButton data-testId={`astd-semi-product-addon-edit-icon-708-${subProduct.productSubTypeId}`} aria-label="edit row" size="small" onClick={() => handleEditProductAddon(products.productTypeId, subProduct.productSubTypeId ,addon.productAddonTypeId )}>
                                            <EDIT_OUTLINED_ICON />
                                          </IconButton>
                                          <IconButton data-testId={`astd-semi-product-addon-delete-icon-525-${subProduct.productSubTypeId}`} aria-label="delete row" size="small" onClick={() => handleDeleteProductAddon(addon.productAddonTypeId, subProduct.productSubTypeId)}>
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
        productId={productId}
        initialSubCategory={initialSubCategory}
        productSubId={productSubId}
        isEditMode
        initialData={initialData}
        paramId={paramId}
        open={isOpenForm}
        handleClose={() => handleClose()}
        handleSubmit={() => {}}
      />
     <ConfirmDeleteModal
        open={openDelete}
        onClose={handleCloseDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default NestedTableRow;
