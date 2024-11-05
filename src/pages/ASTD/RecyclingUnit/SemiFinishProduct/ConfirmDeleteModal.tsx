import React from 'react';
import { Modal, Box, Typography, Stack, Divider } from '@mui/material';
import CustomButton from '../../../../components/FormComponents/CustomButton';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  handleConfirmDelete: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onClose, handleConfirmDelete }) => {
  const { t } = useTranslation();

  // Custom styles for the modal
  const localstyles = {
    btn_WhiteGreenTheme: {
      borderRadius: '20px',
      borderWidth: 1,
      borderColor: '#79ca25',
      backgroundColor: 'white',
      color: '#79ca25',
      fontWeight: 'bold',
      '&.MuiButton-root:hover': {
        bgcolor: '#F4F4F4',
        borderColor: '#79ca25'
      }
    },
    modal: {
      width: 400,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    },
    headerText: {
      fontWeight: 'bold',
    },
    confirmButton: {
      width: '175px',
      marginRight: '10px',
    },
    cancelButton: {
      width: '175px',
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={localstyles.headerText}
            >
              {t('recycling_unit.confirm_delete')}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography>
              {t('common.deleteMessage')}
            </Typography>
          </Box>
          <Box sx={{ alignSelf: 'center' }}>
            <CustomButton
              text={t('check_in.confirm')}
              color="blue"
              style={localstyles.confirmButton}
              onClick={() => {
                handleConfirmDelete();
                onClose();
              }}
              dataTestId="astd-recyclable-confirm-delete-button-4166"
            />
            <CustomButton
              text={t('check_in.cancel')}
              color="blue"
              outlined
              style={localstyles.cancelButton}
              onClick={onClose}
              dataTestId="astd-recyclable-cancel-delete-button-4338"
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
