import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
} from '@mui/material';

import {ADD_ICON} from '../../../../themes/icons'
import { Products } from '../../../../types/settings';
import SemiFinishProductForm from './SemiFinishProductForm';
import NestedTableRow from './NestedTableRow';
import { getProductTypeList } from '../../../../APICalls/ASTD/settings/productType';
import CircularLoading from '../../../../components/CircularLoading';

const SemiFinishProduct = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await getProductTypeList();
      const fetchedProducts = response.data; 
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching product types:', err);
      setError('Failed to load product types.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  const onSuccess = () => {
    fetchProducts()
  }
 
  if (loading) return <CircularLoading/>
  if (error) return <p>{error}</p>;
 
  return (
    <>
      <Box>
      <Box display="flex" justifyContent="left" alignItems="center" my={2} mb={6}>
        <Typography fontSize="16px" marginRight="16px" fontWeight="bold">{t('settings_page.recycling.semi_finish_product')}</Typography>
        <Button
          data-testId="astd-semi-product-new-button-001"
          variant="outlined"
          color="primary"
          onClick={() => setIsOpen(true)}
          startIcon={<ADD_ICON />}
          sx={{ textTransform: 'upercase', borderRadius: '24px', padding: "8px 24px", fontWeight: "bold" }}
        >
          {t('top_menu.add_new')}
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label="nested table" padding="none">
          <TableHead>
            <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>{t('common.traditionalChineseName')}</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>{t('common.simplifiedChineseName')}</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>{t('common.englishName')}</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>{t('settings_page.recycling.introduction')}</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>{t('settings_page.recycling.remarks')}</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{backgroundColor: 'white'}}>
            {products.map((product: Products) => (
              <NestedTableRow key={product.productTypeId} products={product} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
      <SemiFinishProductForm onSuccess={() => onSuccess()} open={isOpen} handleClose={() => setIsOpen(false)} handleSubmit={() => {}}/>
    </>
  );
};

export default SemiFinishProduct;
