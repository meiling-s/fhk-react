import { Box, Grid, TextField, Autocomplete } from "@mui/material";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import Switcher from "../../../components/FormComponents/CustomSwitch";

interface EngineDataFormProps {
  tChineseName: string;
  sChineseName: string;
  englishName: string;
  residentialFlg: boolean;
  registeredFlg: boolean;
  selectedService: string;
  serviceTypeSelect: { name: string }[];
  description: string;
  remark: string;
  trySubmited: boolean;
  validation: { field: string; error: string; dataTestId?: string }[];
  action?: "add" | "edit" | "delete";
  setTChineseName: (value: string) => void;
  setSChineseName: (value: string) => void;
  setEnglishName: (value: string) => void;
  setResidentalFlg: (value: boolean) => void;
  setRegisteredFlg: (value: boolean) => void;
  setSelectedService: (value: string) => void;
  setDescription: (value: string) => void;
  setRemark: (value: string) => void;
  checkString: (value: string) => boolean;
  t: (key: string) => string;
}

const EngineDataForm: React.FC<EngineDataFormProps> = ({
  tChineseName,
  sChineseName,
  englishName,
  residentialFlg,
  registeredFlg,
  selectedService,
  serviceTypeSelect,
  description,
  remark,
  trySubmited,
  validation,
  action,
  setTChineseName,
  setSChineseName,
  setEnglishName,
  setResidentalFlg,
  setRegisteredFlg,
  setSelectedService,
  setDescription,
  setRemark,
  checkString,
  t,
}) => {
  return (
    <Box sx={{ marginX: 2 }}>
      <Box sx={{ marginY: 2 }}>
        <CustomField
          label={t("packaging_unit.traditional_chinese_name")}
          mandatory
        >
          <CustomTextField
            dataTestId="astd-house-form-tc-input-field-4981"
            id="tChineseName"
            value={tChineseName}
            disabled={action === "delete"}
            placeholder={t(
              "packaging_unit.traditional_chinese_name_placeholder"
            )}
            onChange={(event) => setTChineseName(event.target.value)}
            error={
              checkString(tChineseName) ||
              (trySubmited &&
                validation.some(
                  (value) =>
                    value.field === t("packaging_unit.traditional_chinese_name")
                ))
            }
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField
          label={t("packaging_unit.simplified_chinese_name")}
          mandatory
        >
          <CustomTextField
            dataTestId="astd-house-form-sc-input-field-7683"
            id="sChineseName"
            value={sChineseName}
            disabled={action === "delete"}
            placeholder={t(
              "packaging_unit.simplified_chinese_name_placeholder"
            )}
            onChange={(event) => setSChineseName(event.target.value)}
            error={
              checkString(sChineseName) ||
              (trySubmited &&
                validation.some(
                  (value) =>
                    value.field === t("packaging_unit.simplified_chinese_name")
                ))
            }
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("packaging_unit.english_name")} mandatory>
          <CustomTextField
            dataTestId="astd-house-form-en-input-field-2978"
            id="englishName"
            value={englishName}
            disabled={action === "delete"}
            placeholder={t("packaging_unit.english_name_placeholder")}
            onChange={(event) => setEnglishName(event.target.value)}
            error={
              checkString(englishName) ||
              (trySubmited &&
                validation.some(
                  (value) => value.field === t("packaging_unit.english_name")
                ))
            }
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("recycling_point.residence")}>
          <Switcher
            dataTestId="astd-house-form-residence-boolean-button-3779"
            onText={t("add_warehouse_page.yes")}
            offText={t("add_warehouse_page.no")}
            disabled={action === "delete"}
            defaultValue={residentialFlg}
            setState={(newValue) => setResidentalFlg(newValue)}
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("recycling_point.epd")}>
          <Switcher
            dataTestId="astd-house-form-epd-boolean-button-9422"
            onText={t("add_warehouse_page.yes")}
            offText={t("add_warehouse_page.no")}
            disabled={action === "delete"}
            defaultValue={registeredFlg}
            setState={(newValue) => setRegisteredFlg(newValue)}
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("recycling_point.service_type")} mandatory>
          <Autocomplete
            disablePortal
            data-testId="astd-house-form-service-type-select-button-9259"
            id="selectedService"
            defaultValue={selectedService}
            options={serviceTypeSelect.map((functionItem) => functionItem.name)}
            onChange={(event, value) => {
              if (value) {
                setSelectedService(value);
              }
            }}
            value={selectedService}
            disabled={action === "delete"}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("recycling_point.service_type")}
                sx={{ width: 320 }}
                error={checkString(selectedService)}
              />
            )}
            noOptionsText={t("common.noOptions")}
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("packaging_unit.introduction")}>
          <CustomTextField
            dataTestId="astd-house-form-intro-input-field-6605"
            id="introduction"
            placeholder={t("packaging_unit.introduction_placeholder")}
            onChange={(event) => setDescription(event.target.value)}
            multiline={true}
            defaultValue={description}
            disabled={action === "delete"}
          />
        </CustomField>
      </Box>
      <Box sx={{ marginY: 2 }}>
        <CustomField label={t("packaging_unit.remark")}>
          <CustomTextField
            dataTestId="astd-house-form-remark-input-field-5314"
            id="remark"
            placeholder={t("packaging_unit.remark_placeholder")}
            onChange={(event) => setRemark(event.target.value)}
            multiline={true}
            defaultValue={remark}
            disabled={action === "delete"}
          />
        </CustomField>
      </Box>
      <Grid item sx={{ width: "92%" }}>
        {trySubmited &&
          validation.map((val, index) => (
            <FormErrorMsg
              key={index}
              field={t(val.field)}
              errorMsg={val.error}
              type={"error"}
              dataTestId={val.dataTestId}
            />
          ))}
      </Grid>
    </Box>
  );
};

export default EngineDataForm;
