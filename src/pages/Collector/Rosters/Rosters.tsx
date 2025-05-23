import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import { styles } from "../../../constants/styles";
import { ADD_ICON } from "../../../themes/icons";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Languages, STATUS_CODE, format } from "../../../constants/constant";
import { useTranslation } from "react-i18next";
import RosterDetail from "./RosterDetail";

import { getRosterList } from "../../../APICalls/roster";
import { getCollectionPoint } from "../../../APICalls/collectionPointManage";
import { GroupedRoster, Roster } from "../../../interfaces/roster";
import { collectionPoint } from "../../../interfaces/collectionPoint";
import dayjs from "dayjs";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { extractError, getPrimaryColor } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import i18n from "../../../setups/i18n";
import { getStaffTitle } from "src/APICalls/staff";

export type Title = {
  name: string;
  id: string;
  nameEng: string;
  nameSc: string;
  nameTc: string;
};

const Rosters: FunctionComponent = () => {
  const { t } = useTranslation();

  const [filterDate, setFilterDate] = useState<dayjs.Dayjs>(dayjs());
  const [groupedRoster, setGroupedRoster] = useState<GroupedRoster[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [selectedRoster, setSelectedRoster] = useState<Roster | null>(null);
  const [selectedRosterDate, setRosterDate] = useState<string>("");
  const [rosterColId, setRosterColId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dateFormat } = useContainer(CommonTypeContainer);
  const [staffTitleList, setStaffTitleList] = useState<Title[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    initStaffTitle();
  }, []);

  useEffect(() => {
    initRosterData();
  }, [staffTitleList]);

  useEffect(() => {
    const filteredDate = filterDate.format("YYYY-MM-DD[T]00:00:00.000[Z]");
    initRosterData(filteredDate);
    initStaffTitle();
  }, [filterDate]);

  const initStaffTitle = async () => {
    const result = await getStaffTitle();
    if (result) {
      const data = result.data.content;
      let staffTitle: Title[] = [];
      data.forEach((item: any) => {
        let title: Title = {
          id: item.titleId,
          name: "",
          nameEng: item.titleNameEng,
          nameSc: item.titleNameSchi,
          nameTc: item.titleNameTchi,
        };
        switch (i18n.language) {
          case "enus":
            title.name = item.titleNameEng;
            break;
          case "zhch":
            title.name = item.titleNameSchi;
            break;
          case "zhhk":
            title.name = item.titleNameTchi;
            break;
          default:
            title.name = item.titleNameTchi;
            break;
        }

        staffTitle.push(title);
      });
      setStaffTitleList(staffTitle);
    }
  };

  const initRosterData = async (filteredDate?: string) => {
    try {
      setIsLoading(true);
      const collectionPointResult = await getCollectionPoint(0, 1000);
      const collectionPointData = collectionPointResult?.data?.content;
      console.log(collectionPointData, "collection point data");

      if (collectionPointData && collectionPointData.length > 0) {
        const today = dayjs().format("YYYY-MM-DD[T]00:00:00.000[Z]");
        const rosterResult = await getRosterList(filteredDate || today);
        let rosterData = rosterResult?.data;

        if (rosterData) {
          // Sort rosterData by startAt time in ascending order
          rosterData = rosterData.sort(
            (a: Roster, b: Roster) =>
              dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf()
          );
          console.log(rosterData, "rosterData");

          const groupedRoster: GroupedRoster[] = collectionPointData.map(
            (colPoint: collectionPoint) => {
              return {
                collectionId: parseInt(colPoint.colId),
                collectionName: colPoint.colName,
                roster: rosterData
                  .filter(
                    (roster: Roster) =>
                      roster.collectionPoint.colId === parseInt(colPoint.colId)
                  )
                  .map((roster: Roster) => ({
                    ...roster,
                    collectionPoint: {
                      ...roster.collectionPoint,
                      colId: parseInt(colPoint.colId),
                    },
                    staff: roster.staff.map((item) => {
                      const choosenStaffTitle = staffTitleList.find(
                        (value) => value.id === item.titleId
                      );
                      return {
                        ...item,
                        lang:
                          i18n.language === Languages.ENUS
                            ? item.staffNameEng
                            : i18n.language === Languages.ZHCH
                            ? item.staffNameSchi
                            : item.staffNameTchi,
                        title:
                          i18n.language === Languages.ENUS
                            ? choosenStaffTitle?.nameEng
                            : i18n.language === Languages.ZHCH
                            ? choosenStaffTitle?.nameSc
                            : choosenStaffTitle?.nameTc,
                      };
                    }),
                  })),
              };
            }
          );

          setGroupedRoster(groupedRoster);
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const formattedTime = (value: string) => {
    const dateObject = dayjs(value);
    return dateObject.format("HH:mm");
  };

  const onSubmitData = (type: string, msg: string) => {
    setSelectedRoster(null);
    setRosterColId(null);
    setRosterDate("");
    initRosterData();
    setFilterDate(dayjs(new Date()));
    // console.log(filterDate)
  };

  const addNewRoster = (item: GroupedRoster) => {
    setAction("add");
    setRosterColId(item.collectionId);
    if (item.roster.length > 0) {
      const startDate = item.roster[0].startAt;
      setRosterDate(startDate);
    } else {
      setRosterDate(dayjs().format("YYYY-MM-DD[T]00:00:00.000[Z]"));
    }
    setDrawerOpen(true);
  };

  useEffect(() => {
    initRosterData();
  }, [i18n.language]);

  return (
    <>
      <Box className="container-wrapper w-full overflow-scroll">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Box className="filter-date" sx={{ marginY: 4 }}>
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Box sx={{ ...localstyles.DateItem }}>
                <DatePicker
                  value={filterDate}
                  format={dateFormat}
                  onChange={(value) => setFilterDate(value!!)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
            </Box>
          </Box>
          {isLoading ? (
            <Box sx={{ textAlign: "center", paddingY: 2 }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Box className="roster-section flex gap-8 w-min">
              {groupedRoster.map((item, index) => (
                <Box
                  className="roster w-[225px]"
                  key={index + item.collectionId}
                >
                  <div className="col-title mb-3 text-[#717171] text-base font-bold">
                    {item.collectionName}
                  </div>
                  {item.roster.map((rosterItem, indexRoster) => (
                    <div
                      className="roster-item mb-6 bg-white rounded-2xl p-6 cursor-pointer"
                      key={indexRoster + rosterItem.rosterId}
                      onClick={() => {
                        setDrawerOpen(true);
                        setSelectedRoster(rosterItem);
                        setAction("edit");
                      }}
                    >
                      <div className="text-[#717171] text-[18px] font-bold">
                        {formattedTime(rosterItem.startAt)}-
                        {formattedTime(rosterItem.endAt)}
                      </div>
                      {rosterItem.staff.map((staffItem, indexStaff) => (
                        <Box
                          className="roster-staff"
                          sx={{
                            borderTop:
                              indexStaff !== 0 ? "1px solid #E2E2E2" : "none",
                            paddingBottom: "12px",
                          }}
                          key={indexStaff + staffItem.staffId}
                        >
                          <div className="staff flex gap-2 mt-2 justify-start items-center">
                            <div className="w-[25px] h-[25px] rounded-3xl bg-[#86C049] p-1 font-bold text-white text-xs text-center">
                              {staffItem.staffNameTchi.substring(0, 2)}
                            </div>
                            <div className="right-side">
                              <div className="font-bold text-base text-black mb-1">
                                {staffItem.lang}
                              </div>
                              <div className="text-xs font-normal text-[#717171]">
                                {staffItem.title}
                              </div>
                            </div>
                          </div>
                        </Box>
                      ))}
                    </div>
                  ))}
                  <div
                    className="add-roster text-center flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => addNewRoster(item)}
                  >
                    <ADD_ICON fontSize="small" className="text-[#717171]" />
                    <div className="text-[#717171] text-smi font-bold">
                      {t("roster.addSchedule")}
                    </div>
                  </div>
                </Box>
              ))}
              <RosterDetail
                drawerOpen={drawerOpen}
                handleDrawerClose={() => setDrawerOpen(false)}
                action={action}
                onSubmitData={onSubmitData}
                selectedRoster={selectedRoster}
                selectedDate={selectedRosterDate}
                rosterColId={rosterColId}
              />
            </Box>
          )}
        </LocalizationProvider>
      </Box>
    </>
  );
};

const localstyles = {
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  datePicker: {
    ...styles.textField,
    width: "350px",
    "& .MuiIconButton-edgeEnd": {
      color: getPrimaryColor(),
    },
  },
  DateItem: {
    display: "flex",
    height: "fit-content",
    alignItems: "center",
  },
};

export default Rosters;
