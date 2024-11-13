import React, { useState } from 'react';
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

import { ADD_ICON } from '../../../../themes/icons';
import SemiFinishProductForm from './SemiFinishProductForm';
import NestedTableRow from './NestedTableRow';
import CircularLoading from '../../../../components/CircularLoading';
import { ProductProvider, useProductContext } from './ProductContext';

const SemifinishProductTable = () => {
  const { t } = useTranslation();
  const { state: { products, loading, error }, refetch } = useProductContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (loading) return <CircularLoading />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="left" alignItems="center" my={2} mb={6}>
          <Typography fontSize="16px" marginRight="16px" fontWeight="bold">
            {t('settings_page.recycling.semi_finish_product')}
          </Typography>
          <Button
            data-testId="astd-semi-product-new-button-001"
            variant="outlined"
            color="primary"
            onClick={() => {
              setIsOpen(true)
              refetch()
            }}
            startIcon={<ADD_ICON />}
            sx={{ textTransform: 'uppercase', borderRadius: '24px', padding: '8px 24px', fontWeight: 'bold' }}
          >
            {t('top_menu.add_new')}
          </Button>
        </Box>
        <TableContainer>
          <Table aria-label="nested table" padding="none">
            <TableHead>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}>{t('common.traditionalChineseName')}</TableCell>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}>{t('common.simplifiedChineseName')}</TableCell>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}>{t('common.englishName')}</TableCell>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}>{t('settings_page.recycling.introduction')}</TableCell>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}>{t('settings_page.recycling.remarks')}</TableCell>
                <TableCell sx={{ borderBottom: 0, fontWeight: 'bold' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: 'white' }}>
              {products.map((product) => (
                <NestedTableRow key={product.productTypeId} products={product} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SemiFinishProductForm
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        handleSubmit={() => refetch()}
      />
    </>
  );
};

const SemiFinishProduct = () => (
  <ProductProvider>
    <SemifinishProductTable />
  </ProductProvider>
);

export default SemiFinishProduct;
