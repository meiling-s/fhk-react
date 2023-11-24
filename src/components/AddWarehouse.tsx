import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "./RightOverlayForm";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switcher from "./Switcher";
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
    const RecycleCategory = ["請輸入重量", "紙皮", "請輸入重量"];
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
                                <FormControl
                                    fullWidth
                                    sx={{ m: 1 }}
                                    variant="standard"
                                >
                                    <TextField
                                        fullWidth
                                        placeholder={item.placeholder}
                                        id={`fullWidth-${index}`}
                                        InputLabelProps={{ shrink: false }}
                                    />
                                </FormControl>
                            </div>
                        ))}
                        {/* <Switcher /> */}
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
                            <div className="relative tracking-[1px] leading-[20px] text-left">
                                {t("warehouse_page.location")}
                            </div>
                            <Switcher />
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
                            <div className="relative text-smi tracking-[1px] leading-[20px] text-grey-middle text-left">
                                {t("col.contractNo")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start">
                                <div className="self-stretch flex flex-row items-center justify-start gap-[8px]">
                                    <FormControl
                                        fullWidth
                                        sx={{ m: 1 }}
                                        variant="standard"
                                    >
                                        <TextField
                                            fullWidth
                                            placeholder={t("col.enterNo")}
                                            id="fullWidth"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                    <REMOVE_CIRCLE_ICON
                                        fontSize="small"
                                        className="text-grey-light"
                                    />
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start">
                                <div className="self-stretch flex flex-row items-center justify-start gap-[8px]">
                                    <div className="rounded-xl bg-white box-border w-[120px] overflow-hidden shrink-0 hidden flex-row items-center justify-between py-[15px] px-5 border-[1px] border-solid border-grey-line">
                                        <img
                                            className="relative w-6 h-6 overflow-hidden shrink-0 hidden"
                                            alt=""
                                            src="/search2.svg"
                                        />
                                        <div className="relative tracking-[1.5px] leading-[20px]">
                                            金屬
                                        </div>
                                        <img
                                            className="relative w-6 h-6 overflow-hidden shrink-0"
                                            alt=""
                                            src="/chevrondown5.svg"
                                        />
                                    </div>
                                    <FormControl
                                        fullWidth
                                        sx={{ m: 1 }}
                                        variant="standard"
                                    >
                                        <TextField
                                            fullWidth
                                            placeholder={t("col.enterNo")}
                                            id="fullWidth"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                    <ADD_CIRCLE_ICON
                                        fontSize="small"
                                        className="text-green-primary"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
                            <div className="relative tracking-[1px] leading-[20px]">
                                {t("warehouse_page.place")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-center text-mini text-grey-darker">
                                <FormControl
                                    fullWidth
                                    sx={{ m: 1 }}
                                    variant="standard"
                                >
                                    <TextField
                                        fullWidth
                                        multiline
                                        placeholder={t("col.enterNo")}
                                        id="fullWidth"
                                        rows={4}
                                        InputLabelProps={{ shrink: false }}
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
                            <Switcher />
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
                            <div className="relative tracking-[1px] leading-[20px]">
                                {t("warehouse_page.recyclable_subcategories")}
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
                                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                                    <div className="w-full flex">
                                        {RecycleCategory.map((item, index) => (
                                            <FormControl
                                                key={index}
                                                sx={{ m: 1, width: "100%" }}
                                            >
                                                <InputLabel
                                                    id={`demo-simple-select-label-${index}`}
                                                >
                                                    {item}
                                                </InputLabel>
                                                <Select
                                                    labelId={`demo-simple-select-label-${index}`}
                                                    id={`demo-simple-select-${index}`}
                                                    value=""
                                                    label={item}
                                                >
                                                    <MenuItem value={10}>
                                                        Ten
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Twenty
                                                    </MenuItem>
                                                    <MenuItem value={30}>
                                                        Thirty
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        ))}
                                    </div>
                                    <REMOVE_CIRCLE_ICON
                                        fontSize="small"
                                        className="text-grey-light"
                                    />
                                </div>
                                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                                    <div className="w-full flex">
                                        {RecycleCategory.map((item, index) => (
                                            <FormControl
                                                key={index}
                                                sx={{ m: 1, width: "100%" }}
                                            >
                                                <InputLabel
                                                    id={`demo-simple-select-label-${index}`}
                                                >
                                                    {item}
                                                </InputLabel>
                                                <Select
                                                    labelId={`demo-simple-select-label-${index}`}
                                                    id={`demo-simple-select-${index}`}
                                                    value=""
                                                    label={item}
                                                >
                                                    <MenuItem value={10}>
                                                        Ten
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Twenty
                                                    </MenuItem>
                                                    <MenuItem value={30}>
                                                        Thirty
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        ))}
                                    </div>
                                    <ADD_CIRCLE_ICON
                                        fontSize="small"
                                        className="text-green-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RightOverlayForm>
        </div>
    );
};

export default AddWarehouse;
