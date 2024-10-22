import React, {useState} from 'react';
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

import {
    ADD_ICON,
 
  } from '../../../../themes/icons'
import SemiFinishProductForm from './SemiFinishProductForm';
import NestedTableRow from './NestedTableRow';

type Products = {
  id: number;
  traditionalName: string;
  simplifiedName: string;
  englishName: string;
  subProducts?: Products[];
};

type SemiFinishProductProps = {
    handleClick: () => void
}

const data: Products[] = [
  {
    id: 1,
    traditionalName: '1号胶',
    simplifiedName: '1号胶',
    englishName: 'No. 1 glue',
    subProducts: [
      {
        id: 2,
        traditionalName: '水沟',
        simplifiedName: '水瓶子',
        englishName: 'Water Bottle',
        subProducts: [
          { id: 3, traditionalName: '500ml', simplifiedName: '-', englishName: '-' },
          { id: 4, traditionalName: '菲林', simplifiedName: '-', englishName: '-' },
        ],
      },
    ],
  },
  {
    id: 5,
    traditionalName: '2号胶',
    simplifiedName: '2号胶',
    englishName: 'No. 2 glue',
    subProducts: [],
  },
  {
    id: 6,
    traditionalName: '其他',
    simplifiedName: '-',
    englishName: '-',
    subProducts: [],
  },
];


const SemiFinishProduct: React.FC<SemiFinishProductProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <Box>
      <Box display="flex" justifyContent="left" alignItems="center" my={2}>
        <Typography variant="h6" marginRight="16px" fontWeight="bold">半製成品・產品類別</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsOpen(true)}
          startIcon={<ADD_ICON />}
          sx={{ textTransform: 'none', borderRadius: '24px', padding: "8px 24px", fontWeight: "bold" }}
        >
          新增
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label="nested table">
          <TableHead>
            <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>繁體中文名稱</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>简体中文名称</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>English Name</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>簡介</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}>備註</TableCell>
              <TableCell sx={{borderBottom: 0, fontWeight: 'bold'}}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{backgroundColor: 'white'}}>
            {data.map((product) => (
              <NestedTableRow key={product.id} products={product} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
      <SemiFinishProductForm open={isOpen} handleClose={() => setIsOpen(false)} handleSubmit={() => {}}/>
    </>
  );
};

export default SemiFinishProduct;
