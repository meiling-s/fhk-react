import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Grid, Pagination, Stack, debounce } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { EDIT_OUTLINED_ICON } from "../../../themes/icons";
import { useTranslation } from "react-i18next";
import { NotifTemplate } from "../../../interfaces/notif";
import {
  getListNotifTemplatePO,
  getListNotifTemplateStaff,
} from "../../../APICalls/notify";
import { useNavigate } from "react-router-dom";
import {
  Languages,
  Roles,
  STATUS_CODE,
  localStorgeKeyName,
} from "../../../constants/constant";
import { extractError, returnApiToken } from "../../../utils/utils";
import { LanguagesNotif } from "../../../interfaces/notif";
import i18n from "../../../setups/i18n";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import CircularLoading from "../../../components/CircularLoading";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";

function createNotifTemplate(
  templateId: string,
  notiType: string,
  variables: string[],
  lang: string,
  title: string,
  senders: string[],
  receivers: string[],
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): NotifTemplate {
  return {
    templateId,
    notiType,
    variables,
    lang,
    title,
    senders,
    receivers,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  };
}

interface CurrentMenuProps {
  selectedTab: number;
}

interface Option {
  value: string;
  label: string;
}

const CurrentMenu: FunctionComponent<CurrentMenuProps> = ({ selectedTab }) => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [notifTemplate, setNotifTemplateList] = useState<NotifTemplate[]>([]);
  const [filteredTemplate, setFillteredTemplate] = useState<NotifTemplate[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<NotifTemplate | null>(null);
  const [action, setAction] = useState<"edit">("edit");
  const navigate = useNavigate();
  const { realmApiRoute } = returnApiToken();
  const realm = localStorage.getItem(localStorgeKeyName.realm);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [query, setQuery] = useState<any>({
    name: "",
    type: "",
    title: "",
    lang: "",
  });
  const languages: readonly LanguagesNotif[] = [
    {
      value: "ZH-CH",
      langTchi: "簡體中文",
      langSchi: "简体中文",
      langEng: "Simplified Chinese",
    },
    {
      value: "ZH-HK",
      langTchi: "繁體中文",
      langSchi: "繁体中文",
      langEng: "Traditional Chinese",
    },
    {
      value: "EN-US",
      langTchi: "英語",
      langSchi: "英语",
      langEng: "English",
    },
  ];

  const searchfield = [
    {
      label: t("notification.menu_staff.name"),
      field: "templateId",
      inputType: "string",
    },
    {
      label: t("notification.menu_staff.type"),
      options: getUniqueOptions("notiType"),
      field: "type",
    },
    {
      label: t("notification.menu_staff.title"),
      options: getUniqueOptions("title"),
      field: "title",
    },
    {
      label: t("notification.menu_staff.language"),
      options: getUniqueOptions("lang"),
      field: "lang",
    },
  ];

  function getUniqueOptions(propertyName: keyof NotifTemplate) {
    const optionMap = new Map();

    filteredTemplate.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName]);
    });

    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label:
        propertyName === "lang"
          ? option === "ZH-CH"
            ? t("common.simplifiedChinese")
            : option === "ZH-HK"
            ? t("common.traditionalChinese")
            : t("common.english")
          : option,
    }));
    options.push({
      value: "",
      label: t("check_in.any"),
    });
    return options;
  }

  useEffect(() => {
    if (selectedTab === 0) {
      setFillteredTemplate([]);
      initRecyclablesList();
    } else if (selectedTab === 1) {
      setFillteredTemplate([]);
      initStaffList();
    }
  }, [selectedTab]);

  useEffect(() => {
    initStaffList();
  }, [page, query]);

  const initStaffList = async () => {
    setIsLoading(true);
    setTotalData(0);
    try {
      const result = await getListNotifTemplateStaff(page - 1, pageSize, query);
      if (result) {
        const data = result?.data?.content;
        let notifMappingTemplate: NotifTemplate[] = [];
        if (data) {
          data.map((item: any) => {
            notifMappingTemplate.push(
              createNotifTemplate(
                item?.templateId,
                item?.notiType,
                item?.variables,
                item?.lang,
                item?.title,
                item?.senders,
                item?.receivers,
                item?.createdBy,
                item?.updatedBy,
                item?.createdAt,
                item?.updatedAt
              )
            );
          });
          setTotalData(result?.data.totalPages);
          setNotifTemplateList(notifMappingTemplate);
          setFillteredTemplate(notifMappingTemplate);
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  const initRecyclablesList = async () => {
    setIsLoading(true);
    setTotalData(0);
    try {
      const result = await getListNotifTemplatePO(page - 1, pageSize, query);
      if (result) {
        const data = result?.data?.content;
        var notifMappingTemplate: NotifTemplate[] = [];
        if (data) {
          console.log(data, "data");
          data.map((item: any) => {
            notifMappingTemplate.push(
              createNotifTemplate(
                item?.templateId,
                item?.notiType,
                item?.variables,
                item?.lang,
                item?.title,
                item?.senders,
                item?.receivers,
                item?.createdBy,
                item?.updatedBy,
                item?.createdAt,
                item?.updatedAt
              )
            );
          });
          setTotalData(result?.data.totalPages);
          setNotifTemplateList(notifMappingTemplate);
          setFillteredTemplate(notifMappingTemplate);
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: "templateId",
      headerName: t("notification.menu_staff.name"),
      width: 225,
      type: "string",
    },
    {
      field: "notiType",
      headerName: t("notification.menu_staff.type"),
      width: 100,
      type: "string",
    },
    {
      field: "title",
      headerName: t("notification.menu_staff.title"),
      width: 250,
      type: "string",
    },
    {
      field: "lang",
      headerName: t("notification.menu_staff.language"),
      width: 300,
      type: "string",
      valueFormatter: (params) => {
        return setCurrentLanguage(params.value);
      },
    },
    {
      field: "edit",
      headerName: t("notification.menu_staff.edit"),
      width: 300,
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                const selected = notifTemplate.find(
                  (item) => item.templateId == params.row.templateId
                );
                event.stopPropagation();
                handleAction(params, "edit");
                if (selected) setSelectedRow(selected);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  const setCurrentLanguage = (lang: string): string => {
    let language: string = "";
    if (lang === "ZH-CH" && i18n.language === Languages.ZHCH) {
      return (language = "简体中文");
    } else if (lang === "ZH-CH" && i18n.language === Languages.ZHHK) {
      return (language = "簡體中文");
    } else if (lang === "ZH-CH" && i18n.language === Languages.ENUS) {
      return (language = "Simplified Chinese");
    } else if (lang === "ZH-HK" && i18n.language === Languages.ZHCH) {
      return (language = "繁体中文");
    } else if (lang === "ZH-HK" && i18n.language === Languages.ZHHK) {
      return (language = "繁體中文");
    } else if (lang === "ZH-HK" && i18n.language === Languages.ENUS) {
      return (language = "Traditional Chinese");
    } else if (lang === "EN-US" && i18n.language === Languages.ZHCH) {
      return (language = "英语");
    } else if (lang === "EN-US" && i18n.language === Languages.ZHHK) {
      return (language = "英語");
    } else if (lang === "EN-US" && i18n.language === Languages.ENUS) {
      return (language = "English");
    }
    return language;
  };

  const handleAction = (params: GridRenderCellParams, action: "edit") => {
    navigate(
      `/${realm}/notice/${params.row.notiType}/${params.row.templateId}`
    );
  };

  const handleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const updateQuery = (newQuery: any) => {
    setQuery({ ...query, ...newQuery });
  };

  const handleSearch = debounce((keyName: string, value: string) => {
    setPage(1);
    updateQuery({ [keyName]: value });
  }, 1000);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pr: 4,
      }}
    >
      <div className="table-vehicle">
        <Box pr={4} sx={{ flexGrow: 1, maxWidth: "1460px" }}>
          <Stack direction="row" mt={3}>
            {searchfield.map((s) => (
              <CustomSearchField
                key={s.field}
                label={s.label}
                inputType={s.inputType}
                field={s.field}
                options={s.options || []}
                onChange={(labelField, value) =>
                  handleSearch(labelField as keyof NotifTemplate, value)
                }
              />
            ))}
          </Stack>
          {isLoading ? (
            <CircularLoading />
          ) : (
            <Box>
              <DataGrid
                rows={filteredTemplate}
                getRowId={(row) => row.templateId}
                hideFooter
                columns={columns}
                // checkboxSelection
                onRowClick={handleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    border: "none",
                  },
                  ".MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold !important",
                    overflow: "visible !important",
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
                count={Math.ceil(totalData)}
                page={page}
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
              />
            </Box>
          )}
        </Box>
      </div>
    </Box>
  );
};

export default CurrentMenu;
