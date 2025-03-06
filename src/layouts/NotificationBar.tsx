import { Box, Typography } from "@mui/material";
import { useContainer } from "unstated-next";
import NotifContainer from "../contexts/NotifContainer";
import CloseIcon from "@mui/icons-material/Close";
import i18n from "../setups/i18n";
import { useTranslation } from "react-i18next";
import { BroadcastMessage } from "../interfaces/notif";
import { styles } from "../constants/styles";

function NotificationBar() {
  const { broadcast, setMarginTop, setShowBroadcast, showBroadcast } =
    useContainer(NotifContainer);
  const { t } = useTranslation();

  if (!broadcast || !showBroadcast) {
    return null; // Hide component if there's no valid broadcast
  }

  i18n.addResourceBundle(
    "zhch",
    "translation",
    {
      broadcast: {
        title: broadcast.title_schi,
        content: broadcast.content_schi,
      },
    },
    true,
    true
  );
  i18n.addResourceBundle(
    "zhhk",
    "translation",
    {
      broadcast: {
        title: broadcast.title_tchi,
        content: broadcast.content_tchi,
      },
    },
    true,
    true
  );
  i18n.addResourceBundle(
    "enus",
    "translation",
    {
      broadcast: {
        title: broadcast.title_enus,
        content: broadcast.content_enus,
      },
    },
    true,
    true
  );

  const onCloseBroadcastMessage = () => {
    setMarginTop("0px");
    setShowBroadcast(false);
  };

  return (
    <Box sx={{ ...localStyle.broadcast, zIndex: 9999 }}>
      <Box sx={{ marginLeft: "30px", display: "flex", gap: 2 }}>
        <Typography style={{ fontSize: "13px", color: "#FFFFFF" }}>
          {t("broadcast.title")}
        </Typography>
        <Typography style={{ fontSize: "13px", color: "#FFFFFF" }}>
          {t("broadcast.content")}
        </Typography>
      </Box>
      <CloseIcon
        style={{ color: "#FFFFFF", marginRight: "30px" }}
        className="hover:cursor-pointer"
        onClick={onCloseBroadcastMessage}
      />
    </Box>
  );
}

const localStyle = {
  broadcast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "30px",
    width: "100%",
    backgroundColor: "#717171",
    position: "fixed",
    top: 0,
    left: 0,
  },
};

export default NotificationBar;
