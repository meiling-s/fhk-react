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
}) => {
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState<{
    productAddonTypeId?: boolean;
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
  const productTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productTypeId`
  );
  const productSubTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productSubTypeId`
  );
  const productAddonTypeError = validation.find(
    (v) => v.field === `itemCategory[${index}].productAddonTypeId`
  );

  const validateDuplicates = () => {
    const duplicateProductAddon = itemCategories.some(
      (cat, i) =>
        i !== index &&
        cat.productAddonTypeId &&
        cat.productAddonTypeId === item.productAddonTypeId
    );

    const duplicateRecycSubType = itemCategories.some(
      (cat, i) =>
        i !== index &&
        cat.recycSubTypeId &&
        cat.recycSubTypeId === item.recycSubTypeId
    );

    setErrors({
      productAddonTypeId: duplicateProductAddon,
      recycSubTypeId: duplicateRecycSubType,
    });

    setHasErrors(duplicateProductAddon || duplicateRecycSubType);
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

  const handleFieldChange = (key: keyof ItemCategory, value: any) => {
    const updatedItems = [...itemCategories];
    updatedItems[index] = { ...updatedItems[index], [key]: value };

    setItemCategories(updatedItems);
  };

  const handleRemoveRow = () => {
    if (itemCategories.length > 1) {
      const updatedItems = itemCategories.filter((_, i) => i !== index);
      setItemCategories(updatedItems);
    }
  };

  const handleProductTypeChange = (e: SelectChangeEvent<string>) => {
    const productTypeId = e.target.value;
    handleFieldChange("productAddonTypeId", "");
    handleFieldChange("productSubTypeId", "");
    handleFieldChange("productTypeId", productTypeId);
  };

  const handleProductSubTypeChange = (e: SelectChangeEvent<string>) => {
    const productSubTypeId = e.target.value;
    handleFieldChange("productAddonTypeId", "");
    handleFieldChange("productSubTypeId", productSubTypeId);
  };

  const handleProductAddonChange = (e: SelectChangeEvent<string>) => {
    handleFieldChange("productAddonTypeId", e.target.value);
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
        <FormControl fullWidth>
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
            <FormControl fullWidth>
              <Select
                value={item.recycTypeId || ""}
                onChange={(e) =>
                  handleFieldChange("recycTypeId", e.target.value)
                }
                sx={{
                  border: recycTypeError ? "2px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {recycTypes.map((type) => (
                  <MenuItem value={type.recycTypeId} key={type.recycTypeId}>
                    {getRecyclableNameValue(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth error={!!errors.recycSubTypeId}>
              <Select
                value={item.recycSubTypeId || ""}
                onChange={(e) =>
                  handleFieldChange("recycSubTypeId", e.target.value)
                }
                sx={{
                  border: recycSubTypeError
                    ? "2px solid red"
                    : "1px solid #ccc",
                  borderRadius: "4px",
                }}
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
                <FormHelperText>Duplicate Recyclable Sub-Type</FormHelperText>
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
                    handleFieldChange("recycTypeCapacity", newValue);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                sx={{
                  border: errors.recycTypeCapacity
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
              />
            </FormControl>
          </Grid>
        </>
      )}

      {item.type === "product" && (
        <>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <Select
                value={item.productTypeId || ""}
                onChange={handleProductTypeChange}
                sx={{
                  border: productTypeError ? "2px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {productTypes.map((type) => (
                  <MenuItem value={type.productTypeId} key={type.productTypeId}>
                    {getProductNameValue(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth>
              <Select
                value={item.productSubTypeId || ""}
                onChange={handleProductSubTypeChange}
                sx={{
                  border: productSubTypeError
                    ? "2px solid red"
                    : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                disabled={!item.productTypeId}
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
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl fullWidth>
              <Select
                value={item.productAddonTypeId || ""}
                onChange={handleProductAddonChange}
                fullWidth
                disabled={!item.productSubTypeId}
                error={!!errors.productAddonTypeId}
                sx={{
                  border: productAddonTypeError
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
                    handleFieldChange("productTypeCapacity", newValue);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                sx={{
                  border: errors.productTypeCapacity
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
              />
            </FormControl>
          </Grid>
        </>
      )}

      {/* Action Buttons */}
      <Grid item xs={2}>
        <IconButton onClick={handleAddRow} color="success">
          <AddCircleOutline />
        </IconButton>
        {itemCategories.length > 1 && (
          <IconButton onClick={handleRemoveRow} color="error">
            <RemoveCircleOutline />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default ItemCategoryRow;
