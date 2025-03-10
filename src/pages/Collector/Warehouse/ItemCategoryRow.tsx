import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import {
  ProductAddon,
  Products,
  ProductSubType,
} from "src/interfaces/productType";
import { useTranslation } from "react-i18next";

interface ItemCategory {
  type: "recyclable" | "product";
  recycTypeId?: string;
  recycSubTypeId?: string;
  recycTypeCapacity?: number;
  recycSubTypeCapacity?: number;
  productTypeId?: string;
  productSubTypeId?: string;
  productAddonTypeId?: string;
  productTypeCapacity?: number;
  productSubTypeCapacity?: number;
  productAddonTypeCapacity?: number;
  unitId: number;
}

interface recyleSubtypeData {
  recycSubTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface recyleTypeData {
  createdAt: string;
  createdBy: string;
  description: string;
  recycSubType: recyleSubtypeData[];
  recycTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface Props {
  item: ItemCategory;
  index: number;
  itemCategories: ItemCategory[];
  setItemCategories: React.Dispatch<React.SetStateAction<ItemCategory[]>>;
  recycTypes: recyleTypeData[];
  productTypes: Products[];
  setHasErrors: (hasErrors: boolean) => void;
  validation: { field: string; error: string }[];
  isTriedSubmitted: boolean;
  disabled: boolean;
}

const ItemCategoryRow: React.FC<Props> = ({
  item,
  index,
  itemCategories,
  setItemCategories,
  recycTypes,
  productTypes,
  setHasErrors,
  validation,
  isTriedSubmitted,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState<{
    productTypeId?: boolean;
    productSubTypeId?: boolean;
    productAddonTypeId?: boolean;
    recycTypeId?: boolean;
    recycSubTypeId?: boolean;
    recycTypeCapacity?: boolean;
    productTypeCapacity?: boolean;
  }>({});

  const recycTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].recycTypeId`
  );
  const recycSubTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].recycSubTypeId`
  );

  const recycCapacityError = validation.find(
    (v) => v.field === `itemCategory[${index}].recycTypeCapacity`
  );

  const productTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productTypeId`
  );
  const productSubTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productSubTypeId`
  );
  const productAddonTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productAddonTypeId`
  );
  const productTypeCapacityError = validation.find(
    (v) => v.field === `itemCategory[${index}].productTypeCapacity`
  );

  const validateDuplicates = () => {
    let duplicateProductAddon = false;
    let duplicateProductSubType = false;
    let duplicateProductType = false;
    let duplicateRecycSubType = false;
    let duplicateRecycType = false;

    if (item.type === "product") {
      const productType = productTypes.find(
        (p) => p.productTypeId === item.productTypeId
      );
      const hasProductSubTypes =
        productType?.productSubType && productType?.productSubType?.length > 0;

      const productSubType = productType?.productSubType?.find(
        (s) => s.productSubTypeId === item.productSubTypeId
      );
      const hasProductAddons =
        productSubType?.productAddonType &&
        productSubType?.productAddonType?.length > 0;

      if (!item.productTypeId) return; // 🚀 Skip if parent is empty

      if (hasProductAddons && item.productAddonTypeId) {
        duplicateProductAddon = itemCategories.some(
          (cat, i) =>
            i !== index && cat.productAddonTypeId === item.productAddonTypeId
        );
      } else if (hasProductSubTypes && item.productSubTypeId) {
        duplicateProductSubType = itemCategories.some(
          (cat, i) =>
            i !== index && cat.productSubTypeId === item.productSubTypeId
        );
      } else if (!hasProductSubTypes) {
        duplicateProductType = itemCategories.some(
          (cat, i) => i !== index && cat.productTypeId === item.productTypeId
        );
      }
    } else if (item.type === "recyclable") {
      const recycType = recycTypes.find(
        (r) => r.recycTypeId === item.recycTypeId
      );
      const hasRecycSubTypes =
        recycType?.recycSubType && recycType?.recycSubType?.length > 0;

      if (!item.recycTypeId) return; // 🚀 Skip if parent is empty

      if (hasRecycSubTypes && item.recycSubTypeId) {
        duplicateRecycSubType = itemCategories.some(
          (cat, i) => i !== index && cat.recycSubTypeId === item.recycSubTypeId
        );
      } else if (!hasRecycSubTypes) {
        duplicateRecycType = itemCategories.some(
          (cat, i) => i !== index && cat.recycTypeId === item.recycTypeId
        );
      }
    }

    setErrors({
      productAddonTypeId: duplicateProductAddon,
      productSubTypeId: !duplicateProductAddon && duplicateProductSubType,
      productTypeId:
        !duplicateProductAddon &&
        !duplicateProductSubType &&
        duplicateProductType,
      recycSubTypeId: duplicateRecycSubType,
      recycTypeId: !duplicateRecycSubType && duplicateRecycType,
    });

    setHasErrors(
      duplicateProductAddon ||
        duplicateProductSubType ||
        duplicateProductType ||
        duplicateRecycSubType ||
        duplicateRecycType
    );
  };

  const handleAddRow = () => {
    setItemCategories([
      ...itemCategories,
      {
        type: "recyclable",
        recycTypeId: "",
        recycSubTypeId: "",
        recycTypeCapacity: 0,
        recycSubTypeCapacity: 0,
        unitId: 0,
      },
    ]);
  };

  const handleTypeChange = (newType: "recyclable" | "product") => {
    const updatedItem = { ...itemCategories[index] };

    if (newType === "product") {
      // Reset recyclable-related fields
      updatedItem.recycTypeId = "";
      updatedItem.recycSubTypeId = "";
      updatedItem.recycTypeCapacity = 0;
      updatedItem.recycSubTypeCapacity = 0;

      updatedItem.productTypeId = "";
      updatedItem.productSubTypeId = "";
      updatedItem.productAddonTypeId = "";
      updatedItem.productTypeCapacity = 0;
    } else if (newType === "recyclable") {
      updatedItem.productTypeId = "";
      updatedItem.productSubTypeId = "";
      updatedItem.productAddonTypeId = "";
      updatedItem.productTypeCapacity = 0;

      updatedItem.recycTypeId = "";
      updatedItem.recycSubTypeId = "";
      updatedItem.recycTypeCapacity = 0;
      updatedItem.recycSubTypeCapacity = 0;
    }

    updatedItem.type = newType;

    const updatedItems = [...itemCategories];
    updatedItems[index] = updatedItem;

    setItemCategories(updatedItems);
  };

  type IHandleFieldChange = {
    [key: string]: string | number;
  };

  const handleFieldChange = (fields: IHandleFieldChange) => {
    const updatedItems = [...itemCategories];
    updatedItems[index] = { ...updatedItems[index], ...fields };
    console.log("updatedItems", updatedItems);

    setItemCategories(updatedItems);
  };

  const handleRemoveRow = () => {
    if (itemCategories.length > 1) {
      const updatedItems = itemCategories.filter((_, i) => i !== index);
      setItemCategories(updatedItems);
    }
  };

  const handleRecycTypeChange = (e: SelectChangeEvent<string>) => {
    const recycTypeId = e.target.value;
    handleFieldChange({
      recycTypeId: recycTypeId,
      recycSubTypeId: "",
    });
  };

  const handleRecycSubTypeChange = (e: SelectChangeEvent<string>) => {
    const recycSubTypeId = e.target.value;
    handleFieldChange({ recycSubTypeId: recycSubTypeId });
  };

  const handleProductTypeChange = (e: SelectChangeEvent<string>) => {
    const productTypeId = e.target.value;
    handleFieldChange({
      productTypeId: productTypeId,
      productSubTypeId: "",
      productAddonTypeId: "",
    });
  };

  const handleProductSubTypeChange = (e: SelectChangeEvent<string>) => {
    const productSubTypeId = e.target.value;
    handleFieldChange({
      productSubTypeId: productSubTypeId,
      productAddonTypeId: "",
    });
  };

  const handleProductAddonChange = (e: SelectChangeEvent<string>) => {
    handleFieldChange({
      productAddonTypeId: e.target.value,
    });
  };

  useEffect(() => {
    validateDuplicates();
  }, [itemCategories, item]);

  const getRecyclableNameValue = (
    value: recyleTypeData | recyleSubtypeData
  ) => {
    switch (i18n.language) {
      case "enus":
        return value.recyclableNameEng;
      case "zhch":
        return value.recyclableNameSchi;
      case "zhhk":
        return value.recyclableNameTchi;
      default:
        return value.recyclableNameTchi;
    }
  };

  const getProductNameValue = (
    value: Products | ProductSubType | ProductAddon
  ) => {
    switch (i18n.language) {
      case "enus":
        return value.productNameEng;
      case "zhch":
        return value.productNameSchi;
      case "zhhk":
        return value.productNameTchi;
      default:
        return value.productNameTchi;
    }
  };

  const handleBlur = (type: string) => {
    if (type === "recyc") {
      setErrors((prevState) => ({
        ...prevState,
        recycTypeCapacity: true,
      }));
    }
    if (type === "product") {
      setErrors((prevState) => ({
        ...prevState,
        productTypeCapacity: true,
      }));
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {/* Type Selection */}
      <Grid item xs={2}>
        <FormControl fullWidth disabled={disabled}>
          <Select
            value={item.type || ""}
            onChange={(e) =>
              handleTypeChange(
                e.target.value === "recyclable" ? "recyclable" : "product"
              )
            }
          >
            <MenuItem value="recyclable">
              {t("processOrder.create.recycling")}
            </MenuItem>
            <MenuItem value="product">
              {t("processOrder.create.product")}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Recyclable Fields */}
      {item.type === "recyclable" && (
        <>
          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.recycTypeId}>
              <Select
                value={item.recycTypeId || ""}
                onChange={handleRecycTypeChange}
                sx={{
                  border:
                    recycTypeError && isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                disabled={disabled}
              >
                {recycTypes.map((type) => (
                  <MenuItem value={type.recycTypeId} key={type.recycTypeId}>
                    {getRecyclableNameValue(type)}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.recycTypeId && (
                <FormHelperText>
                  {t("pick_up_order.card_detail.main_category")}{" "}
                  {t("add_warehouse_page.shouldNotDuplicate")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.recycSubTypeId}>
              <Select
                value={item.recycSubTypeId || ""}
                onChange={handleRecycSubTypeChange}
                sx={{
                  border:
                    recycSubTypeError && isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                disabled={disabled}
              >
                {recycTypes
                  .find((type) => type.recycTypeId === item.recycTypeId)
                  ?.recycSubType.map((subtype) => (
                    <MenuItem
                      value={subtype.recycSubTypeId}
                      key={subtype.recycSubTypeId}
                    >
                      {getRecyclableNameValue(subtype)}
                    </MenuItem>
                  ))}
              </Select>
              {!!errors.recycSubTypeId && (
                <FormHelperText>
                  {t("pick_up_order.card_detail.subcategory")}{" "}
                  {t("add_warehouse_page.shouldNotDuplicate")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.recycTypeCapacity}>
              <TextField
                type="number"
                value={item.recycTypeCapacity || ""}
                onChange={(e) => {
                  const newValue = +e.target.value;

                  // Prevent setting negative values
                  if (newValue >= 0 || e.target.value === "") {
                    handleFieldChange({ recycTypeCapacity: newValue });
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-" ||
                    e.key === "+"
                  ) {
                    e.preventDefault();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                sx={{
                  border:
                    (errors.recycTypeCapacity || recycCapacityError) &&
                    isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                }}
                onBlur={() => {
                  if (!item.recycTypeCapacity) {
                    setErrors((prev) => ({
                      ...prev,
                      recycTypeCapacity: true,
                    }));
                  }
                }}
                disabled={disabled}
              />
            </FormControl>
          </Grid>
        </>
      )}

      {item.type === "product" && (
        <>
          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.productTypeId}>
              <Select
                value={item.productTypeId || ""}
                onChange={handleProductTypeChange}
                sx={{
                  border:
                    productTypeError && isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                disabled={disabled}
              >
                {productTypes.map((type) => (
                  <MenuItem value={type.productTypeId} key={type.productTypeId}>
                    {getProductNameValue(type)}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.productTypeId && (
                <FormHelperText>
                  {t("pick_up_order.card_detail.product_type_label")}{" "}
                  {t("add_warehouse_page.shouldNotDuplicate")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.productSubTypeId}>
              <Select
                value={item.productSubTypeId || ""}
                onChange={handleProductSubTypeChange}
                sx={{
                  border:
                    productSubTypeError && isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                disabled={!item.productTypeId || disabled}
              >
                {productTypes !== undefined &&
                  productTypes
                    ?.find((type) => type.productTypeId === item.productTypeId)
                    ?.productSubType?.map((subtype) => (
                      <MenuItem
                        value={subtype.productSubTypeId}
                        key={subtype.productSubTypeId}
                      >
                        {getProductNameValue(subtype)}
                      </MenuItem>
                    ))}
              </Select>
              {!!errors.productSubTypeId && (
                <FormHelperText>
                  {t("pick_up_order.card_detail.sub_product_type_label")}{" "}
                  {t("add_warehouse_page.shouldNotDuplicate")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.productAddonTypeId}>
              <Select
                value={item.productAddonTypeId || ""}
                onChange={handleProductAddonChange}
                fullWidth
                disabled={!item.productSubTypeId || disabled}
                error={!!errors.productAddonTypeId}
                sx={{
                  border:
                    productAddonTypeError && isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {(
                  (item.productSubTypeId &&
                    (
                      productTypes.find(
                        (type) => type.productTypeId === item.productTypeId
                      )?.productSubType || []
                    ).find(
                      (subtype) =>
                        subtype.productSubTypeId === item.productSubTypeId
                    )?.productAddonType) ||
                  []
                ).map((addon) => (
                  <MenuItem
                    value={addon.productAddonTypeId}
                    key={addon.productAddonTypeId}
                  >
                    {getProductNameValue(addon)}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.productAddonTypeId && (
                <FormHelperText>
                  {t("pick_up_order.card_detail.addon_product_type_label")}{" "}
                  {t("add_warehouse_page.shouldNotDuplicate")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth>
              <TextField
                type="number"
                value={item.productTypeCapacity || ""}
                onChange={(e) => {
                  const newValue = +e.target.value;

                  // Prevent setting negative values
                  if (newValue >= 0 || e.target.value === "") {
                    handleFieldChange({ productTypeCapacity: newValue });
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-" ||
                    e.key === "+"
                  ) {
                    e.preventDefault();
                  }
                }}
                sx={{
                  border:
                    (errors.productTypeCapacity || productTypeCapacityError) &&
                    isTriedSubmitted
                      ? "2px solid red"
                      : "1px solid #ccc",
                }}
                onBlur={() => {
                  if (!item.productTypeCapacity) {
                    setErrors((prev) => ({
                      ...prev,
                      productTypeCapacity: true,
                    }));
                  }
                }}
                disabled={disabled}
              />
            </FormControl>
          </Grid>
        </>
      )}

      {/* Action Buttons */}
      <Grid item xs={2}>
        <IconButton onClick={handleAddRow} color="success" disabled={disabled}>
          <AddCircleOutline />
        </IconButton>
        {itemCategories.length > 1 && (
          <IconButton
            onClick={handleRemoveRow}
            color="error"
            disabled={disabled}
          >
            <RemoveCircleOutline />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default ItemCategoryRow;
