import { FunctionComponent, useState, useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Button,
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
import { EVENT_RECORDING } from "../../../constants/configs";
import { styles } from "../../../constants/styles";

import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import {
  Vehicle,
  CreateVehicle as CreateVehicleForm,
} from "../../../interfaces/vehicles";
import { formErr } from "../../../constants/constant";
import { returnErrorMsg, ImageToBase64 } from "../../../utils/utils";
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
import { DenialReason } from "../../../interfaces/denialReason";
import { getAllFunction } from "../../../APICalls/Collector/userGroup";
import { Functions } from "../../../interfaces/userGroup";
import { createDenialReason } from "../../../APICalls/Collector/denialReason";

interface CreateVehicleProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  rowId?: number;
  selectedItem?: DenialReason | null;
}

const CreateVehicle: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
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
    id: "1",
    name: "Van",
  });
  const [licensePlate, setLicensePlate] = useState("");
  const [pictures, setPictures] = useState<ImageListType>([]);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const { vehicleType } = useContainer(CommonTypeContainer);
  const [listedPlate, setListedPlate] = useState<string[]>([]);
  const [form, setForm] = useState({
    reasonNameTchi: "",
    reasonNameSchi: "",
    reasonNameEng: "",
    description: "",
    remark: "",
    functionId: null,
  });
  const [functionList, setFunctionList] = useState<Functions[]>([]);
  const initFunctionList = async () => {
    const result = await getAllFunction();
    const data = result?.data;
    setFunctionList(data);
  };
  console.log(functionList);

  const mappingData = () => {
    // if (selectedItem != null) {
    //   const service = serviceType.find(
    //     (item) => item.id == selectedItem.serviceType.toLocaleLowerCase()
    //   );
    //   setSelectedService(service || serviceType[0]);
    //   setSelectedVehicle({
    //     id: selectedItem.vehicleTypeId,
    //     name: selectedItem.vehicleName,
    //   });
    //   setLicensePlate(selectedItem.plateNo);
    //   const imageList: any = selectedItem.photo.map(
    //     (url: string, index: number) => {
    //       const format = url.startsWith("data:image/png") ? "png" : "jpeg";
    //       const imgdata = `data:image/${format};base64,${url}`;
    //       return {
    //         data_url: imgdata,
    //         file: {
    //           name: `image${index + 1}`,
    //           size: 0,
    //           type: "image/jpeg",
    //         },
    //       };
    //     }
    //   );
    //   setPictures(imageList);
    // }
  };

  const getListedPlate = () => {
    // let plate: string[] = [];
    // if (selectedItem != null && plateListExist != undefined) {
    //   plate = plateListExist.filter((item) => item != selectedItem.plateNo);
    // } else {
    //   setListedPlate(plateListExist);
    // }
    // setListedPlate(plate);
  };

  useEffect(() => {
    // getserviceList();
    // getVehicles();
    // getListedPlate();
    // setValidation([]);
    // if (action !== "add") {
    //   mappingData();
    // } else {
    //   setTrySubmited(false);
    //   resetData();
    // }
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      initFunctionList();
      setForm({
        reasonNameTchi: "",
        reasonNameSchi: "",
        reasonNameEng: "",
        description: "",
        remark: "",
        functionId: null,
      });
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
      console.log("carType", carType);
    }
  };

  const resetData = () => {
    setSelectedService(serviceType[0]);
    setSelectedVehicle({ id: "1", name: "Van" });
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
      selectedVehicle?.toString() == "" &&
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
      console.log("listedPlate", listedPlate);
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
      console.log("tempV", tempV);
      setValidation(tempV);
    };

    validate();
  }, [selectedService, selectedVehicle, licensePlate, pictures]);

  const handleSubmit = async () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
    if (action === "add") {
      const response = await createDenialReason({
        ...form,
        functionId: form.functionId as never as number,
      });
      console.log(response);
    }
  };

  const handleCreateVehicle = async (formData: CreateVehicleForm) => {
    if (validation.length === 0) {
      const result = await addVehicle(formData);
      if (result) {
        onSubmitData("success", "Success created data");
        resetData();
        handleDrawerClose();
      } else {
        onSubmitData("error", "Failed created data");
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleEditVehicle = async (formData: CreateVehicleForm) => {
    // if (validation.length === 0) {
    //   if (selectedItem != null) {
    //     const result = await editVehicle(formData, selectedItem.vehicleId!);
    //     if (result) {
    //       onSubmitData("success", "Edit data success");
    //       resetData();
    //       handleDrawerClose();
    //     }
    //   }
    // } else {
    //   setTrySubmited(true);
    // }
  };

  const handleDelete = async () => {
    const status = "DELETED";
    // if (selectedItem != null) {
    //   const result = await deleteVehicle(status, selectedItem.vehicleId);
    //   if (result) {
    //     onSubmitData("success", "Deleted data success");
    //     resetData();
    //     handleDrawerClose();
    //   } else {
    //     onSubmitData("error", "Deleted data success");
    //   }
    // }
  };

  const onChangeForm = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={action}
        headerProps={{
          title: t("top_menu.add_new"),
          subTitle: t("vehicle.vehicleType"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
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
              <CustomField label={t("vehicle.licensePlate")}>
                <CustomTextField
                  id="licensePlate"
                  value={form.reasonNameTchi}
                  disabled={action === "delete"}
                  placeholder={t("vehicle.licensePlate")}
                  onChange={(event) =>
                    onChangeForm("reasonNameTchi", event.target.value)
                  }
                  error={checkString(licensePlate)}
                />
              </CustomField>
            </Grid>
            <Grid item>
              <CustomField label={t("vehicle.licensePlate")}>
                <CustomTextField
                  id="licensePlate"
                  value={form.reasonNameSchi}
                  disabled={action === "delete"}
                  placeholder={t("vehicle.licensePlate")}
                  onChange={(event) =>
                    onChangeForm("reasonNameSchi", event.target.value)
                  }
                  error={checkString(licensePlate)}
                />
              </CustomField>
            </Grid>
            <Grid item>
              <CustomField label={t("vehicle.licensePlate")}>
                <CustomTextField
                  id="licensePlate"
                  value={form.reasonNameEng}
                  disabled={action === "delete"}
                  placeholder={t("vehicle.licensePlate")}
                  onChange={(event) =>
                    onChangeForm("reasonNameEng", event.target.value)
                  }
                  error={checkString(licensePlate)}
                />
              </CustomField>
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
                  value={form.functionId as never}
                  disabled={action === "delete"}
                  sx={{
                    borderRadius: "12px",
                  }}
                  label={t("vehicle.vehicleType")}
                  onChange={(event: SelectChangeEvent<string>) => {
                    onChangeForm("functionId", event.target.value);
                  }}
                >
                  {functionList?.map((item, index) => (
                    <MenuItem key={index} value={item.functionId}>
                      {item.functionNameEng}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <CustomField label={t("vehicle.licensePlate")}>
                <CustomTextField
                  id="licensePlate"
                  value={form.description}
                  disabled={action === "delete"}
                  placeholder={t("vehicle.licensePlate")}
                  onChange={(event) =>
                    onChangeForm("description", event.target.value)
                  }
                  multiline
                  textarea
                  error={checkString(licensePlate)}
                />
              </CustomField>
            </Grid>
            <Grid item>
              <CustomField label={t("vehicle.licensePlate")}>
                <CustomTextField
                  id="licensePlate"
                  value={form.remark}
                  disabled={action === "delete"}
                  placeholder={t("vehicle.licensePlate")}
                  onChange={(event) =>
                    onChangeForm("remark", event.target.value)
                  }
                  multiline
                  textarea
                  error={checkString(licensePlate)}
                />
              </CustomField>
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
