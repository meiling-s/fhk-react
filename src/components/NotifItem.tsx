import { useTranslation } from 'react-i18next'
import CircleIcon from '@mui/icons-material/Circle'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography
} from '@mui/material'

const { t, i18n } = useTranslation()

type NotifItemProps = {
  key?: number
  handleItemClick?: () => void
  title?: string
  content?: string
  datetime?: string
}

const NotifItem: React.FC<NotifItemProps> = ({
  key,
  handleItemClick,
  title,
  content,
  datetime
}) => {
  return (
    <List key={key}>
      <ListItem onClick={() => handleItemClick}>
        <ListItemButton>
          <Stack>
            <Stack spacing={-2} direction="row" alignItems="center">
              <ListItemIcon style={{ color: 'red' }}>
                <CircleIcon sx={{ fontSize: '0.75rem' }} />
              </ListItemIcon>
              <Typography fontWeight="bold" sx={{ ml: '40px' }}>
                {/* {t('check_in.request_check_in')} */}
                {title}
              </Typography>
            </Stack>

            <Typography sx={{ ml: '40px' }}>{content}</Typography>

            <Typography sx={{ ml: '40px', mt: '10px' }}>
              {/* {checkIn.createdAt.toString()} */}
              {datetime}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default NotifItem
