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
      <Box
        sx={{
          width: 400, // Adjust the width as needed
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
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
              style={{ width: '175px', marginRight: '10px' }}
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
              style={{ width: '175px' }}
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
