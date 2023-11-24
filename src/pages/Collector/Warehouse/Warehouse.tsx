import { FunctionComponent, useCallback, ReactNode, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { useNavigate } from 'react-router-dom'
import { Box } from "@mui/material";
import { ADD_ICON } from "../../../themes/icons";
import AddWarehouse from "../../../components/AddWarehouse";
import TableBase from "../../../components/TableBase";
import { useTranslation } from "react-i18next";

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

type TableRow = {
    [key: string]: string | number | null;
};

const Warehouse: FunctionComponent = () => {
    // const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [action, setAction] = useState<"add" | "edit" | "delete">("add");
    const [rowId, setRowId] = useState<string>("1");
    const [warehouseItems, setWarehouseItems] = useState([
        {
            id: "1",
            traditionalName: "火炭",
            simplifiedName: "火炭",
            englishName: "Fo Tan 1",
            location: "是",
            place: "火炭拗背灣街14號",
            status: "activated",
            recyclableSubcategories: "紙張、金屬、塑膠、玻璃樽",
        },
        {
            id: "2",
            traditionalName: "火炭",
            simplifiedName: "火炭",
            englishName: "Fo Tan 2",
            location: "是",
            place: "火炭拗背灣街14號",
            status: "activated",
            recyclableSubcategories: "紙張、金屬、塑膠、玻璃樽",
        },
        {
            id: "3",
            traditionalName: "火炭",
            simplifiedName: "火炭",
            englishName: "Fo Tan 3",
            location: "是",
            place: "火炭拗背灣街14號",
            status: "activated",
            recyclableSubcategories: "紙張、金屬、塑膠、玻璃樽",
        },
        {
            id: "4",
            traditionalName: "火炭",
            simplifiedName: "火炭",
            englishName: "Fo Tan 4",
            location: "是",
            place: "火炭拗背灣街14號",
            status: "deleted",
            recyclableSubcategories: "紙張、金屬、塑膠、玻璃樽",
        },
    ]);
    const headerTitles = [
        {
            type: "string",
            field: "traditionalName",
            label: t("warehouse_page.trad_name"),
            width: 150,
        },
        {
            type: "string",
            field: "simplifiedName",
            label: t("warehouse_page.simp_name"),
            width: 150,
        },
        {
            type: "string",
            field: "englishName",
            label: t("warehouse_page.english_name"),
            width: 150,
        },
        {
            type: "string",
            field: "location",
            label: t("warehouse_page.location"),
            width: 100,
        },
        {
            type: "string",
            field: "place",
            label: t("warehouse_page.place"),
            width: 100,
        },
        {
            type: "status",
            field: "status",
            label: t("warehouse_page.status"),
            width: 100,
        },
        {
            type: "string",
            field: "recyclableSubcategories",
            label: t("warehouse_page.recyclable_subcategories"),
            width: 200,
        },
    ];

    const addDataWarehouse = () => {
        setDrawerOpen(true);
        setAction("add");
    };

    const handleEdit = (type: string, row: TableRow) => {
        setRowId(row.id as string);
        setDrawerOpen(true);
        setAction("edit");
    };

    const handleDelete = (type: string, row: TableRow) => {
        setDrawerOpen(true);
        setAction("delete");
        setRowId(row.id as string);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleOnSubmitData = (
        formData: WarehouseFormData,
        action: string,
        id?: string
    ) => {
        if (action == "add") {
            //real case use post api
            setWarehouseItems([...warehouseItems, formData]);
        }

        if (action == "delete") {
            //real case use delete api base on id
            // const { idRow } = id
            // if (idRow) {
            const updatedItems = warehouseItems.filter(
                (item) => item.id !== id
            );
            setWarehouseItems(updatedItems);
            // }
        }

        if (action == "edit") {
            //real case use put api
            //setWarehouseItems([...warehouseItems, formData])
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: 375, sm: 480, md: "100%" },
            }}
        >
            <div className="warehouse-section">
                <div className="settings-page relative bg-bg-primary w-full h-[1046px] overflow-hidden flex flex-row items-start justify-start text-center text-mini text-grey-darker font-tag-chi-medium">
                    <div className=" self-stretch flex-1 bg-white flex flex-col items-start justify-start text-smi text-grey-middle font-noto-sans-cjk-tc">
                        <div className="self-stretch flex-1 bg-bg-primary flex flex-col items-start justify-start text-3xl text-black font-tag-chi-medium">
                            <div
                                className={`settings-container self-stretch flex-1 flex flex-col items-start justify-start pt-[30px] pb-[75px] text-mini text-grey-darker ${
                                    isMobile
                                        ? "overflow-auto whitespace-nowrap w-[375px] mx-4 my-0"
                                        : "px-10"
                                }`}
                            >
                                <div className="self-stretch flex flex-col items-start justify-start gap-[12px] overflow-auto">
                                    <div className="settings-header self-stretch flex flex-row items-center justify-start gap-[12px] text-base text-grey-dark">
                                        <b className="relative tracking-[0.08em] leading-[28px]">
                                            {t("top_menu.workshop")}
                                        </b>
                                        <div
                                            className="rounded-6xl bg-white overflow-hidden flex flex-row items-center justify-center py-2 pr-5 pl-3 gap-[5px] cursor-pointer text-smi text-green-primary border-[1px] border-solid border-green-pale"
                                            onClick={addDataWarehouse}
                                        >
                                            <ADD_ICON />
                                            <b className="relative tracking-[1px] leading-[20px]">
                                                {t("top_menu.add_new")}
                                            </b>
                                        </div>
                                    </div>
                                    <Box className="w-full">
                                        <TableBase
                                            header={headerTitles}
                                            dataRow={warehouseItems}
                                            onDelete={(type, row) =>
                                                handleDelete(action, row)
                                            }
                                            onEdit={(type, row) =>
                                                handleEdit(action, row)
                                            }
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* right drawer */}
                    <AddWarehouse
                        drawerOpen={drawerOpen}
                        handleDrawerClose={handleDrawerClose}
                        action={action}
                        onSubmitData={handleOnSubmitData}
                        rowId={rowId}
                    ></AddWarehouse>
                </div>
            </div>
        </Box>
    );
};

export default Warehouse;
