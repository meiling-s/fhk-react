import React from "react";
import Switch from "@mui/joy/Switch";
import Typography from "@mui/joy/Typography";

const Switcher = () => {
    return (
        <div>
            <Switch
                slotProps={{
                    track: {
                        children: (
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    level="inherit"
                                    sx={{ ml: "10px" }}
                                >
                                    是
                                </Typography>
                                <Typography
                                    component="span"
                                    level="inherit"
                                    sx={{ mr: "10px" }}
                                >
                                    否
                                </Typography>
                            </React.Fragment>
                        ),
                    },
                }}
                sx={{
                    // "--Switch-thumbRadius": "24px",
                    // "--Switch-thumbWidth": "65px",
                    // "--Switch-thumbOffset": "9px",
                    // "--Switch-thumbSize": "44px",
                    // "--Switch-trackHeight": "52px",
                    // "--Switch-trackWidth": "120px",
                    // "--Switch-trackRadius": "22px",
                    "--Switch-thumbSize": "30px",
                    "--Switch-trackWidth": "67px",
                    "--Switch-trackHeight": "34px",
                }}
            />
        </div>
    );
};

export default Switcher;
