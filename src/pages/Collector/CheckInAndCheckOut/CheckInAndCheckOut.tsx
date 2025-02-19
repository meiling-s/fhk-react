import {
  Box,
  Pagination,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSpacingParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { STATUS_CODE, format } from "../../../constants/constant";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { CheckInAndCheckOutDetails } from "../CheckInAndCheckOut";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllCheckInOutRequest } from "../../../APICalls/Collector/checkInOut";
import {
  extractError,
  getPrimaryColor,
  returnApiToken,
  debounce,
} from "../../../utils/utils";
import CircularLoading from "../../../components/CircularLoading";
import { useNavigate } from "react-router-dom";

import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { queryCheckInOut } from "../../../interfaces/checkInOut";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "src/contexts/CommonTypeContainer";
import { getWarehouseById } from "src/APICalls/warehouseManage";
import { getCollectionPointDetail } from "src/APICalls/collectionPointManage";

const SenderWarehouseAddressCell: React.FC<{
  warehouseId: number;
  senderAddr: string | null;
  receiverAddr: string | null;
}> = ({ warehouseId, senderAddr, receiverAddr }) => {
  const [address, setAddress] = useState<string | null>(senderAddr);

  const getWarehouseDetail = async (id: number) => {
    try {
      const warehouse = await getWarehouseById(id);
      return warehouse.data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (senderAddr === null || receiverAddr === null) {
      getWarehouseDetail(warehouseId).then((warehouse) => {
        if (warehouse) {
          setAddress(warehouse.location);
        }
      });
    }
  }, [warehouseId, senderAddr, receiverAddr]);

  return <div>{address || "Loading..."}</div>;
};

const SenderCollectionAddressCell: React.FC<{
  colId: number;
  senderAddr: string | null;
  receiverAddr: string | null;
}> = ({ colId, senderAddr, receiverAddr }) => {
  const [address, setAddress] = useState<string | null>(senderAddr);

  const getCollectionPoint = async (id: number) => {
    try {
      const col = await getCollectionPointDetail(id);
      return col?.data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (senderAddr === null || receiverAddr === null) {
      getCollectionPoint(colId).then((col) => {
        if (col) {
          setAddress(col.address);
        }
      });
    }
  }, [colId, senderAddr, receiverAddr]);

  return <div>{address || "Loading..."}</div>;
};

