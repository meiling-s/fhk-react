import { FunctionComponent, useState, useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  Card,
  FormControl,
  ButtonBase,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { CAMERA_OUTLINE_ICON } from "../../../themes/icons";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ImageUploading, { ImageListType } from "react-images-uploading";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { styles } from "../../../constants/styles";
import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import {
  Vehicle,
  CreateVehicle as CreateVehicleForm,
} from "../../../interfaces/vehicles";
import { STATUS_CODE, formErr } from "../../../constants/constant";
import {
  returnErrorMsg,
  ImageToBase64,
  extractError,
  showErrorToast,
} from "../../../utils/utils";
import { il_item } from "../../../components/FormComponents/CustomItemList";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import {
  createVehicles as addVehicle,
  deleteVehicle,
  editVehicle,
} from "../../../APICalls/Collector/vehicles";
import { localStorgeKeyName } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import { useNavigate } from "react-router-dom";

interface CreateVehicleProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  rowId?: number;
  selectedItem?: Vehicle | null;
  plateListExist: string[];
}

const CreateVehicle: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  plateListExist,
}) => {
  const { t } = useTranslation();
  const serviceList: il_item[] = [
    {
      id: "basic",
      name: "basic",
    },
    {
      id: "additional",
      name: "additional",
    },
  ];
  const [serviceType, setServiceType] = useState<il_item[]>(serviceList);
  const [selectedService, setSelectedService] = useState<il_item>({
    id: "basic",
    name: t("vehicle.basic"),
  });
  const [vehicleTypeList, setVehicleType] = useState<il_item[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<il_item>({
    id: "",
    name: "",
  });
  const [licensePlate, setLicensePlate] = useState("");
  const [pictures, setPictures] = useState<ImageListType>([]);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const { vehicleType, imgSettings } = useContainer(CommonTypeContainer);
  const [listedPlate, setListedPlate] = useState<string[]>([]);
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      const service = serviceType.find(
        (item) => item.id == selectedItem.serviceType.toLocaleLowerCase()
      );
      setSelectedService(service || serviceType[0]);
      setSelectedVehicle({
        id: selectedItem.vehicleTypeId,
        name: selectedItem.vehicleName,
      });
      setLicensePlate(selectedItem.plateNo);

      const imageList: any = selectedItem.photo.map(
        (url: string, index: number) => {
          const format = url.startsWith("data:image/png") ? "png" : "jpeg";
          const imgdata = `data:image/${format};base64,${url}`;

          return {
            data_url: imgdata,
            file: {
              name: `image${index + 1}`,
              size: 0,
              type: "image/jpeg",
            },
          };
        }
      );

      setPictures(imageList);
    }
  };

  const getListedPlate = () => {
    let plate: string[] = [];
    if (selectedItem != null && plateListExist != undefined) {
      plate = plateListExist.filter((item) => item != selectedItem.plateNo);
      setListedPlate(plate);
    } else {
      setListedPlate(plateListExist);
    }
  };

  useEffect(() => {
    getserviceList();
    getVehicles();
    getListedPlate();
    setValidation([]);
    if (action !== "add") {
      mappingData();
    } else {
      setTrySubmited(false);
      resetData();
    }
  }, [drawerOpen]);

  const getserviceList = () => {};

  const getVehicles = () => {
    if (vehicleType) {
      const carType: il_item[] = [];
      vehicleType?.forEach((vehicle) => {
        var name = "";
        switch (i18n.language) {
          case "enus":
            name = vehicle.vehicleTypeNameEng;
            break;
          case "zhch":
            name = vehicle.vehicleTypeNameSchi;
            break;
          case "zhhk":
            name = vehicle.vehicleTypeNameTchi;
            break;
          default:
            name = vehicle.vehicleTypeNameTchi;
            break;
        }
        const vehicleType: il_item = {
          id: vehicle.vehicleTypeId,
          name: name,
        };
        carType.push(vehicleType);
      });
      setVehicleType(carType);
      // console.log('carType', carType)
    }
  };

  const resetData = () => {
    setSelectedService(serviceType[0]);
    setSelectedVehicle({ id: "", name: "" });
    setLicensePlate("");
    setPictures([]);
    setValidation([]);
  };

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setPictures(imageList);
  };

  const removeImage = (index: number) => {
    // Remove the image at the specified index
    const newPictures = [...pictures];
    newPictures.splice(index, 1);
    setPictures(newPictures);
  };

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "";
  };

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = [];

      selectedService?.toString() == "" &&
        tempV.push({
          field: t("vehicle.serviceType"),
          problem: formErr.empty,
          type: "error",
        });
      selectedVehicle?.id.toString() == "" &&
        tempV.push({
          field: t("vehicle.vehicleType"),
          problem: formErr.empty,
          type: "error",
        });
      licensePlate?.toString() == "" &&
        tempV.push({
          field: t("vehicle.licensePlate"),
          problem: formErr.empty,
          type: "error",
        });
      // console.log('listedPlate', listedPlate)
      listedPlate?.includes(licensePlate) &&
        tempV.push({
          field: t("vehicle.licensePlate"),
          problem: formErr.alreadyExist,
          type: "error",
        });
      pictures.length == 0 &&
        tempV.push({
          field: t("vehicle.picture"),
          problem: formErr.empty,
          type: "error",
        });
      pictures.length < 2 &&
        tempV.push({
          field: t("vehicle.picture"),
          problem: formErr.minMoreOneImgUploded,
          type: "error",
        });
      setValidation(tempV);
    };

    validate();
  }, [selectedService, selectedVehicle, listedPlate, licensePlate, pictures]);

  const checkErrorMessage = (message: string) => {
    const tempV: formValidate[] = [];
    if (message.includes("[Vehicle Plate No] already exist.")) {
      tempV.push({
        field: t("vehicle.licensePlate"),
        problem: formErr.alreadyExist,
        type: "error",
      });
      setValidation(tempV);
    }
    return null;
  };

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

    const formData: CreateVehicleForm = {
      vehicleTypeId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      plateNo: licensePlate,
      serviceType: selectedService.id,
      photo: ImageToBase64(pictures),
      status: "ACTIVE",
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === "edit" && { version: selectedItem?.version }),
    };
    if (action == "add") {
      handleCreateVehicle(formData);
    } else {
      handleEditVehicle(formData);
    }
  };

  const handleCreateVehicle = async (formData: CreateVehicleForm) => {
    try {
      if (validation.length === 0) {
        const result = await addVehicle(formData);
        if (result) {
          onSubmitData("success", t("common.saveSuccessfully"));
          resetData();
          handleDrawerClose();
        } else {
          onSubmitData("error", t("common.saveFailed"));
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else {
        // onSubmitData('error', t('common.saveFailed'))
        if (error?.response?.data?.status === STATUS_CODE[500]) {
          setValidation([
            {
              field: t("common.vehicle"),
              problem: formErr.alreadyExist,
              type: "error",
            },
          ]);
        } else if (state.code === STATUS_CODE[409]) {
          checkErrorMessage(error.response.data.message);
        }
        setTrySubmited(true);
      }
    }
  };

  const handleEditVehicle = async (formData: CreateVehicleForm) => {
    try {
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editVehicle(formData, selectedItem.vehicleId!);
          if (result) {
            onSubmitData("success", t("common.editSuccessfully"));
            resetData();
            handleDrawerClose();
          }
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message);
      }
    }
  };

  const handleDelete = async () => {
    const status = "DELETED";
    if (selectedItem != null) {
      const result = await deleteVehicle(status, selectedItem.vehicleId);
      if (result) {
        onSubmitData("success", t("common.deletedSuccessfully"));
        resetData();
        handleDrawerClose();
      } else {
        onSubmitData("error", t("common.deleteFailed"));
      }
    }
  };

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={action}
        headerProps={{
          title:
            action == "add"
              ? t("top_menu.add_new")
              : action == "delete"
              ? t("add_warehouse_page.delete")
              : t("userGroup.change"),
          subTitle: t("vehicle.vehicleType"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t("common.deleteMessage"),
        }}
      >
        <Divider></Divider>
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={"column"}
            spacing={4}
            sx={{
              width: { xs: "100%" },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0,
              },
              paddingRight: 2,
            }}
            className="sm:ml-0 mt-o w-full"
          >
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t("vehicle.serviceType")}
              </Typography>
              <FormControl
                sx={{
                  width: "100%",
                }}
              >
                {/* <InputLabel id="serviceType">
                  {t('vehicle.serviceType')}
                </InputLabel> */}
                <Select
                  labelId="serviceType"
                  id="serviceType"
                  value={selectedService.id}
                  sx={{
                    borderRadius: "12px",
                  }}
                  disabled={action === "delete"}
                  // label={t('vehicle.serviceType')}
                  //onChange={(event) => setSelectedService(event.target.value)}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = serviceType.find(
                      (item) => item.id === event.target.value
                    );
                    if (selectedValue) {
                      setSelectedService(selectedValue);
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{t("check_in.any")}</em>
                  </MenuItem>
                  {serviceType.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {t(`vehicle.${item.name}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t("vehicle.vehicleType")}
              </Typography>
              <FormControl
                sx={{
                  width: "100%",
                }}
              >
                <InputLabel id="vehicleType">
                  {t("vehicle.vehicleType")}
                </InputLabel>
                <Select
                  labelId="vehicleType"
                  id="vehicleType"
                  value={selectedVehicle.id}
                  disabled={action === "delete"}
                  error={checkString(selectedVehicle.id)}
                  sx={{
                    borderRadius: "12px",
                  }}
                  label={t("vehicle.vehicleType")}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = vehicleTypeList.find(
                      (item) => item.id === event.target.value
                    );
                    if (selectedValue) {
                      setSelectedVehicle(selectedValue);
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{t("check_in.any")}</em>
                  </MenuItem>
                  {vehicleTypeList.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <CustomField label={t("vehicle.licensePlate")}>
              <CustomTextField
                id="licensePlate"
                value={licensePlate}
                disabled={action === "delete"}
                placeholder={t("vehicle.please_enter_pla_number")}
                onChange={(event) => setLicensePlate(event.target.value)}
                error={
                  checkString(licensePlate) ||
                  (listedPlate?.includes(licensePlate) && trySubmited)
                }
              />
            </CustomField>
            <Grid item>
              {/* image field */}
              <Box key={t("report.picture")}>
                <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                  {t("report.picture")}
                </Typography>
                <ImageUploading
                  multiple
                  value={pictures}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex)
                  }
                  maxNumber={imgSettings?.ImgQuantity}
                  maxFileSize={imgSettings?.ImgSize}
                  dataURLKey="data_url"
                  acceptType={["jpg", "jpeg", "png"]}
                >
                  {({ imageList, onImageUpload, onImageRemove, errors }) => (
                    <Box className="box">
                      <Card
                        sx={{
                          ...localstyles.cardImg,
                          ...(trySubmited &&
                            (imageList.length === 0 || imageList.length < 2) &&
                            localstyles.imgError),
                        }}
                      >
                        <ButtonBase
                          sx={localstyles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: "#ACACAC" }} />
                          <Typography
                            sx={[styles.labelField, { fontWeight: "bold" }]}
                          >
                            {t("report.uploadPictures")}
                          </Typography>
                        </ButtonBase>
                      </Card>
                      {errors && (
                        <div>
                          {errors.maxFileSize && (
                            <span style={{ color: "red" }}>
                              Selected file size exceeds maximum file size{" "}
                              {imgSettings?.ImgSize / 1000000} mb
                            </span>
                          )}
                        </div>
                      )}
                      <ImageList sx={localstyles.imagesContainer} cols={4}>
                        {imageList.map((image, index) => (
                          <ImageListItem
                            key={image["file"]?.name}
                            style={{ position: "relative", width: "100px" }}
                          >
                            <img
                              style={localstyles.image}
                              src={image["data_url"]}
                              alt={image["file"]?.name}
                              loading="lazy"
                            />
                            <ButtonBase
                              onClick={(event) => {
                                onImageRemove(index);
                                removeImage(index);
                              }}
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "2px",
                                padding: "4px",
                              }}
                            >
                              <CancelRoundedIcon className="text-white" />
                            </ButtonBase>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </ImageUploading>
              </Box>
              <div className="note">
                <p className="text-sm text-gray">{t("vehicle.imgNote")}</p>
              </div>
              <Grid item sx={{ width: "100%" }}>
                {trySubmited &&
                  validation.map((val, index) => (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem, t)}
                      type={val.type}
                    />
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
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
  imagesContainer: {
    width: "100%",
    height: "fit-content",
  },
  image: {
    aspectRatio: "1/1",
    width: "100px",
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
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
  },
  imgError: {
    border: "1px solid red",
  },
};

export default CreateVehicle;
