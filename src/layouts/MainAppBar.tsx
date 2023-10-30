import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  LANGUAGE_ICON,
  NOTIFICATION_ICON,
  RIGHT_ARROW_ICON,
  SEARCH_ICON,
} from "../themes/icons";
import BackgroundLetterAvatars from "../components/CustomAvatar";
import { useNavigate } from "react-router-dom";


const MainAppBar = () => {

  const [keywords, setKeywords] = useState<string>("");
  const navigate = useNavigate();
  const drawerWidth = 246;

  const onKeywordsChange = (k: string) => {
    setKeywords(k);
  };

  return (
    //<Box flexDirection={"row"} sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={5}
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar style={{ background: "white" }}>
          <Box display="flex" width="20%" sx={{ ml: 5 }}>
            <TextField
              size="small"
              value={keywords}
              onChange={(e) => onKeywordsChange(e.target.value)}
              placeholder="輸入關鍵字查詢"
              sx={{
                "& fieldset": {
                  display: "none",
                },
                flexGrow: 1,
              }}
              InputProps={{
                style: { borderRadius: "10px", backgroundColor: "#f4f4f4" },

                startAdornment: (
                  <InputAdornment position="start">
                    <SEARCH_ICON />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton>
              <NOTIFICATION_ICON />
            </IconButton>
            <IconButton sx={{ ml: 3 }}>
              <LANGUAGE_ICON />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "row", ml: 3 }}>
              <IconButton>
                <BackgroundLetterAvatars name="Cawin Pan" />
              </IconButton>
              <Box flexDirection={"column"} sx={{ flex: 3.5, pt: 0.4 }}>
                <Typography
                  sx={{ flex: 1, color: "black", fontWeight: "bold" }}
                >
                  {" "}
                  collectionpointadmin
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
                  登出
                </Button>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
   ////</Box>
  );
};

export default MainAppBar;
