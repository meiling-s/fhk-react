import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import * as React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Autocomplete,
  Grid,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Box,
  OutlinedInput,
  ListItemText,
  Checkbox
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { styles } from "../../constants/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Realm, localStorgeKeyName } from "../../constants/constant";
import { useEffect, useState } from "react";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface Dataset {
  id: string;
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor?: string;
  yAxisID?: string;
}
type VehiclesData = {
  plateNo: string;
  vehicleId: number;
};
type categorys = {
  id: string;
  label: string;
};
type props = {
  labels: string[];
  dataset: Dataset[] | [];
  onChangeFromDate: (value: dayjs.Dayjs) => void;
  onChangeToDate: (value: dayjs.Dayjs) => void;
  frmDate: dayjs.Dayjs;
  toDate: dayjs.Dayjs;
  title: string;
  onMultipleCategoryChange?: (value: Dataset[] | []) => void;
  onCategoryChange?: (value: string | "") => void;
  onVehicleNumberChange?: (value: string | "") => void;
  typeChart: string;
  canvasColor?: string;
  vehicleList: VehiclesData[] | [];
  categoryList: categorys[] | [];
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const ChartWeight = ({
  labels,
  dataset,
  onChangeFromDate,
  onChangeToDate,
  frmDate,
  toDate,
  title,
  typeChart,
  canvasColor,
  vehicleList,
  categoryList,
  onMultipleCategoryChange,
  onCategoryChange,
  onVehicleNumberChange
}: props) => {
  const { t } = useTranslation();
  const { dateFormat } = useContainer(CommonTypeContainer);
  const realm = localStorage.getItem(localStorgeKeyName.realm);
  const [vehicleValue, setVehicleValue] = useState<string>("");
  const [newDataSet, setNewDataSet] = useState<Dataset[]>(dataset);
  const [mainCategoryName, setMainCategoryName] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("0");
  const plugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart: any, args: any, options: any) => {
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = canvasColor ? canvasColor : "white";
      ctx.fillRect(chartArea.left, 0, chartArea.width, chart.height);
      ctx.restore();
    }
  };

  let options: any = {
    plugins: {
      title: {
        display: false,
        text: "Chart.js Bar Chart - Stacked"
      },
      labels: {
        align: "center"
      },
      legend: {
        labels: {
          usePointStyle: true,
          fontColor: "#717171"
        },
        position: "right",
        align: "start",
        pointStyle: "circle",
        usePointStyle: true
      },
      customCanvasBackgroundColor: {
        color: ""
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value: string): string {
            return value + " Kg";
          }
        }
      }
    }
  };
  const data = {
    labels,
    datasets: newDataSet
  };
  let chart: JSX.Element = <div></div>;
  switch (typeChart) {
    case "bar":
      chart = <Bar options={options} data={data} plugins={[plugin]} />;
      break;
    case "line":
      chart = <Line options={options} data={data} plugins={[plugin]} />;
      break;
    default:
      break;
  }
  useEffect(() => {
    if (vehicleList) {
      const defaultVehicle: string = String(vehicleList[0]?.vehicleId);
      setVehicleValue(defaultVehicle);
    }
  }, [vehicleList]);
  useEffect(() => {
    if (dataset) {
      setNewDataSet(dataset);
      const mainName: string[] = [];
      dataset.map((data) => {
        mainName.push(data.label);
      });
      setMainCategoryName(mainName);
    }
  }, [dataset]);
  const handleVehicleNumberChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setVehicleValue(value);
    if (onVehicleNumberChange) {
      onVehicleNumberChange(value);
    }
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value as string);
    const value = event.target.value as string;
    setCategory(value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };
  const handleMultipleCategoryClose = () => {
    if (onMultipleCategoryChange) {
      onMultipleCategoryChange(newDataSet);
    }
  };
  const handleMultipleCategoryChange = (
    event: SelectChangeEvent<typeof mainCategoryName>
  ) => {
    const {
      target: { value }
    } = event;
    setMainCategoryName(typeof value === "string" ? value.split(",") : value);
    const newValue = typeof value === "string" ? value.split(",") : value;
    setNewDataSet(removeLabels(newValue, dataset));
  };
  const removeLabels = (arr1: String[], arr2: Dataset[]) => {
    return arr2.filter((item) => arr1.includes(item.label));
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Grid
          style={{
            width: "100%",
            height: "518px",
            padding: "38px, 55px, 38px, 55px",
            gap: "10px",
            backgroundColor: "#F4F5F7"
          }}
        >
          <Grid
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "465px",
              padding: "30px",
              gap: "10px",
              backgroundColor: "#FFFFFF",
              borderRadius: "30px"
            }}
          >
            <Typography
              style={{ fontWeight: 700, fontSize: "18px", color: "#717171" }}
            >
              {title}
            </Typography>
            <Grid
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Grid
                item
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 1,
                  height: "40px",
                  padding: "8px",
                  borderRadius: "6px"
                }}
              >
                {t("dashboard_recyclables.date_range")}
              </Grid>

              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <DatePicker
                  value={frmDate}
                  disableOpenPicker
                  slotProps={{ textField: { size: "small" } }}
                  sx={localstyles.datePicker}
                  maxDate={toDate}
                  onChange={(value) => {
                    if (value) onChangeFromDate(value);
                  }}
                  format={dateFormat}
                />
                <Typography>-</Typography>
                <DatePicker
                  value={toDate}
                  disableOpenPicker
                  slotProps={{ textField: { size: "small" } }}
                  sx={localstyles.datePicker}
                  minDate={frmDate}
                  onChange={(value) => {
                    if (value) onChangeToDate(value);
                  }}
                  format={dateFormat}
                />
              </Grid>

              <Grid
                item
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 1,
                  height: "40px",
                  padding: "8px",
                  borderRadius: "6px"
                }}
              >
                {t("dashboard_weight_of_recyclables.car_number")}
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("dashboard_weight_of_recyclables.car_number")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={vehicleValue}
                      label={t("dashboard_weight_of_recyclables.car_number")}
                      onChange={handleVehicleNumberChange}
                    >
                      {vehicleList.map((num) => (
                        <MenuItem key={num.vehicleId} value={num.vehicleId}>
                          {num.plateNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 1,
                  height: "40px",
                  padding: "8px",
                  borderRadius: "6px"
                }}
              >
                {t("dashboard_weight_of_recyclables.item_type")}
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("dashboard_weight_of_recyclables.item_type")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label={t("dashboard_weight_of_recyclables.item_type")}
                      onChange={handleCategoryChange}
                    >
                      <MenuItem value={"0"}>{t("recyclables")}</MenuItem>
                      <MenuItem value={"1"}>{t("product")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 1,
                  height: "40px",
                  padding: "8px",
                  borderRadius: "6px"
                }}
              >
                {t("recycling_unit.main_category")}
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Box sx={{ minWidth: 120, maxWidth: 400 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      {t("recycling_unit.main_category")}
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={mainCategoryName}
                      onChange={handleMultipleCategoryChange}
                      onClose={handleMultipleCategoryClose}
                      input={
                        <OutlinedInput
                          label={t("recycling_unit.main_category")}
                        />
                      }
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {categoryList.map((name) => (
                        <MenuItem key={name.id} value={name.label}>
                          <Checkbox
                            checked={mainCategoryName.includes(name.label)}
                          />
                          <ListItemText primary={name.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Grid style={{ height: "295px", width: "1200px" }}>{chart}</Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
};

const localstyles = {
  datePicker: () => ({
    padding: 0,
    width: 110,
    '.react-datepicker-wrapper input[type="text"]': {
      border: "none"
    }
  })
};

export default ChartWeight;
