import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "./RightOverlayForm";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import Switcher from './Switcher'
import Switcher from "./FormComponents/CustomSwitch";
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from "../themes/icons";
import { useTranslation } from "react-i18next";

interface AddWarehouseProps {
    drawerOpen: boolean;
    handleDrawerClose: () => void;
    action?: "add" | "edit" | "delete";
    onSubmitData?: (
        formData: WarehouseFormData,
        type: string,
        id?: "string"
    ) => void;
    rowId?: string;
}

interface WarehouseFormData {
    id: string;
    traditionalName: string;
    simplifiedName: string;
    englishName: string;
    location: string;
    place: string;
    status: string;
    recyclableSubcategories: string;
}

const AddWarehouse: FunctionComponent<AddWarehouseProps> = ({
    drawerOpen,
    handleDrawerClose,
    action = "add",
    onSubmitData,
    rowId,
}) => {
    const { t } = useTranslation();
    const [switchState, setSwitchState] = useState(false);
    const initContactNumber: { contact_number: string }[] = [
        { contact_number: "" },
        { contact_number: "" },
    ];

    const FormData1_3 = [
        {
            label: t("warehouse_page.trad_name"),
            placeholder: t("add_warehouse_page.type_name"),
        },
        {
            label: t("warehouse_page.simp_name"),
            placeholder: t("add_warehouse_page.type_name"),
        },
        {
            label: t("warehouse_page.english_name"),
            placeholder: "Please type a name",
        },
    ];

    // get opion RecyleCategory form api
    const recycleType = ["請輸入重量", "紙皮", "請輸入重量"];
    const subType = ["請輸入重量 1", "紙皮 2", "請輸入重量 3"];

    const initRecyleCategory: {
        recyle_type: string;
        subtype: string;
        weight: string;
    }[] = [
        {
            recyle_type: "",
            subtype: "",
            weight: "",
        },
        {
            recyle_type: "",
            subtype: "",
            weight: "",
        },
    ];

    const [contactNumber, setContactNumber] =
        useState<{ contact_number: string }[]>(initContactNumber);

    const [recycleCategory, setRecycleCategory] =
        useState<{ recyle_type: string; subtype: string; weight: string }[]>(
            initRecyleCategory
        );

    const handleRemoveContact = (indexToRemove: number) => {
        const updatedContactNumber = contactNumber.filter(
            (_, index) => index !== indexToRemove
        );
        setContactNumber(updatedContactNumber);
    };

    const handleAddContact = () => {
        const updatedContactNumber = [...contactNumber, { contact_number: "" }];
        setContactNumber(updatedContactNumber);
    };

    const handleAddReycleCategory = () => {
        const updatedrecycleCategory = [
            ...recycleCategory,
            { recyle_type: "", subtype: "", weight: "" },
        ];
        setRecycleCategory(updatedrecycleCategory);
    };

    const handleRemoveReycleCategory = (indexToRemove: number) => {
        const updatedRecycleCategory = recycleCategory.filter(
            (_, index) => index !== indexToRemove
        );
        setRecycleCategory(updatedRecycleCategory);
    };

    const [age, setAge] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    const handleSubmit = () => {
        const formData = {
            id: "5",
            traditionalName: "New Warehouse",
            simplifiedName: "New Simplified Warehouse",
            englishName: "New English Warehouse",
            location: "Yes",
            place: "New Warehouse Location",
            status: "activated",
            recyclableSubcategories: "New Recyclable Categories",
        };
        if (
            onSubmitData &&
            typeof onSubmitData === "function" &&
            typeof rowId === "string"
        ) {
            onSubmitData(formData, action, rowId as "string");
        }
        handleDrawerClose();
    };

    return (
        <div className="add-warehouse">
            <RightOverlayForm
                open={drawerOpen}
                onClose={handleDrawerClose}
                anchor={"right"}
                action={action}
                headerProps={{
                    title: t("top_menu.add_new"),
                    subTitle: t("top_menu.workshop"),
                    submitText: t("add_warehouse_page.save"),
                    cancelText: t("add_warehouse_page.delete"),
                    onCloseHeader: handleDrawerClose,
                    onSubmit: handleSubmit,
                    onDelete: handleSubmit,
                }}
            >
                {/* child / or centent RightOverlayForm */}
                <div
                    style={{ borderTop: "1px solid lightgrey" }}
                    className="form-container"
                >
                    <div className="self-stretch flex flex-col items-start justify-start pt-[25px] px-[25px] pb-[75px] gap-[25px] text-left text-smi text-grey-middle">
                        {FormData1_3.map((item, index) => (
                            <div
                                key={index}
                                className="self-stretch flex flex-col items-start justify-center gap-2"
                            >
                                <div className="relative tracking-1px leading-20px text-left">
                                    {item.label}
                                </div>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        placeholder={item.placeholder}
                                        id={`fullWidth-${index}`}
                                        InputLabelProps={{ shrink: false }}
                                        InputProps={{
                                            sx: styles.textField,
                                        }}
                                        sx={styles.inputState}
                                        disabled={action === "delete"}
                                    />
                                </FormControl>
                            </div>
                        ))}
                        {/* <Switcher /> */}
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
                            <div className="relative tracking-[1px] leading-[20px] text-left">
                                {t("warehouse_page.location")}
                            </div>
                            {/* <Switcher /> */}
                            <Switcher
                                onText={t("add_warehouse_page.yes")}
                                offText={t("add_warehouse_page.no")}
                                defaultValue={switchState}
                                setState={(newValue) => {
                                    setSwitchState(newValue); // Update the state in your parent component
                                }}
                            />
                        </div>
                        {/* contact number */}
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
                            <div className="relative text-smi tracking-[1px] leading-[20px] text-grey-middle text-left">
                                {t("col.contractNo")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start">
                                <div className="self-stretch ">
                                    {contactNumber.map((item, index) => (
                                        <div className="flex flex-row items-center justify-start gap-[8px] mb-2">
                                            <FormControl
                                                fullWidth
                                                variant="standard"
                                            >
                                                <TextField
                                                    fullWidth
                                                    placeholder={t(
                                                        "col.enterNo"
                                                    )}
                                                    id="fullWidth"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    InputProps={{
                                                        sx: styles.textField,
                                                    }}
                                                    sx={styles.inputState}
                                                    disabled={
                                                        action === "delete"
                                                    }
                                                />
                                            </FormControl>
                                            {index ===
                                            contactNumber.length - 1 ? (
                                                <ADD_CIRCLE_ICON
                                                    fontSize="small"
                                                    className="text-green-primary cursor-pointer"
                                                    onClick={handleAddContact}
                                                />
                                            ) : (
                                                index !==
                                                    contactNumber.length -
                                                        1 && (
                                                    <REMOVE_CIRCLE_ICON
                                                        fontSize="small"
                                                        className={`text-grey-light ${
                                                            contactNumber.length ===
                                                            1
                                                                ? "cursor-not-allowed"
                                                                : "cursor-pointer"
                                                        } `}
                                                        onClick={() =>
                                                            handleRemoveContact(
                                                                index
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
                            <div className="relative tracking-[1px] leading-[20px]">
                                {t("warehouse_page.place")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-center text-mini text-grey-darker">
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        multiline
                                        placeholder={t("col.enterNo")}
                                        id="fullWidth"
                                        rows={4}
                                        InputLabelProps={{ shrink: false }}
                                        InputProps={{
                                            sx: styles.textArea,
                                        }}
                                        sx={styles.inputState}
                                        disabled={action === "delete"}
                                    />
                                </FormControl>
                                <div className="self-stretch rounded-xl bg-white overflow-hidden hidden flex-row items-center justify-between py-[15px] px-5 text-grey-middle border-[1px] border-solid border-grey-line">
                                    <img
                                        className="relative w-6 h-6 overflow-hidden shrink-0 hidden"
                                        alt=""
                                        src="/search2.svg"
                                    />
                                    <div className="relative tracking-[1.5px] leading-[20px]">
                                        請輸入回收地點
                                    </div>
                                    <img
                                        className="relative w-6 h-6 overflow-hidden shrink-0"
                                        alt=""
                                        src="/location.svg"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-6xl bg-green-primary overflow-hidden hidden flex-row items-center justify-center py-2 px-5 gap-[5px] text-center text-white">
                            <img
                                className="relative w-[18px] h-[18px] hidden"
                                alt=""
                                src="/vuesaxlinearadd4.svg"
                            />
                            <b className="relative tracking-[1px] leading-[20px]">
                                確定
                            </b>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
                            <div className="relative tracking-[1px] leading-[20px] text-left">
                                {t("warehouse_page.status")}
                            </div>
                            {/* <Switcher /> */}
                            <Switcher
                                onText={t("add_warehouse_page.open")}
                                offText={t("add_warehouse_page.close")}
                                defaultValue={switchState}
                                setState={(newValue) => {
                                    setSwitchState(newValue); // Update the state in your parent component
                                }}
                            />
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
                            <div className="relative tracking-[1px] leading-[20px]">
                                {t("warehouse_page.recyclable_subcategories")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
                                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                                    <div className="w-full ">
                                        {recycleCategory.map((item, index) => (
                                            <div className="flex justify-center items-center gap-2 mb-2">
                                                <FormControl
                                                    sx={{ m: 1, width: "100%" }}
                                                >
                                                    <Select
                                                        value={age}
                                                        onChange={handleChange}
                                                        displayEmpty
                                                        disabled={
                                                            action === "delete"
                                                        }
                                                        inputProps={{
                                                            "aria-label":
                                                                "Without label",
                                                        }}
                                                        sx={{
                                                            borderRadius:
                                                                "12px", // Adjust the value as needed
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {recycleType.map(
                                                            (item, index) => (
                                                                <MenuItem
                                                                    value={10}
                                                                >
                                                                    {item}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <FormControl
                                                    sx={{ m: 1, width: "100%" }}
                                                >
                                                    <Select
                                                        value={age}
                                                        onChange={handleChange}
                                                        displayEmpty
                                                        disabled={
                                                            action === "delete"
                                                        }
                                                        inputProps={{
                                                            "aria-label":
                                                                "Without label",
                                                        }}
                                                        sx={{
                                                            borderRadius:
                                                                "12px", // Adjust the value as needed
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {subType.map(
                                                            (item, index) => (
                                                                <MenuItem
                                                                    value={10}
                                                                >
                                                                    {item}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <FormControl
                                                    fullWidth
                                                    variant="standard"
                                                >
                                                    <OutlinedInput
                                                        fullWidth
                                                        id="outlined-adornment-weight"
                                                        placeholder={t(
                                                            "col.enterNo"
                                                        )}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                kg
                                                            </InputAdornment>
                                                        }
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            "aria-label":
                                                                "weight",
                                                            sx: styles.textField,
                                                        }}
                                                        sx={styles.textField}
                                                        disabled={
                                                            action === "delete"
                                                        }
                                                    />
                                                </FormControl>
                                                {index ===
                                                recycleCategory.length - 1 ? (
                                                    <ADD_CIRCLE_ICON
                                                        fontSize="small"
                                                        className="text-green-primary cursor-pointer"
                                                        onClick={
                                                            handleAddReycleCategory
                                                        }
                                                    />
                                                ) : (
                                                    index !==
                                                        recycleCategory.length -
                                                            1 && (
                                                        <REMOVE_CIRCLE_ICON
                                                            fontSize="small"
                                                            className={`text-grey-light ${
                                                                contactNumber.length ===
                                                                1
                                                                    ? "cursor-not-allowed"
                                                                    : "cursor-pointer"
                                                            } `}
                                                            onClick={() =>
                                                                handleRemoveReycleCategory(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RightOverlayForm>
        </div>
    );
};

let styles = {
    textField: {
        borderRadius: "10px",
        fontWeight: "500",
        "& .MuiOutlinedInput-input": {
            padding: "15px 20px",
            margin: 0,
        },
    },
    textArea: {
        borderRadius: "10px",
        fontWeight: "500",
        "& .MuiOutlinedInput-input": {
            padding: 0,
            margin: 0,
        },
    },
    inputState: {
        "& .MuiOutlinedInput-root": {
            margin: 0,
            "&:not(.Mui-disabled):hover fieldset": {
                borderColor: "#79CA25",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#79CA25",
            },
        },
    },
    dropDown: {
        "& .MuiOutlinedInput-root-MuiSelect-root": {
            borderRadius: "10px",
        },
    },
};

export default AddWarehouse;