function CheckInAndCheckOut() {
  const { t, i18n } = useTranslation();
  const { accountData } = useContainer(CommonTypeContainer);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isShow, setIsShow] = useState(false);
  const [details, setDetails] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<queryCheckInOut>({
    picoId: "",
    company: "",
    addr: "",
    inout: "",
  });
  const navigate = useNavigate();
  const [totalElements, setTotalElements] = useState<number>(0);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const cacheWarehouse: any = {};

  useEffect(() => {
    getData(); // eslint-disable-next-line
  }, [page, filter]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCheckInOutRequest(page - 1, pageSize, filter);
      const data = result?.data;
      const { content, totalPages, totalElements } = data;
      setData(
        content.map((item: any, index: number) => {
          return {
            ...item,
            id: index,
          };
        })
      );
      setTotalData(totalPages);
      setTotalElements(totalElements);
      setIsLoading(false);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const updateQuery = (newQuery: Partial<queryCheckInOut>) => {
    setFilter({ ...filter, ...newQuery });
  };

  const handleChangeFilter = debounce((label: string, value: string) => {
    setPage(1);
    updateQuery({ [label]: value });
  }, 500);

  function getUniqueOptions(propertyName: keyof any) {
    interface Option {
      value: string;
      label: string;
    }
    const optionMap = new Map();

    data.forEach((row) => {
      if (propertyName === "senderName") {
        if (row["senderName"] && !optionMap.has(row["senderName"])) {
          optionMap.set(row["senderName"], row["senderName"]);
        }
        if (row["receiverName"] && !optionMap.has(row["receiverName"])) {
          optionMap.set(row["receiverName"], row["receiverName"]);
        }
      } else if (row[propertyName]) {
        optionMap.set(row[propertyName], row[propertyName]);
      }
    });
    let options: Option[] = Array.from(optionMap.values())
      .filter((option) => option.trim() !== "") // Filter out empty or whitespace-only strings
      .map((option) => ({
        value: option,
        label: option,
      }));

    options.push({
      value: "",
      label: t("check_in.any"),
    });
    return options;
  }

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: t("checkinandcheckout.creation_date"),
      width: 200,
      type: "string",
      renderCell: (params) => {
        const dateFormatted = dayjs(new Date(params.row.createdAt)).format(
          format.dateFormat1
        );
        return <div>{dateFormatted}</div>;
      },
    },
    {
      field: "outin",
      type: "string",
      width: 150,
      headerName: t("checkinandcheckout.outin"),
      renderCell: (params) => {
        return params.row.chkInId || params.row.chkOutId ? (
          <div
            className={`px-4 py-2 rounded-full text-white font-bold`}
            style={{ backgroundColor: getPrimaryColor() }}
          >
            {params.row.chkInId
              ? t("checkinandcheckout.send_in")
              : t("checkinandcheckout.ship")}
          </div>
        ) : null;
      },
    },
    {
      field: "senderName",
      width: 200,
      type: "string",
      headerName: t("check_in.sender_company"),
      renderCell: (params) => {
        if (params.row.senderName === null) {
          if (i18n.language === "enus") {
            return accountData?.companyNameEng;
          } else if (i18n.language === "zhhk") {
            return accountData?.companyNameTchi;
          } else {
            return accountData?.companyNameSchi;
          }
        } else {
          return params.row.senderName;
        }
      },
    },
    {
      field: "receiverName",
      width: 200,
      type: "string",
      headerName: t("check_in.receiver_company"),
      renderCell: (params) => {
        if (params.row.receiverName === null) {
          if (i18n.language === "enus") {
            return accountData?.companyNameEng;
          } else if (i18n.language === "zhhk") {
            return accountData?.companyNameTchi;
          } else {
            return accountData?.companyNameSchi;
          }
        } else {
          return params.row.receiverName;
        }
      },
    },
    {
      field: "picoId",
      width: 300,
      type: "string",
      headerName: t("logisticDashboard.poNumber"),
    },
    {
      field: "adjustmentFlg",
      type: "boolean",
      width: 150,
      headerName: t("checkinandcheckout.adjust_inventory"),
      renderCell: (params) => {
        return params.row.adjustmentFlg ? (
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 4.5L6 12.5L2 8.5"
              stroke="#79CA25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="w-[16px] h-[16px] text-red-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-6 -6 24 24"
            width="28"
            fill="currentColor"
          >
            <path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path>
          </svg>
        );
      },
    },
    {
      field: "logisticName",
      type: "string",
      width: 200,
      headerName: t("checkinandcheckout.logistics_company"),
    },
    {
      field: "senderAddr",
      type: "string",
      width: 200,
      headerName: t("check_out.shipping_location"),
      renderCell: (params) => {
        if (params.row.senderAddr !== null) {
          return params.row.senderAddr;
        } else {
          if (params.row.warehouseId !== 0) {
            return (
              <SenderWarehouseAddressCell
                warehouseId={params.row.warehouseId}
                senderAddr={params.row.senderAddr}
                receiverAddr={params.row.receiverAddr}
              />
            );
          } else if (params.row.colId !== 0) {
            return (
              <SenderCollectionAddressCell
                colId={params.row.colId}
                senderAddr={params.row.senderAddr}
                receiverAddr={params.row.receiverAddr}
              />
            );
          }
        }
      },
    },
    {
      field: "receiverAddr",
      type: "string",
      width: 200,
      headerName: t("pick_up_order.detail.arrived"),
      renderCell: (params) => {
        if (params.row.receiverAddr !== null) {
          return params.row.receiverAddr;
        } else {
          if (params.row.warehouseId !== 0) {
            return (
              <SenderWarehouseAddressCell
                warehouseId={params.row.warehouseId}
                senderAddr={params.row.senderAddr}
                receiverAddr={params.row.receiverAddr}
              />
            );
          } else if (params.row.colId !== 0) {
            return (
              <SenderCollectionAddressCell
                colId={params.row.colId}
                senderAddr={params.row.senderAddr}
                receiverAddr={params.row.receiverAddr}
              />
            );
          }
        }
      },
    },
  ];

  const searchField = [
    {
      label: t("purchase_order.table.pico_id"),
      placeholder: t("checkinandcheckout.search_placeholder"),
      field: "picoId",
    },
    {
      label: t("checkinandcheckout.company"),
      options: getUniqueOptions("senderName"),
      field: "company",
    },
    {
      label: t("checkinandcheckout.delivery_location"),
      options: getUniqueOptions("senderAddr"),
      field: "addr",
    },
    {
      label: t("checkinandcheckout.outin"),
      options: [
        { label: t("checkinandcheckout.ship"), value: "out" },
        { label: t("checkinandcheckout.send_in"), value: "in" },
        { value: "", label: t("check_in.any") },
      ],
      field: "inout",
    },
  ];

  const handleSelectRow = async ({ row }: any) => {
    setSelectedRow(row);
    setIsShow(true);
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  // const handleSearch = debounce((value: string) => {
  //   setKeyword(value)
  // }, 500)

  return (
    <Box
      className={"container-wrapper w-full"}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pr: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginY: 4,
        }}
      >
        <ChevronLeftIcon className="text-black" />
        <Typography
          fontSize={16}
          color="black"
          fontWeight="bold"
          style={{ textTransform: "uppercase" }}
        >
          {t("checkinandcheckout.title")}
        </Typography>
        <Box sx={styles.totalElements}>
          <Typography style={{ color: "white", fontSize: "12px" }}>
            {totalElements}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Stack direction="row" mt={3}>
          {searchField.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              field={s.field}
              placeholder={s?.placeholder}
              options={s.options || []}
              onChange={handleChangeFilter}
            />
          ))}
        </Stack>
      </Box>
      <div className="mt-6">
        <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
          {isLoading ? (
            <Box sx={{ textAlign: "center", paddingY: 12 }}>
              <CircularLoading />
            </Box>
          ) : (
            <Box>
              <DataGrid
                rows={data}
                getRowId={(row) => row.id}
                hideFooter
                columns={columns}
                checkboxSelection={false}
                onRowClick={handleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    border: "none",
                  },
                  "& .MuiDataGrid-row": {
                    bgcolor: "white",
                    borderRadius: "10px",
                  },
                  "&>.MuiDataGrid-main": {
                    "&>.MuiDataGrid-columnHeaders": {
                      borderBottom: "none",
                    },
                  },
                }}
              />
              <Pagination
                className="mt-4"
                count={Math.ceil(totalData)}
                page={page}
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
              />
            </Box>
          )}
        </Box>
        <CheckInAndCheckOutDetails
          isShow={isShow}
          setIsShow={setIsShow}
          selectedRow={selectedRow}
        />
      </div>
    </Box>
  );
}

const styles = {
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  textFieldLabel: {
    color: getPrimaryColor,
    "&.Mui-focused": {
      color: getPrimaryColor,
    },
  },
  totalElements: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: getPrimaryColor,
    padding: "3px",
    borderRadius: "20px",
    width: "20px",
    height: "20px",
  },
};

export default CheckInAndCheckOut;
