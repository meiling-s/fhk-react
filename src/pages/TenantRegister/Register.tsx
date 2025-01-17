import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem,
} from "@mui/material";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import logo_company from "../../logo_company.png";
import { CAMERA_OUTLINE_ICON } from "../../themes/icons";
import CustomCopyrightSection from "../../components/CustomCopyrightSection";
import CustomField from "../../components/FormComponents/CustomField";
import CustomTextField from "../../components/FormComponents/CustomTextField";
import {
  getRegisterLinkStatus,
  getTenantById,
  updateTenantRegInfo,
} from "../../APICalls/tenantManage";
import { styles as constantStyle } from "../../constants/styles";
import { RegisterItem } from "../../interfaces/account";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { extractError, showErrorToast } from "../../utils/utils";
import { STATUS_CODE } from "../../constants/constant";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import i18n from "src/setups/i18n";

interface FormValues {
  [key: string]: string;
}

interface FormField {
  name: string; // Only allow specific field names
  label: string;
  placeholder: string;
  type: string;
}

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

const RegisterTenant = () => {
  const navigate = useNavigate();
  const titlePage = "登記";
  const submitLabel = " 繼續";
  const { tenantId } = useParams();
  const [tenantIdNumber, setTenantIdNumber] = useState(null);
  const [lang, setLang] = useState<string>("");
  const [monetaryValue, setMonetaryValue] = useState<string>("");
  const [formValues, setFormValues] = useState<FormValues>({
    company_category: "",
    company_cn_name: "",
    company_en_name: "",
    company_number: "",
    contact_person: "",
    contact_person_number: "",
  });
  const [BRNImages, setBRNImages] = useState<ImageListType>([]);
  const [EPDImages, setEPDImages] = useState<ImageListType>([]);
  const [logoImage, setLogoImage] = useState<string | ImageType[]>([]);

  const [edpImgSizeErr, setEdpImgSizeErr] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<{
    [key: string]: boolean;
  }>({
    company_image: false,
    company_logo: false,
  });
  const [BRNImagesError, setBRNImagesError] = useState<boolean>(false);
  const [logoImageError, setLogoImageError] = useState<boolean>(false);
  const { imgSettings } = useContainer(CommonTypeContainer);
  const [formStep, setFormStep] = useState(1);
  const [CPNError, setCPNError] = useState<boolean>(false);
  const [CPError, setCPError] = useState<boolean>(false);
  const [version, setVersion] = useState<number>(0);

  const firstFormFields = [
    {
      name: "company_category",
      label: "公司類別",
      placeholder: "Collector",
    },
    {
      name: "company_cn_name",
      label: "公司中文名",
      placeholder: "回收公司",
    },
    {
      name: "company_en_name",
      label: "公司英文名",
      placeholder: "Collector Company",
    },
  ];
  const secondformFields: FormField[] = [
    {
      name: "company_number",
      label: "商業登記編號",
      placeholder: "XY123456",
      type: "text",
    },
    {
      name: "company_image",
      label: "",
      placeholder: "上載商業登記圖片",
      type: "image",
    },
    {
      name: "company_logo",
      label: "公司logo",
      placeholder: "上載圖片",
      type: "image",
    },
  ];
  const thirdFormFields = [
    {
      name: "contact_person",
      label: "聯絡人姓名",
      placeholder: "請輸入姓名",
      type: "text",
    },
    {
      name: "contact_person_number",
      label: "聯絡人手機號碼",
      placeholder: "請輸入手機號碼",
      type: "text",
    },
    {
      name: "edp_contract",
      label: "EPD 合約（可上傳多張合約）",
      placeholder: "上載圖片",
      type: "image",
      isError: false,
    },
  ];

  useEffect(() => {
    if (tenantId) initCheckRegistrationStatus(tenantId);
  }, [tenantId]);

  useEffect(() => {
    initRegisterForm();
  }, []);

  const initCheckRegistrationStatus = async (tenantId: string) => {
    const result = await getRegisterLinkStatus(tenantId);
    if (result) {
      const status = result.data.status;
      if (status !== "CREATED") {
        navigate("/");
        showErrorToast(
          i18n.language === "enus"
            ? "The registration link is expired or the tenant account is already activated."
            : i18n.language === "zhhk"
            ? "註冊連結已過期或帳戶已經啟用。"
            : "注册链接已过期或账户已经激活"
        );
      }
    }
  };
  async function initRegisterForm() {
    try {
      if (tenantId) {
        const result = await getTenantById(parseInt(tenantId));
        const data = result?.data;
        // console.log('initRegisterForm', data)
        setTenantIdNumber(data?.tenantId);
        setFormValues({
          company_category: data?.tenantType,
          company_cn_name: data?.companyNameTchi,
          company_en_name: data?.companyNameEng,
          company_number: data?.brNo,
        });
        setEPDImages(data?.epdPhoto ?? []);
        setLang(data?.lang);
        setMonetaryValue(data?.monetaryValue);
        setVersion(data?.version);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        return navigate("/maintenance");
      }
    }
  }

  const handleToNextForm = useCallback(() => {
    if (formStep === 1) {
      if (
        formValues.company_category &&
        formValues.company_cn_name &&
        formValues.company_en_name
      ) {
        setFormStep(2);
      }
    } else if (formStep === 2) {
      if (BRNImages.length && logoImage.length) {
        setFormStep(3);
      } else {
        if (!BRNImages.length) setBRNImagesError(true);
        if (!logoImage.length) setLogoImageError(true);
      }
    } else if (formStep === 3) {
      if (formValues.contact_person && formValues.contact_person_number) {
        registerTenant();
      } else {
        if (!formValues.contact_person) {
          setCPError(true);
        }
        if (!formValues.contact_person_number) {
          setCPNError(true);
        }
      }
    }
  }, [formStep, formValues, BRNImages, logoImage, EPDImages]);

  const onChangeTextInput = useCallback((name: string, value: string) => {
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (
      formValues.contact_person !== "" &&
      formValues.contact_person !== undefined
    ) {
      setCPError(false);
    }
    if (
      formValues.contact_person_number !== "" &&
      formValues.contact_person_number !== undefined
    ) {
      setCPNError(false);
    }
  }, [formValues]);

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    fieldType: string
  ) => {
    if (fieldType === "company_image") {
      setBRNImages(imageList);
      setBRNImagesError(false);
    } else if (fieldType === "company_logo") {
      const firstImage = imageList.length > 0 ? imageList[0].data_url : "";
      setLogoImage(firstImage);
      setLogoImageError(false);
    } else if (fieldType === "edp_contract") {
      setEPDImages(imageList);
    }
  };

  const removeImage = (field: string, index: number) => {
    if (field === "company_image") {
      const newPictures = [...BRNImages];
      newPictures.splice(index, 1);
      setBRNImages(newPictures);
    } else if (field === "company_logo") {
      setLogoImage([]);
    } else if (field === "edp_contract") {
      const newPictures = [...EPDImages];
      newPictures.splice(index, 1);
      setEPDImages(newPictures);
    }
  };

  const registerTenant = () => {
    if (tenantIdNumber) {
      const registerInfo: RegisterItem = {
        lang: lang,
        contactName: formValues.contact_person,
        contactNo: formValues.contact_person_number,
        brImages: ImageToBase64(BRNImages),
        companyLogo: Array.isArray(logoImage)
          ? logoImage[0]?.data_url || ""
          : logoImage,
        epdImages: ImageToBase64(EPDImages),
        monetaryValue: monetaryValue,
        version: version,
      };
      const result = updateTenantRegInfo(registerInfo, tenantIdNumber);
      if (result != null) {
        console.log("result: ", result);
        navigate("/register/result");
      }
    }
  };

  const FirstFormContent = useMemo(() => {
    return (
      <Box>
        <Stack spacing={4}>
          {firstFormFields.map((field) => (
            <Box key={field.name}>
              <CustomField label={field.label}>
                <CustomTextField
                  id={field.label}
                  placeholder={field.placeholder}
                  rows={1}
                  onChange={(e) =>
                    onChangeTextInput(field.name, e.target.value)
                  }
                  value={formValues[field.name]}
                  sx={{ width: "100%" }}
                  disabled={true}
                ></CustomTextField>
              </CustomField>
            </Box>
          ))}
          <Box>
            <Button
              fullWidth
              onClick={handleToNextForm}
              sx={constantStyle.buttonFilledGreen}
              variant="contained"
            >
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }, [formValues, onChangeTextInput, handleToNextForm]);

  const SecondFormContent = useMemo(() => {
    return (
      <Stack spacing={2}>
        {secondformFields.map((field) => (
          <Box key={field.name}>
            {field.type === "image" ? (
              <Box>
                <CustomField
                  label={field.label}
                  style={constantStyle.labelField}
                  mandatory={field.label !== "" ? true : false}
                >
                  <ImageUploading
                    multiple
                    value={
                      field.name === "company_image"
                        ? BRNImages
                        : typeof logoImage === "string"
                        ? [{ data_url: logoImage }]
                        : logoImage
                    }
                    onChange={(imageList, addUpdateIndex) => {
                      setImageErrors((prevErrors) => ({
                        ...prevErrors,
                        [field.name]: false,
                      }));
                      onImageChange(imageList, addUpdateIndex, field.name);
                    }}
                    maxNumber={imgSettings?.ImgQuantity}
                    maxFileSize={imgSettings?.ImgSize}
                    dataURLKey="data_url"
                    acceptType={["jpg", "jpeg", "png"]}
                    onError={(error) => {
                      if (error?.maxFileSize) {
                        setImageErrors((prevErrors) => ({
                          ...prevErrors,
                          [field.name]: true,
                        }));
                      }
                    }}
                  >
                    {({ imageList, onImageUpload, onImageRemove }) => (
                      <Box className="box">
                        <Card sx={styles.cardImg}>
                          <ButtonBase
                            sx={styles.btnBase}
                            onClick={(event) => onImageUpload()}
                          >
                            <CAMERA_OUTLINE_ICON
                              style={{ color: "#ACACAC" }}
                              fontSize="large"
                            />
                            <Typography
                              sx={[
                                constantStyle.labelField,
                                { fontWeight: "bold" },
                              ]}
                            >
                              {field.placeholder}
                            </Typography>
                          </ButtonBase>
                        </Card>
                        {imageErrors[field?.name] && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              style={{
                                color: "red",
                                fontWeight: "400",
                                fontSize: "12px",
                              }}
                            >
                              “圖片超過 {imgSettings?.ImgSize / 1000000 || 1}{" "}
                              MB。請選擇較小的檔案。”
                            </Typography>
                          </Box>
                        )}
                        <ImageList sx={styles.imagesContainer} cols={3}>
                          {imageList.map((image, index) => (
                            <ImageListItem key={image["file"]?.name}>
                              <img
                                style={styles.image}
                                src={image["data_url"]}
                                alt={image["file"]?.name}
                                loading="lazy"
                              />
                              <ButtonBase
                                onClick={(event) => {
                                  onImageRemove(index);
                                  removeImage(field.name, index);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  right: "10px",
                                  padding: "4px",
                                }}
                              >
                                <CancelRoundedIcon className="text-black" />
                              </ButtonBase>
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Box>
                    )}
                  </ImageUploading>
                </CustomField>
              </Box>
            ) : (
              <Box>
                <CustomField label={field.label} mandatory>
                  <CustomTextField
                    id={field.label}
                    placeholder={field.placeholder}
                    rows={1}
                    onChange={(e) =>
                      onChangeTextInput(field.name, e.target.value)
                    }
                    value={formValues[field.name]}
                    sx={{ width: "100%" }}
                  ></CustomTextField>
                </CustomField>
              </Box>
            )}
          </Box>
        ))}
        {BRNImagesError && (
          <Box sx={styles.errorContainer}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 9,
                alignItems: "center",
              }}
            >
              <Typography sx={styles.txtField}>上載商業登記圖片</Typography>
              <Typography sx={styles.txtErrorMsg}>不应留白</Typography>
            </Box>
          </Box>
        )}
        {logoImageError && (
          <Box sx={styles.errorContainer}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 9,
                alignItems: "center",
              }}
            >
              <Typography sx={styles.txtField}>上載圖片</Typography>
              <Typography sx={styles.txtErrorMsg}>不应留白</Typography>
            </Box>
          </Box>
        )}
        <Button
          fullWidth
          onClick={handleToNextForm}
          sx={constantStyle.buttonFilledGreen}
          variant="contained"
        >
          {submitLabel}
        </Button>
      </Stack>
    );
  }, [
    formValues,
    BRNImages,
    logoImage,
    BRNImagesError,
    logoImageError,
    onImageChange,
    removeImage,
    onChangeTextInput,
    handleToNextForm,
  ]);

  const ThirdFormContent = useMemo(() => {
    return (
      <Stack spacing={4}>
        {thirdFormFields.map((field) => (
          <Box key={field.name}>
            {field.type === "image" ? (
              <>
                <Typography sx={constantStyle.labelField}>
                  {field.label}
                </Typography>
                <ImageUploading
                  multiple
                  value={EPDImages}
                  onChange={(imageList, addUpdateIndex) => {
                    setEdpImgSizeErr(false);
                    onImageChange(imageList, addUpdateIndex, field.name);
                  }}
                  maxNumber={imgSettings?.ImgQuantity}
                  maxFileSize={imgSettings?.ImgSize}
                  dataURLKey="data_url"
                  acceptType={["jpg", "jpeg", "png"]}
                  onError={(error) => {
                    if (error?.maxFileSize) {
                      setEdpImgSizeErr(true);
                    }
                  }}
                >
                  {({ imageList, onImageUpload, onImageRemove }) => (
                    <Box className="box">
                      <Card sx={styles.cardImg}>
                        <ButtonBase
                          sx={styles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: "#ACACAC" }} />
                          <Typography
                            sx={[
                              constantStyle.labelField,
                              { fontWeight: "bold" },
                            ]}
                          >
                            {field.placeholder}
                          </Typography>
                        </ButtonBase>
                      </Card>
                      {edpImgSizeErr && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            style={{
                              color: "red",
                              fontWeight: "400",
                              fontSize: "12px",
                            }}
                          >
                            “圖片超過 {imgSettings?.ImgSize / 1000000 || 1}{" "}
                            MB。請選擇較小的檔案。”
                          </Typography>
                        </Box>
                      )}
                      <ImageList sx={styles.imagesContainer} cols={3}>
                        {imageList.map((image, index) => (
                          <ImageListItem key={image["file"]?.name}>
                            <img
                              style={styles.image}
                              src={image["data_url"]}
                              alt={image["file"]?.name}
                              loading="lazy"
                            />
                            <ButtonBase
                              onClick={(event) => {
                                onImageRemove(index);
                                removeImage(field.name, index);
                              }}
                              style={{
                                position: "absolute",
                                top: "0px",
                                right: "10px",
                                padding: "4px",
                              }}
                            >
                              <CancelRoundedIcon className="text-black" />
                            </ButtonBase>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </ImageUploading>
              </>
            ) : (
              <CustomField label={field.label} mandatory>
                <TextField
                  id={field.label}
                  placeholder={field.placeholder}
                  rows={1}
                  onChange={(e) =>
                    onChangeTextInput(field.name, e.target.value)
                  }
                  value={formValues[field.name]}
                  sx={{ width: "100%" }}
                />
              </CustomField>
            )}
          </Box>
        ))}
        {CPError && (
          <Box sx={styles.errorContainer}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 9,
                alignItems: "center",
              }}
            >
              <Typography sx={styles.txtField}>聯絡人姓名</Typography>
              <Typography sx={styles.txtErrorMsg}>不应留白</Typography>
            </Box>
          </Box>
        )}
        {CPNError && (
          <Box sx={styles.errorContainer}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 9,
                alignItems: "center",
              }}
            >
              <Typography sx={styles.txtField}>聯絡人手機號碼</Typography>
              <Typography sx={styles.txtErrorMsg}>不应留白</Typography>
            </Box>
          </Box>
        )}
        <Button
          fullWidth
          onClick={handleToNextForm}
          sx={constantStyle.buttonFilledGreen}
          variant="contained"
        >
          {submitLabel}
        </Button>
      </Stack>
    );
  }, [
    formValues,
    EPDImages,
    CPError,
    CPNError,
    onImageChange,
    removeImage,
    onChangeTextInput,
    registerTenant,
  ]);

  return (
    <Box sx={constantStyle.loginPageBg}>
      <Box sx={constantStyle.loginBox}>
        <img src={logo_company} alt="logo_company" style={{ width: "70px" }} />
        <Typography
          sx={{ marginTop: "30px", marginBottom: "30px" }}
          fontWeight="bold"
          variant="h6"
        >
          {titlePage}
        </Typography>
        {formStep === 1 && FirstFormContent}
        {formStep === 2 && SecondFormContent}
        {formStep === 3 && ThirdFormContent}
      </Box>
      <div className="sm:mt-4 w-full pt-4 text-center">
        <CustomCopyrightSection />
      </div>
    </Box>
  );
};

let styles = {
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
    backgroundColor: "#F4F4F4",
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
  errorContainer: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginY: 1.5,
    p: 2,
    backgroundColor: "#F7BCC6",
    borderRadius: 5,
  },
  txtField: {
    fontWeight: "bold",
    color: "red",
    marginRight: "8px",
  },
  txtErrorMsg: {
    color: "red",
  },
};

export default RegisterTenant;
