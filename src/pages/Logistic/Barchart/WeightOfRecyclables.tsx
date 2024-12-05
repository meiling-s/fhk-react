import { FunctionComponent } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Dashboard from "../../../components/Dashboard/ChartWeight";
import useDropupWeightDashboardCollector from "./useDropupWeightDashboardCollector";
import usePickupWeightDashboardCollector from "./usePickupWeightDashboard";
const WeightOfRecyclables: FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    setFrmDate,
    setToDate,
    frmDate,
    toDate,
    labels,
    dataset,
    vehicleList,
    categoryList,
    onMultipleCategoryChange,
    onCategoryChange,
    onVehicleNumberChange
  } = useDropupWeightDashboardCollector();
  const {
    setFrmDatePick,
    setToDatePick,
    frmDatePick,
    toDatePick,
    labelsPick,
    datasetPick,
    vehicleListPick,
    categoryListPick,
    onMultipleCategoryChangePick,
    onCategoryChangePick,
    onVehicleNumberChangePick
  } = usePickupWeightDashboardCollector();

  return (
    <Box>
      <Typography
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#000000",
          marginBottom: "30px"
        }}
      >
        {t("dashboard_weight_of_recyclables.record")}
      </Typography>
      <Dashboard
        labels={labels}
        dataset={dataset}
        onChangeFromDate={setFrmDate}
        onChangeToDate={setToDate}
        frmDate={frmDate}
        toDate={toDate}
        vehicleList={vehicleList}
        categoryList={categoryList}
        onMultipleCategoryChange={onMultipleCategoryChange}
        onCategoryChange={onCategoryChange}
        onVehicleNumberChange={onVehicleNumberChange}
        title={t("dashboard_weight_of_recyclables.delivered_weight")}
        typeChart="bar"
      />
      <Dashboard
        labels={labelsPick}
        dataset={datasetPick}
        onChangeFromDate={setFrmDatePick}
        onChangeToDate={setToDatePick}
        frmDate={frmDatePick}
        toDate={toDatePick}
        vehicleList={vehicleListPick}
        categoryList={categoryListPick}
        onMultipleCategoryChange={onMultipleCategoryChangePick}
        onCategoryChange={onCategoryChangePick}
        onVehicleNumberChange={onVehicleNumberChangePick}
        title={t("dashboard_weight_of_recyclables.unloaded_weight")}
        typeChart="bar"
      />
    </Box>
  );
};

export default WeightOfRecyclables;
