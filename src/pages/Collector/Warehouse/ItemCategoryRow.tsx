import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
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
}

const ItemCategoryRow: React.FC<Props> = ({
  item,
  index,
  itemCategories,
  setItemCategories,
  recycTypes,
  productTypes,
  setHasErrors,
}) => {
  const { i18n } = useTranslation();
  const [errors, setErrors] = useState<{
    productAddonTypeId?: boolean;
    recycSubTypeId?: boolean;
    recycTypeCapacity?: boolean;
    productTypeCapacity?: boolean;
  }>({});

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
      <Grid item xs={2}>
        <Select
          value={item.type || ""}
          onChange={(e) =>
            handleTypeChange(
              e.target.value === "recyclable" ? "recyclable" : "product"
            )
          }
          fullWidth
        >
          <MenuItem value="recyclable">Recyclable</MenuItem>
          <MenuItem value="product">Product</MenuItem>
        </Select>
      </Grid>

      {item.type === "recyclable" ? (
        <>
          <Grid item xs={2}>
            <Select
              value={item.recycTypeId || ""}
              onChange={(e) => handleFieldChange("recycTypeId", e.target.value)}
              fullWidth
            >
              {recycTypes.map((type) => (
                <MenuItem value={type.recycTypeId} key={type.recycTypeId}>
                  {getRecyclableNameValue(type)}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={2}>
            <Select
              value={item.recycSubTypeId || ""}
              onChange={(e) =>
                handleFieldChange("recycSubTypeId", e.target.value)
              }
              fullWidth
              error={!!errors.recycSubTypeId}
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
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="number"
              value={item.recycTypeCapacity || ""}
              onChange={(e) =>
                handleFieldChange("recycTypeCapacity", +e.target.value)
              }
              fullWidth
              error={!!errors.recycTypeCapacity}
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              onBlur={() => {
                item.recycTypeCapacity == 0 && handleBlur("recyc");
              }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={2}>
            <Select
              value={item.productTypeId || ""}
              onChange={handleProductTypeChange}
              fullWidth
            >
              {productTypes.map((type) => (
                <MenuItem value={type.productTypeId} key={type.productTypeId}>
                  {getProductNameValue(type)}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={2}>
            <Select
              value={item.productSubTypeId || ""}
              onChange={handleProductSubTypeChange}
              fullWidth
              disabled={!item.productTypeId}
            >
              {(
                productTypes?.find(
                  (type) => type.productTypeId === item.productTypeId
                )?.productSubType || []
              ).map((subtype) => (
                <MenuItem
                  value={subtype.productSubTypeId}
                  key={subtype.productSubTypeId}
                >
                  {getProductNameValue(subtype)}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={2}>
            <Select
              value={item.productAddonTypeId || ""}
              onChange={handleProductAddonChange}
              fullWidth
              disabled={!item.productSubTypeId}
              error={!!errors.productAddonTypeId}
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
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="number"
              value={item.productTypeCapacity || ""}
              onChange={(e) =>
                handleFieldChange(
                  "productTypeCapacity",
                  parseFloat(e.target.value) || 0
                )
              }
              fullWidth
              error={!!errors.productTypeCapacity}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              onBlur={() => {
                item.productTypeCapacity == 0 && handleBlur("product");
              }}
            />
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
