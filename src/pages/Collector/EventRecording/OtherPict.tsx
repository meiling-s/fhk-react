import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styles } from "../../../constants/styles";
import { CAMERA_OUTLINE_ICON } from "../../../themes/icons";
import dayjs from "dayjs";
import { createServiceInfo } from "../../../APICalls/serviceInfo";
import { ServiceInfo } from "../../../interfaces/serviceInfo";
import { ToastContainer, toast } from "react-toastify";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import { STATUS_CODE, formErr } from "../../../constants/constant";
import { format } from "../../../constants/constant";
import { localStorgeKeyName } from "../../../constants/constant";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { extractError, getPrimaryColor } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

type ServiceName = "SRV00005" | "SRV00006" | "SRV00007";
type ServiceData = Record<
  ServiceName,
  { serviceId: number; startDate: dayjs.Dayjs; photoImage: ImageListType }
>;
const loginId = localStorage.getItem(localStorgeKeyName.username) || "admin";
const OtherPict = () => {
  const { t, i18n } = useTranslation();
  const [serviceData, setServiceData] = useState<ServiceData>({
    SRV00005: { serviceId: 5, startDate: dayjs(), photoImage: [] },
    SRV00006: { serviceId: 6, startDate: dayjs(), photoImage: [] },
    SRV00007: { serviceId: 7, startDate: dayjs(), photoImage: [] },
  });
  const navigate = useNavigate();
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const { imgSettings, dateFormat } = useContainer(CommonTypeContainer);
  const [selectedService, setSelectedService] =
    useState<ServiceName>("SRV00005");
  const [selectedFieldService, setSelectedFieldService] =
    useState<string>("Recycling Spots");

  const serviceOthersField = [
    {
      serviceName: "SRV00005",
      label: t("report.picturesUploadedToFacebook"),
    },
    {
      serviceName: "SRV00006",
      label: t("report.regulatedWEEESubmittedToRecyclers"),
    },
    {
      serviceName: "SRV00007",
      label: t("report.fluorescentLampsSubmittedToRecyclers"),
    },
  ];

  const ImageToBase64 = (images: ImageListType) => {
    var base64: string[] = [];
    images.map((image) => {
      if (image["data_url"]) {
        var imageBase64: string = image["data_url"].toString();
        imageBase64 = imageBase64.split(",")[1];
        base64.push(imageBase64);
      }
    });
    return base64;
  };

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    serviceName: ServiceName
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceName]: { ...prevData[serviceName], photoImage: imageList },
    }));
  };

  const updateDateTime = (
    serviceName: ServiceName,
    property: string,
    value: dayjs.Dayjs
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceName]: {
        ...prevData[serviceName],
        [property]: value,
      },
    }));
  };

  useEffect(() => {
    const validate = async () => {
      const tempV = [];

      if (serviceData.hasOwnProperty(selectedService)) {
        const entry = serviceData[selectedService as ServiceName];
        const serviceLabel =
          serviceOthersField.find(
            (value) => value.serviceName === selectedService
          )?.label ?? selectedService;

        const startDate = entry.startDate ? dayjs(entry.startDate) : null;

        if (!startDate || !startDate.isValid()) {
          tempV.push({
            field: `${serviceLabel} ${t("report.dateAndTime")}`,
            problem: formErr.empty,
            type: "error",
          });
        }

        // Validate photoImage
        if (!Array.isArray(entry.photoImage) || entry.photoImage.length === 0) {
          tempV.push({
            field: `${serviceLabel} ${t("report.picture")}`,
            problem: formErr.empty,
            type: "error",
          });
        }
      }

      setValidation(tempV);
    };

    validate();
  }, [serviceData, i18n.language]);

  const validateData = () => {
    const tempV = [];

    if (serviceData.hasOwnProperty(selectedService)) {
      const entry = serviceData[selectedService as ServiceName];
      const serviceLabel =
        serviceOthersField.find(
          (value) => value.serviceName === selectedService
        )?.label ?? selectedService;

      const startDate = entry.startDate ? dayjs(entry.startDate) : null;

      if (!startDate || !startDate.isValid()) {
        tempV.push({
          field: `${serviceLabel} ${t("report.dateAndTime")}`,
          problem: formErr.empty,
          type: "error",
        });
      }

      if (!Array.isArray(entry.photoImage) || entry.photoImage.length === 0) {
        tempV.push({
          field: `${serviceLabel} ${t("report.picture")}`,
          problem: formErr.empty,
          type: "error",
        });
      }
    }

    setValidation(tempV);
  };

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  };

  const resetServiceData = () => {
    setServiceData({
      SRV00005: { serviceId: 5, startDate: dayjs(), photoImage: [] },
      SRV00006: { serviceId: 6, startDate: dayjs(), photoImage: [] },
      SRV00007: { serviceId: 7, startDate: dayjs(), photoImage: [] },
    });
  };

  const resetServiceDataWithKey = (serviceName: string, serviceId: number) => {
    setServiceData((prev) => {
      return {
        ...prev,
        [serviceName]: {
          serviceId: serviceId,
          startDate: dayjs(),
          photoImage: [],
        },
      };
    });
  };

  const submitServiceInfo = async () => {
    setTrySubmited(false);
    validateData();

    const serviceItem = serviceData[selectedService];
    if (!serviceItem) return;

    if (validation.length > 0) {
      setTrySubmited(true);
      return;
    }

    const imgList: string[] = ImageToBase64(serviceItem.photoImage);

    const formData: ServiceInfo = {
      serviceId: serviceItem.serviceId,
      address: "",
      addressGps: [0],
      serviceName: selectedService,
      participants: "string",
      startAt: formattedDate(serviceItem.startDate),
      endAt: formattedDate(serviceItem.startDate),
      photo: imgList,
      numberOfVisitor: 0,
      createdBy: loginId,
      updatedBy: loginId,
    };
    try {
      const result = await createServiceInfo(formData);
      if (result) {
        const toastMsg =
          t("report.otherPictures") + " " + t("common.saveSuccessfully");
        toast.info(toastMsg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        resetServiceData();
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const returnErrorMsg = (error: string) => {
    var msg = "";
    console.log(error);
    switch (error) {
      case formErr.empty:
        msg = t("form.error.shouldNotBeEmpty");
        break;
      case formErr.wrongFormat:
        msg = t("form.error.isInWrongFormat");
        break;
      case formErr.numberSmallThanZero:
        msg = t("form.error.shouldNotSmallerThanZero");
        break;
      case formErr.wrongFormat:
        msg = t("form.error.isInWrongFormat");
        break;
    }
    return msg;
  };

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid item sx={{ ml: 2, mt: 2 }}>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel>{t("report.selectService")}</InputLabel>
              <Select
                value={selectedService}
                onChange={(e) => {
                  const serviceLabel =
                    serviceOthersField.find(
                      (value) => value.serviceName === e.target.value
                    )?.label ?? e.target.value;
                  setSelectedFieldService(serviceLabel);
                  setSelectedService(e.target.value as ServiceName);
                  setTrySubmited(false);
                  resetServiceData();
                }}
                label={t("report.selectService")}
              >
                {serviceOthersField.map((service) => (
                  <MenuItem
                    key={service.serviceName}
                    value={service.serviceName}
                  >
                    {service.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {serviceOthersField
            .filter((item) => item.serviceName === selectedService)
            .map((item, index) => (
              <Grid
                key={index}
                container
                direction={"column"}
                spacing={2.5}
                sx={{
                  width: { sm: "384px", xs: "100%" },
                  marginTop: { sm: 2, xs: 6 },
                  marginLeft: {
                    xs: 0,
                  },
                }}
                className="sm:ml-0 mt-o w-full"
              >
                <Grid item>
                  <Typography sx={[styles.header2]}>{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography sx={[styles.header3, { marginBottom: 2 }]}>
                    {t("report.dateAndTime")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: "8px", alignItems: "center" }}
                  >
                    <Box sx={{ ...localstyles.DateItem }}>
                      <DatePicker
                        defaultValue={dayjs(
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        )}
                        format={dateFormat}
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            "startDate",
                            value!!
                          )
                        }
                        sx={{ ...localstyles.datePicker }}
                      />
                    </Box>
                    <Box sx={{ ...localstyles.timePeriodItem }}>
                      <TimePicker
                        value={
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        }
                        timeSteps={{ minutes: 1 }}
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            "endDate",
                            value!!
                          )
                        }
                        sx={{ ...localstyles.timePicker }}
                        slotProps={{
                          layout: {
                            sx: {
                              width: "216px",
                              "& .MuiMultiSectionDigitalClockSection-root": {
                                flexGrow: 1,
                                scrollbarGutter: "stable",
                              },
                            },
                          },
                          digitalClockSectionItem: {
                            sx: {
                              width: "auto",
                            },
                          },
                          textField: {
                            inputProps: { readOnly: true },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item>
                  {/* image field */}
                  <Box key={t("report.picture") + index}>
                    <Typography sx={styles.labelField}>
                      {t("report.picture")}
                    </Typography>
                    <ImageUploading
                      multiple
                      value={
                        serviceData[item.serviceName as keyof ServiceData]
                          .photoImage
                      }
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(
                          imageList,
                          addUpdateIndex,
                          item.serviceName as ServiceName
                        )
                      }
                      maxNumber={imgSettings?.ImgQuantity}
                      maxFileSize={imgSettings?.ImgSize}
                      dataURLKey="data_url"
                      acceptType={["jpg", "jpeg", "png"]}
                    >
                      {({ imageList, onImageUpload }) => (
                        <Box className="box">
                          <Card
                            sx={{
                              ...localstyles.cardImg,
                              ...(trySubmited &&
                                imageList.length === 0 &&
                                localstyles.imgError),
                            }}
                          >
                            <ButtonBase
                              sx={localstyles.btnBase}
                              onClick={(event) => onImageUpload()}
                            >
                              <CAMERA_OUTLINE_ICON
                                style={{ color: "#ACACAC" }}
                              />
                              <Typography
                                sx={[styles.labelField, { fontWeight: "bold" }]}
                              >
                                {t("report.uploadPictures")}
                              </Typography>
                            </ButtonBase>
                          </Card>
                          <ImageList sx={localstyles.imagesContainer} cols={3}>
                            {imageList.map((image) => (
                              <ImageListItem key={image["file"]?.name}>
                                <img
                                  style={localstyles.image}
                                  src={image["data_url"]}
                                  alt={image["file"]?.name}
                                  loading="lazy"
                                />
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </Box>
                      )}
                    </ImageUploading>
                  </Box>
                </Grid>
              </Grid>
            ))}
          <Grid item sx={{ width: "100%" }}>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={returnErrorMsg(val.problem)}
                  type={val.type}
                />
              ))}
          </Grid>
          <Grid item className="lg:flex sm:block text-center">
            <Button
              sx={[
                styles.buttonFilledGreen,
                localstyles.localButton,
                { marginBottom: { md: 0, xs: 2 }, marginTop: 2, marginLeft: 2 },
              ]}
              onClick={submitServiceInfo}
            >
              {t("col.create")}
            </Button>
          </Grid>
        </LocalizationProvider>
      </div>
    </Box>
  );
};

const localstyles = {
  localButton: {
    width: "200px",
    fontSize: 18,
    mr: 3,
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  imagesContainer: {
    width: "100%",
    height: "fit-content",
  },
  image: {
    aspectRatio: "1/1",
    width: "80px",
    borderRadius: 2,
  },
  cardImg: {
    borderRadius: 2,
    backgroundColor: "#E3E3E3",
    width: "100%",
    height: 150,
    boxShadow: "none",
  },
  btnBase: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {
    ...styles.textField,
    maxWidth: "370px",
    "& .MuiIconButton-edgeEnd": {
      color: getPrimaryColor(),
    },
  },
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
  },
  DateItem: {
    display: "flex",
    height: "fit-content",
    alignItems: "center",
  },
  imgError: {
    border: "1px solid red",
  },
  timePicker: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    "& fieldset": {
      borderWidth: 0,
    },
    "& input": {
      paddingX: 0,
    },
    "& .MuiIconButton-edgeEnd": {
      color: getPrimaryColor(),
    },
  },
  timePeriodItem: {
    display: "flex",
    height: "fit-content",
    paddingX: 2,
    alignItems: "center",
    backgroundColor: "white",
    border: 2,
    borderRadius: 3,
    borderColor: "#E2E2E2",
  },
};

export default OtherPict;
