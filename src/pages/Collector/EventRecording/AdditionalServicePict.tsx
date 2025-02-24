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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import ImageUploading, { ImageListType } from "react-images-uploading";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import CustomTextField from "../../../components/FormComponents/CustomTextField";
import CustomField from "../../../components/FormComponents/CustomField";

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
import CustomItemListBoolean from "../../../components/FormComponents/CustomItemListBoolean";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import {
  extractError,
  getPrimaryColor,
  isEmptyOrWhitespace,
  onChangeWeight,
} from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

type ServiceName = "SRV00001" | "SRV00002" | "SRV00003" | "SRV00004";
const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

type ServiceData = Record<
  ServiceName,
  {
    serviceId: number;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    place: string;
    numberOfPeople: string;
    photoImage: ImageListType;
  }
>;

type ErrorsServiceData = Record<
  ServiceName,
  {
    startDate: { status: boolean; message: string };
    endDate: { status: boolean; message: string };
    place: { status: boolean; message: string };
    numberOfPeople: { status: boolean; message: string };
    photoImage: { status: boolean; message: string };
  }
>;

const AdditionalServicePict = () => {
  const { t, i18n } = useTranslation();
  const [selectedService, setSelectedService] =
    useState<ServiceName>("SRV00001");

  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const initialServiceData = {
    SRV00001: {
      serviceId: 1,
      startDate: dayjs(),
      endDate: dayjs(),
      place: "",
      numberOfPeople: "0",
      photoImage: [],
    },
    SRV00002: {
      serviceId: 2,
      startDate: dayjs(),
      endDate: dayjs(),
      place: "",
      numberOfPeople: "0",
      photoImage: [],
    },
    SRV00003: {
      serviceId: 3,
      startDate: dayjs(),
      endDate: dayjs(),
      place: "",
      numberOfPeople: "0",
      photoImage: [],
    },
    SRV00004: {
      serviceId: 4,
      startDate: dayjs(),
      endDate: dayjs(),
      place: "",
      numberOfPeople: "0",
      photoImage: [],
    },
  };

  const initialErrors = {
    SRV00001: {
      startDate: { status: false, message: "" },
      endDate: { status: false, message: "" },
      place: { status: false, message: "" },
      numberOfPeople: { status: false, message: "" },
      photoImage: { status: false, message: "" },
    },
    SRV00002: {
      startDate: { status: false, message: "" },
      endDate: { status: false, message: "" },
      place: { status: false, message: "" },
      numberOfPeople: { status: false, message: "" },
      photoImage: { status: false, message: "" },
    },
    SRV00003: {
      startDate: { status: false, message: "" },
      endDate: { status: false, message: "" },
      place: { status: false, message: "" },
      numberOfPeople: { status: false, message: "" },
      photoImage: { status: false, message: "" },
    },
    SRV00004: {
      startDate: { status: false, message: "" },
      endDate: { status: false, message: "" },
      place: { status: false, message: "" },
      numberOfPeople: { status: false, message: "" },
      photoImage: { status: false, message: "" },
    },
  };
  const [serviceData, setServiceData] =
    useState<ServiceData>(initialServiceData);
  const [errors, setErrors] = useState<ErrorsServiceData>(initialErrors);
  const [eventName, setEventName] = useState<string>("");
  const [activeObj, setActiveObj] = useState<string>("");
  const [nature, setNature] = useState<string>("");
  const [speaker, setSpeaker] = useState<string>("");
  const { imgSettings, dateFormat, decimalVal } =
    useContainer(CommonTypeContainer);
  const [errorsOptions, setErrorOptions] = useState({
    targetParticipants: { status: false, message: "" },
    eventName: { status: false, message: "" },
    nature: { status: false, message: "" },
    speaker: { status: false, message: "" },
  });
  const [serviceFlg, setServiceFlg] = useState<number>(0);
  const AdditionalService = [
    {
      serviceName: "SRV00001",
      label: t("report.additionalServicePictures"),
    },
    {
      serviceName: "SRV00002",
      label: t("report.otherCollectionPoint"),
    },
    {
      serviceName: "SRV00003",
      label: t("report.communityCollectionPoint"),
    },
    {
      serviceName: "SRV00004",
      label: t("report.promotionalAndEducationalEventLocations"),
    },
  ];
  const [disableState, setDisableState] = useState<boolean>(false);
  const [selectedFieldService, setSelectedFieldService] =
    useState<string>("Recycling Spots");

  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const tempV = [];

      if (serviceData.hasOwnProperty(selectedService)) {
        const entry = serviceData[selectedService as ServiceName];
        const serviceLabel =
          AdditionalService.find(
            (value) => value.serviceName === selectedService
          )?.label ?? selectedService; // Fallback to key if no match

        const startDate = entry.startDate ? dayjs(entry.startDate) : null;
        const endDate = entry.endDate ? dayjs(entry.endDate) : null;

        if (!startDate || !startDate.isValid()) {
          tempV.push({
            field: `${serviceLabel} ${t("report.dateAndTime")}`,
            problem: formErr.empty,
            type: "error",
          });
        } else if (startDate.year() < 1900) {
          tempV.push({
            field: `${serviceLabel} ${t("report.dateAndTime")}`,
            problem: formErr.invalidDate, // Add translation for this
            type: "error",
          });
        }

        if (!endDate || !endDate.isValid()) {
          tempV.push({
            field: `${serviceLabel} ${t("report.to")}`,
            problem: formErr.empty,
            type: "error",
          });
        } else if (endDate.year() > 2099) {
          tempV.push({
            field: `${serviceLabel} ${t("report.to")}`,
            problem: formErr.invalidDate, // Add translation for this
            type: "error",
          });
        }

        if (startDate && endDate) {
          if (startDate.isAfter(endDate)) {
            tempV.push({
              field: `${serviceLabel} ${t("report.dateAndTime")}`,
              problem: formErr.startDateBehindEndDate,
              type: "error",
            });
          }
        }

        if (!entry.place || isEmptyOrWhitespace(entry.place)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.address")}`,
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

        if (
          !entry.numberOfPeople ||
          isEmptyOrWhitespace(entry.numberOfPeople)
        ) {
          tempV.push({
            field: `${serviceLabel} ${t("report.numberOfPeople")}`,
            problem: formErr.empty,
            type: "error",
          });
        }

        if (selectedService === "SRV00004") {
          if (eventName === "" || isEmptyOrWhitespace(eventName)) {
            tempV.push({
              field: `${serviceLabel} ${t("report.eventName")}`,
              problem: formErr.empty,
              type: "error",
            });
          }
          if (nature === "" || isEmptyOrWhitespace(nature)) {
            tempV.push({
              field: `${serviceLabel} ${t("report.nature")}`,
              problem: formErr.empty,
              type: "error",
            });
          }
          if (speaker === "" || isEmptyOrWhitespace(speaker)) {
            tempV.push({
              field: `${serviceLabel} ${t("report.speaker")}`,
              problem: formErr.empty,
              type: "error",
            });
          }
          if (activeObj === "" || isEmptyOrWhitespace(activeObj)) {
            tempV.push({
              field: `${serviceLabel} ${t("report.targetParticipants")}`,
              problem: formErr.empty,
              type: "error",
            });
          }
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
        AdditionalService.find((value) => value.serviceName === selectedService)
          ?.label ?? selectedService; // Fallback to key if no match

      const startDate = entry.startDate ? dayjs(entry.startDate) : null;
      const endDate = entry.endDate ? dayjs(entry.endDate) : null;

      if (!startDate || !startDate.isValid()) {
        tempV.push({
          field: `${serviceLabel} ${t("report.dateAndTime")}`,
          problem: formErr.empty,
          type: "error",
        });
      } else if (startDate.year() < 1900) {
        tempV.push({
          field: `${serviceLabel} ${t("report.dateAndTime")}`,
          problem: formErr.invalidDate, // Add translation for this
          type: "error",
        });
      }

      if (!endDate || !endDate.isValid()) {
        tempV.push({
          field: `${serviceLabel} ${t("report.to")}`,
          problem: formErr.empty,
          type: "error",
        });
      } else if (endDate.year() > 2099) {
        tempV.push({
          field: `${serviceLabel} ${t("report.to")}`,
          problem: formErr.invalidDate, // Add translation for this
          type: "error",
        });
      }

      if (startDate && endDate) {
        if (startDate.isAfter(endDate)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.dateAndTime")}`,
            problem: formErr.startDateBehindEndDate,
            type: "error",
          });
        }
      }

      if (!entry.place || isEmptyOrWhitespace(entry.place)) {
        tempV.push({
          field: `${serviceLabel} ${t("report.address")}`,
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

      if (!entry.numberOfPeople || isEmptyOrWhitespace(entry.numberOfPeople)) {
        tempV.push({
          field: `${serviceLabel} ${t("report.numberOfPeople")}`,
          problem: formErr.empty,
          type: "error",
        });
      }

      if (selectedService === "SRV00004") {
        if (eventName === "" || isEmptyOrWhitespace(eventName)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.eventName")}`,
            problem: formErr.empty,
            type: "error",
          });
        }
        if (nature === "" || isEmptyOrWhitespace(nature)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.nature")}`,
            problem: formErr.empty,
            type: "error",
          });
        }
        if (speaker === "" || isEmptyOrWhitespace(speaker)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.speaker")}`,
            problem: formErr.empty,
            type: "error",
          });
        }
        if (activeObj === "" || isEmptyOrWhitespace(activeObj)) {
          tempV.push({
            field: `${serviceLabel} ${t("report.targetParticipants")}`,
            problem: formErr.empty,
            type: "error",
          });
        }
      }
    }

    setValidation(tempV);
  };

  const onHandleError = (
    serviceName: ServiceName,
    property: string,
    value: any,
    message: string
  ) => {
    const entry = serviceData[serviceName as ServiceName];
    const errorService = errors[serviceName as ServiceName];

    if (message === "succeed") {
      setErrors((prev) => {
        return {
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            [property]: { status: false, message },
          },
        };
      });
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            [property]: { status: true, message },
          },
        };
      });
    }
  };

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    ServiceName: ServiceName
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [ServiceName]: { ...prevData[ServiceName], photoImage: imageList },
    }));
    // console.log(`Updated image list for ${serviceId}:`, imageList)
  };

  const updateData = (
    serviceName: ServiceName,
    property: string,
    value: any
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceName]: {
        ...prevData[serviceName],
        [property]: value,
      },
    }));

    if (value === "" || value === 0) {
      const message = returnErrorMsg(formErr.empty);
      onHandleError(serviceName, property, value, message);
    } else {
      onHandleError(serviceName, property, value, "succeed");
    }
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

  //validation function
  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "" || isEmptyOrWhitespace(s);
  };

  const checkNumber = (n: number) => {
    if (!trySubmited) {
      return false;
    }
    return Number.isNaN(n) || (!Number.isNaN(n) && n < 1);
  };

  const returnErrorMsg = (error: string) => {
    var msg = "";
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
      case formErr.startDateBehindEndDate:
        msg = t("form.error.startDateBehindEndDate");
        break;
      case formErr.invalidDate:
        msg = t("pick_up_order.error.invalid_date");
        break;
    }
    return msg;
  };

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  };

  const resetServiceData = () => {
    setValidation([]);
    setServiceData(initialServiceData);
    setEventName("");
    setNature("");
    setSpeaker("");
    setActiveObj("");
  };

  const submitServiceInfo = async () => {
    setTrySubmited(false);
    validateData();

    // Get the selected service data
    const serviceItem = serviceData[selectedService];
    const error = errors[selectedService];

    // If serviceItem is undefined, return early
    if (!serviceItem) return;

    if (validation.length > 0) {
      setTrySubmited(true);
      return;
    }

    // Convert images to Base64
    const imgList: string[] = ImageToBase64(serviceItem.photoImage);

    // Prepare form data
    const formData: ServiceInfo = {
      serviceId: serviceItem.serviceId,
      address: serviceItem.place,
      addressGps: [0],
      serviceName: serviceItem.serviceId === 4 ? eventName : "",
      participants: activeObj,
      startAt: formattedDate(serviceItem.startDate),
      endAt: formattedDate(serviceItem.endDate),
      photo: imgList,
      numberOfVisitor: serviceItem.numberOfPeople,
      createdBy: loginId,
      updatedBy: loginId,
      nature: serviceItem.serviceId === 4 ? nature : "",
      speaker: serviceItem.serviceId === 4 ? speaker : "",
      additionalFlg: serviceItem.serviceId === 4 && serviceFlg === 0,
    };

    try {
      setDisableState(true);
      const result = await createServiceInfo(formData);
      if (result) {
        const toastMsg =
          t("report.additionalServicePicturesTitle") +
          " " +
          t("common.saveSuccessfully");
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
    } finally {
      setDisableState(false);
    }
  };

  const serviceTypeList = [
    {
      id: "additional",
      name: t("report.additional"),
    },
    {
      id: "other_services",
      name: t("report.other_services"),
    },
  ];

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
                    AdditionalService.find(
                      (value) => value.serviceName === e.target.value
                    )?.label ?? e.target.value;
                  setSelectedFieldService(serviceLabel);
                  setSelectedService(e.target.value as ServiceName);
                  setTrySubmited(false);
                  resetServiceData();
                }}
                label={t("report.selectService")}
              >
                {AdditionalService.map((service) => (
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

          {AdditionalService.filter(
            (item) => item.serviceName === selectedService
          ).map((item) => (
            <Grid
              key={item.serviceName}
              container
              direction={"column"}
              spacing={2.5}
              sx={{
                width: { sm: "100%", xs: "100%" },
                marginTop: { sm: 1, xs: 6 },
                marginLeft: {
                  xs: 0,
                },
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid
                container
                direction={"column"}
                spacing={2.5}
                sx={{
                  width: { sm: "384px", xs: "100%" },
                  marginTop: { sm: 1, xs: 6 },
                  marginLeft: {
                    xs: 0,
                  },
                }}
                className="sm:ml-0 mt-o w-full"
              >
                <Grid item>
                  <Typography sx={styles.header2}>{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>
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
                        maxDate={
                          serviceData[item.serviceName as keyof ServiceData]
                            .endDate
                        }
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
                    <Box
                      sx={{
                        ...localstyles.timePeriodItem,
                        borderColor:
                          trySubmited &&
                          validation.find(
                            (value) =>
                              value.field ===
                              `${selectedFieldService} ${t(
                                "report.dateAndTime"
                              )}`
                          )
                            ? "rgb(211, 47, 47)"
                            : "rgb(226, 226, 226)",
                        borderWidth:
                          trySubmited &&
                          validation.find(
                            (value) =>
                              value.field ===
                              `${selectedFieldService} ${t(
                                "report.dateAndTime"
                              )}`
                          )
                            ? "1px"
                            : "2px",
                      }}
                    >
                      <TimePicker
                        value={
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        }
                        timeSteps={{ minutes: 1 }}
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            "startDate",
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
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.serviceName as keyof ErrorsServiceData]
                      .startDate.status
                      ? errors[item.serviceName as keyof ErrorsServiceData]
                          .startDate.message
                      : ''}
                  </Typography> */}
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>{t("report.to")}</Typography>
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
                        minDate={
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        }
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            "endDate",
                            value!!
                          )
                        }
                        sx={{ ...localstyles.datePicker }}
                      />
                    </Box>
                    <Box
                      sx={{
                        ...localstyles.timePeriodItem,
                        borderColor:
                          trySubmited &&
                          validation.find(
                            (value) =>
                              value.field ===
                              `${selectedFieldService} ${t(
                                "report.dateAndTime"
                              )}`
                          )
                            ? "rgb(211, 47, 47)"
                            : "rgb(226, 226, 226)",
                        borderWidth:
                          trySubmited &&
                          validation.find(
                            (value) =>
                              value.field ===
                              `${selectedFieldService} ${t(
                                "report.dateAndTime"
                              )}`
                          )
                            ? "1px"
                            : "2px",
                      }}
                    >
                      <TimePicker
                        value={
                          serviceData[item.serviceName as keyof ServiceData]
                            .endDate
                        }
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            "endDate",
                            value!!
                          )
                        }
                        timeSteps={{ minutes: 1 }}
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
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.serviceName as keyof ErrorsServiceData].endDate
                      .status
                      ? errors[item.serviceName as keyof ErrorsServiceData]
                          .endDate.message
                      : ''}
                  </Typography> */}
                </Grid>
                <Grid item style={{ display: "flex", flexDirection: "column" }}>
                  <CustomField label={t("report.address")}>
                    <CustomTextField
                      id="place"
                      placeholder={t("report.pleaseEnterAddress")}
                      onChange={(event) => {
                        updateData(
                          item.serviceName as ServiceName,
                          "place",
                          event.target.value
                        );
                      }}
                      value={
                        serviceData[item.serviceName as keyof ServiceData].place
                      }
                      multiline={true}
                      error={checkString(
                        serviceData[item.serviceName as keyof ServiceData].place
                      )}
                    />
                  </CustomField>
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.serviceName as keyof ErrorsServiceData].place
                      .status
                      ? errors[item.serviceName as keyof ErrorsServiceData]
                          .place.message
                      : ''}
                  </Typography> */}
                </Grid>
                {selectedService === "SRV00004" && (
                  <Grid item>
                    <div className="mb-4">
                      <CustomField label={t("report.eventName")}>
                        <CustomTextField
                          id="eventName"
                          placeholder={t("report.pleaseEnterEventName")}
                          value={eventName}
                          onChange={(event) => {
                            setEventName(event.target.value);
                            setErrorOptions((prev) => {
                              return {
                                ...prev,
                                eventName: {
                                  status: event.target.value ? false : true,
                                  message: event.target.value
                                    ? ""
                                    : t("form.error.shouldNotBeEmpty"),
                                },
                              };
                            });
                          }}
                          error={checkString(eventName)}
                        />
                      </CustomField>
                      {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                        {errorsOptions.eventName.status
                          ? errorsOptions.eventName.message
                          : ''}
                      </Typography> */}
                    </div>

                    <div className="mb-4">
                      <CustomField label={t("report.nature")}>
                        <CustomTextField
                          id="nature"
                          placeholder={t("report.enterNature")}
                          value={nature}
                          onChange={(event) => {
                            setNature(event.target.value);
                            setErrorOptions((prev) => {
                              return {
                                ...prev,
                                nature: {
                                  status: event.target.value ? false : true,
                                  message: event.target.value
                                    ? ""
                                    : t("form.error.shouldNotBeEmpty"),
                                },
                              };
                            });
                          }}
                          error={checkString(nature)}
                        />
                      </CustomField>
                      {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                        {errorsOptions.nature.status
                          ? errorsOptions.nature.message
                          : ''}
                      </Typography> */}
                    </div>

                    <div className="mb-4">
                      <CustomField label={t("report.speaker")}>
                        <CustomTextField
                          id="speaker"
                          placeholder={t("report.enterSpeaker")}
                          value={speaker}
                          onChange={(event) => {
                            setSpeaker(event.target.value);
                            setErrorOptions((prev) => {
                              return {
                                ...prev,
                                speaker: {
                                  status: event.target.value ? false : true,
                                  message: event.target.value
                                    ? ""
                                    : t("form.error.shouldNotBeEmpty"),
                                },
                              };
                            });
                          }}
                          error={checkString(speaker)}
                        />
                      </CustomField>
                      {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                        {errorsOptions.speaker.status
                          ? errorsOptions.speaker.message
                          : ''}
                      </Typography> */}
                    </div>

                    <Grid
                      item
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <CustomField label={t("report.targetParticipants")}>
                        <CustomTextField
                          id="targetParticipants"
                          placeholder={t(
                            "report.pleaseEnterTargetParticipants"
                          )}
                          value={activeObj}
                          onChange={(event) => {
                            setActiveObj(event.target.value);
                            setErrorOptions((prev) => {
                              return {
                                ...prev,
                                targetParticipants: {
                                  status: event.target.value ? false : true,
                                  message: event.target.value
                                    ? ""
                                    : t("form.error.shouldNotBeEmpty"),
                                },
                              };
                            });
                          }}
                          error={checkString(activeObj)}
                        />
                      </CustomField>
                      {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                        {errorsOptions.targetParticipants.status
                          ? errorsOptions.targetParticipants.message
                          : ''}
                      </Typography> */}
                    </Grid>
                  </Grid>
                )}
                <Grid item style={{ display: "flex", flexDirection: "column" }}>
                  <CustomField label={t("report.numberOfPeople")}>
                    <CustomTextField
                      id="numberOfPeople"
                      placeholder={t("report.pleaseEnterNumberOfPeople")}
                      value={
                        serviceData[item.serviceName as keyof ServiceData]
                          .numberOfPeople
                      }
                      onChange={(event) => {
                        // updateData(
                        //   item.serviceName as ServiceName,
                        //   'numberOfPeople',
                        //   parseInt(event.target.value, 10) || 0
                        // )

                        onChangeWeight(
                          event.target.value,
                          decimalVal,
                          (value: string) => {
                            updateData(
                              item.serviceName as ServiceName,
                              "numberOfPeople",
                              value
                            );
                          }
                        );
                      }}
                      error={checkString(
                        serviceData[item.serviceName as keyof ServiceData]
                          .numberOfPeople
                      )}
                    />
                  </CustomField>
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.serviceName as keyof ErrorsServiceData]
                      .numberOfPeople.status
                      ? errors[item.serviceName as keyof ErrorsServiceData]
                          .numberOfPeople.message
                      : ''}
                  </Typography> */}
                </Grid>

                {selectedService === "SRV00004" && (
                  <CustomField label={t("col.serviceType")}>
                    <CustomItemListBoolean
                      items={serviceTypeList}
                      setServiceFlg={setServiceFlg}
                      value={serviceFlg}
                      editable={true}
                    ></CustomItemListBoolean>
                  </CustomField>
                )}
                <Grid item style={{ display: "flex", flexDirection: "column" }}>
                  {/* image field */}
                  <Box key={t("report.picture") + selectedService}>
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
                                serviceData[
                                  item.serviceName as keyof ServiceData
                                ].photoImage.length === 0 &&
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
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.serviceName as keyof ErrorsServiceData]
                      .photoImage.status
                      ? errors[item.serviceName as keyof ErrorsServiceData]
                          .photoImage.message
                      : ''}
                  </Typography> */}
                </Grid>
              </Grid>
              <Divider />
            </Grid>
          ))}
          <Grid item sx={{ width: "100%" }}>
            {trySubmited &&
              validation.map((val, index) => {
                const serviceLabel =
                  AdditionalService.find(
                    (value) => value.serviceName === selectedService
                  )?.label ?? selectedService; // Use label for matching

                if (val.field.includes(serviceLabel)) {
                  return (
                    <FormErrorMsg
                      key={index}
                      field={val.field} // No need to re-translate, it's already translated
                      errorMsg={returnErrorMsg(val.problem)}
                      type={val.type}
                    />
                  );
                }
              })}
          </Grid>

          <Grid item className="lg:flex sm:block text-center">
            <Button
              sx={[
                styles.buttonFilledGreen,
                localstyles.localButton,
                { marginBottom: { md: 0, xs: 2 }, marginTop: 2, ml: 2 },
              ]}
              disabled={disableState}
              onClick={() => submitServiceInfo()}
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

export default AdditionalServicePict;
