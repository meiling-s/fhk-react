export const inputSx = {
    input: {
      backgroundColor: 'white',
      borderRadius: '8px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#79CA25',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25',
      },
    },
  };


export const multilineInputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#79CA25'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#79CA25', 
    },
  },
  '& .MuiInputBase-multiline': {
    minHeight: '100px', 
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px',
  },
};

export const submitButtonStyles = {
  backgroundColor: '#79CA25', 
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold', 
  padding: '12px 32px', 
  borderRadius: '50px',
  '&:hover': {
    backgroundColor: 'darkgreen'
  },
};

export const cancelButtonStyles = {
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#79CA25',
  padding: '12px 32px', 
  borderRadius: '50px'
};

// autocompleteStyles.ts
export const autocompleteStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#79CA25',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#79CA25', 
    },
  },
  '& .MuiInputBase-input': {
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: '#79CA25',
  },
  '& .MuiAutocomplete-noOptions': {
    backgroundColor: 'white',
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: 'white',
  },
};
