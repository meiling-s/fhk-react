import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getThemeCustomList } from '../../utils/utils';
import { localStorgeKeyName } from '../../constants/constant';

interface SelectionProps {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

const Selection: React.FC<SelectionProps> = ({ label, options, selected, onSelect }) => {
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelect(option)}
            sx={{
              borderRadius: '20px',
              border: `1px solid ${selected === option ? customListTheme.border : '#ddd'}`,
              backgroundColor: selected === option ? customListTheme.bgColor : '#fff',
              color: selected === option ? '#4caf50' : '#333',
              padding: '5px 20px',
              minWidth: '60px',
              '&:hover': {
                backgroundColor: selected === option ? '#e8f5e9' : '#f0f0f0',
              },
            }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Selection;