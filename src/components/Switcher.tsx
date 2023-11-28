import React, { useState } from "react";

// import Switch from '@mui/material/Switch'
import Switch from "@mui/joy/Switch";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// import { green } from "@mui/material/colors";
// import CheckIcon from "@mui/icons-material/Check";

const Switcher = () => {
    // const [isPhysicalLocation, setIsPhysicalLocation] = useState(false);
    // const [isConfirmed, setIsConfirmed] = useState(false);

    // const handleLocationChange = () => {
    //     setIsPhysicalLocation((prevValue) => !prevValue);
    // };

    // const handleConfirmation = () => {
    //     setIsConfirmed(true); // Logic for confirmation
    // };
    //need adjust the layout
    return (
        <div>
            {/* <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center"> */}
            {/* <div className="rounded-61xl flex flex-row items-start justify-start p-1 gap-[8px] text-mini text-grey-dark"> */}
            {/* <Switch
          checked={isPhysicalLocation}
          onChange={handleLocationChange}
          color="primary"
          inputProps={{ 'aria-label': 'physical location switch' }}
        /> */}
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
        //     </div>
        // </div>
    );
};

export default Switcher;
