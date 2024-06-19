import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LANGUAGE_ICON, NOTIFICATION_ICON } from '../themes/icons'
import BackgroundLetterAvatars from '../components/CustomAvatar'
import { useNavigate } from 'react-router-dom'
import { localStorgeKeyName } from '../constants/constant'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { CheckIn } from '../interfaces/checkin'
import RequestForm from '../components/FormComponents/RequestForm'
import NotifItem from '../components/NotifItem'
import NotifContainerContext from '../contexts/NotifContainer'
import { useContainer } from 'unstated-next'
import ChangePasswordBase from '../pages/Auth/ChangePasswordBase'
import { updateFlagNotif } from '../APICalls/notify'
import { setLanguage } from '../setups/i18n'
import { returnApiToken } from '../utils/utils'
import { Notif } from '../interfaces/notif'

const MainAppBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<CheckIn>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const drawerWidth = 246
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { numOfNotif, notifList, updateNotifications, setNumOfNotif, setNotifList, broadcast } = useContainer(
    NotifContainerContext
  )
  const { loginId } = returnApiToken()

  useEffect(() => {
    updateNotifications(loginId)
  }, [loginId])
 
  const handleLanguageChange = (lng: string) => {
    console.log('change language: ', lng)
    i18n.changeLanguage(lng)
    setLanguage(lng)
  }

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvatar(event.currentTarget)
    localStorage.setItem(localStorgeKeyName.firstTimeLogin, 'false')
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleItemClick = (checkIn: CheckIn) => {
    // Store the selected item's content or perform any actions
    setOpenModal(true)
    console.log(checkIn)
    setSelectedItem(checkIn)
  }
  const handleCloses = () => {
    setOpenModal(false)
  }

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
  }
  const handleLogout = () => {
    console.log("on logout")
    setNumOfNotif(0)
    setNotifList([])
    localStorage.clear()
    navigate('/')
  }

  const handlePasswordChangeSuccess = () => {
    localStorage.setItem(localStorgeKeyName.firstTimeLogin, 'false')
    setShowChangePasswordModal(false)
    setShowSuccessModal(true)
  }

  const handleClickNotif = async (notifId: number) => {
    console.log('handleClickNotif', notifId)
    const result = await updateFlagNotif(notifId)
    const data = result?.data
    if (data) {
      await updateNotifications(loginId)
    }
  }

  const onClickNotif = (notif: Notif) => {
    if(notif.messageType !== 'broadcast'){
      handleClickNotif(notif.notiRecordId)
    }
  }

  return (
    //<Box flexDirection={"row"} sx={{ flexGrow: 1 }}>
    <AppBar
      elevation={5}
      position="fixed"
      sx={{
        width: `calc(100% - ${isMobile ? 0 : drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        marginTop: `${broadcast ? '30px': ''}`
      }}
    >
      <Toolbar
        style={{ background: 'white' }}
        sx={{ height: { sm: '100px', lg: '64px' } }}
      >
        <Box
          display="flex"
          sx={{ ml: 5, width: { sm: '50%', lg: '20%' } }}
        ></Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex' }}>
          <IconButton onClick={toggleDrawer}>

            {/* {numOfNotif !== 0 && (
              <Badge badgeContent={numOfNotif.toString()} color="error">
                <NOTIFICATION_ICON />
              </Badge>
            )} */}
            {numOfNotif === 0 ? <NOTIFICATION_ICON /> : <Badge badgeContent={numOfNotif.toString()} color="error"> <NOTIFICATION_ICON /></Badge>}

            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
              <Box className="md:w-[500px] w-[100vw]">
                <Box display="flex" p={4} alignItems="center">
                  <Typography
                    fontSize={20}
                    fontWeight="bold"
                    sx={{ mr: '10px' }}
                  >
                    {t('appBar.notify')}
                  </Typography>
                  {numOfNotif !== 0 && (
                    <BackgroundLetterAvatars
                      name={numOfNotif.toString()!}
                      size={23}
                      backgroundColor="red"
                      fontColor="white"
                      fontSize="15px"
                      isBold={true}
                    />
                  )}
                </Box>
                <Divider />
                {notifList?.map((notif) => (
                  <NotifItem
                    notifId={notif.notiRecordId}
                    title={notif.title}
                    content={notif.content}
                    datetime={notif.createdAt}
                    handleItem={() => onClickNotif(notif)}
                    readFlg={notif.readFlg}
                  ></NotifItem>
                ))}
              </Box>
            </Drawer>
            {selectedItem && (
              <Modal open={openModal} onClose={handleCloses}>
                <RequestForm
                  onClose={handleCloses}
                  selectedItem={selectedItem}
                />
              </Modal>
            )}
            {/* </Badge> */}
          </IconButton>
          <IconButton
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <LANGUAGE_ICON />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl ? true : false}
            onClose={handleClose}
            TransitionComponent={Fade}
            style={{ padding: '16px' }}
          >
            <MenuItem
              divider={true}
              onClick={() => handleLanguageChange('zhch')}
            >
              <Typography>{t('appBar.simplified_cn')}</Typography>
            </MenuItem>
            <MenuItem
              divider={true}
              onClick={() => handleLanguageChange('zhhk')}
            >
              <Typography>{t('appBar.traditional_cn')}</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('enus')}>
              <Typography>{t('appBar.english')}</Typography>
            </MenuItem>
          </Menu>
          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
            <IconButton
              onClick={handleClickAvatar}
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <BackgroundLetterAvatars
                name="Cawin Pan"
                backgroundColor="#79ca25"
              />
            </IconButton>
            <Menu
              anchorEl={anchorElAvatar}
              open={anchorElAvatar ? true : false}
              onClose={() => setAnchorElAvatar(null)}
              TransitionComponent={Fade}
              style={{ padding: '16px' }}
            >
              <MenuItem
                divider={true}
                onClick={() => setShowChangePasswordModal(true)}
              >
                <Typography>{t('changePassword')}</Typography>
              </MenuItem>
              <MenuItem divider={true} onClick={() => handleLogout()}>
                <Typography>{t('signOut')}</Typography>
              </MenuItem>
            </Menu>
            {/* <Box flexDirection={"column"} sx={{ flex: 3.5, pt: 0.4 }}>
              <Typography sx={{ flex: 1, color: "black", fontWeight: "bold" }}>
                {localStorage.getItem(localStorgeKeyName.username)}
              </Typography>
              <Button
                onClick={() => navigate("/")}
                sx={{
                  flex: 1,
                  color: "black",
                  justifyContent: "flex-start",
                  width: "100%",
                  padding: 0,
                }}
                endIcon={<RIGHT_ARROW_ICON />}
              >
                {t("signOut")}
              </Button>
            </Box> */}
          </Box>
        </Box>
        <div>
          <Modal
            id="change-pass"
            open={showChangePasswordModal}
            onClose={() => setShowChangePasswordModal(false)}
          >
            <Box sx={modalStyle}>
              <ChangePasswordBase onSuccess={handlePasswordChangeSuccess} />
            </Box>
          </Modal>
          {showSuccessModal && (
            <Modal id="success-modal" open={showSuccessModal}>
              <Box sx={modalStyle}>
                <Typography>{t('changePasswordConfirmation')}</Typography>
                <Button
                  className="float-right"
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: '#79ca25',
                    '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
                    height: '40px'
                  }}
                  variant="contained"
                  onClick={handleSuccessModalClose}
                >
                  Ok
                </Button>
              </Box>
            </Modal>
          )}
        </div>
      </Toolbar>
    </AppBar>

    ////</Box>
  )
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

export default MainAppBar
