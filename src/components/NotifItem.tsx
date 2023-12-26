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
import dayjs from 'dayjs'
import { format } from '../constants/constant'

type NotifItemProps = {
  notifId: number
  handleItem: () => void
  title?: string
  content?: string
  datetime?: string
}

const NotifItem: React.FC<NotifItemProps> = ({
  notifId,
  handleItem,
  title,
  content,
  datetime
}) => {
  const createdDate = datetime
    ? dayjs(new Date(datetime)).format(format.dateFormat1)
    : '-'

  const onClickItem = () => {
    if (handleItem) {
      handleItem()
    }
  }

  return (
    <List key={notifId}>
      <ListItem onClick={() => onClickItem}>
        <ListItemButton>
          <Stack>
            <Stack spacing={-2} direction="row" alignItems="center">
              <ListItemIcon style={{ color: 'red' }}>
                <CircleIcon sx={{ fontSize: '0.75rem' }} />
              </ListItemIcon>
              <Typography fontWeight="bold" sx={{ ml: '40px' }}>
                {title}
              </Typography>
            </Stack>

            <Typography sx={{ ml: '40px' }}>{content}</Typography>

            <Typography sx={{ ml: '40px', mt: '10px' }}>
              {createdDate}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default NotifItem
