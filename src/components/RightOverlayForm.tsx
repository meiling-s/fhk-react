import React, { useState, useEffect, ReactNode, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import StatusCard from "./StatusCard";
import { Button, Typography } from "@mui/material";
import { styles } from "../constants/styles";
import { useContainer } from "unstated-next";
import NotifContainer from "../contexts/NotifContainer";
import DeleteModal from "./FormComponents/deleteModal";
import ConfirmModal from "./SpecializeComponents/ConfirmationModal";
import { t } from "i18next";

type HeaderProps = {
  title?: string;
  subTitle?: string;
  submitText?: string;
  cancelText?: string;
  onCloseHeader?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  action?: "add" | "edit" | "delete" | "none";
  statusLabel?: string;
  deleteText?: string;
  useDeleteConfirmation?: boolean;
};

type RightOverlayFormProps = {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  anchor?: "left" | "right";
  showHeader?: boolean;
  headerProps?: HeaderProps;
  action?: "add" | "edit" | "delete" | "none";
  useConfirmModal?: boolean;
  width?: string;
};

const HeaderSection: React.FC<HeaderProps> = ({
  title,
  subTitle,
  submitText,
  cancelText,
  onCloseHeader,
  onSubmit,
  onDelete,
  action = "add",
  statusLabel,
  deleteText,
  useDeleteConfirmation = true,
}) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [disabledDelete, setDisabledDelete] = useState(false);
  const disabledSync = useRef(false);

  const onDeleteModal = () => {
    if (cancelText === t("common.cancel") || !useDeleteConfirmation) {
      setOpenDelete(false);
      if (onDelete) {
        onDelete();
      }
    } else {
      setOpenDelete((prev) => !prev);
    }
  };

  const onDeleteClick = async () => {

    if(action === "add" || disabledSync.current || disabledDelete) return

    disabledSync.current = true
    setDisabledDelete(true)

    try {
      if (onDelete) await onDelete();
      onDeleteModal();
    } finally {
      disabledSync.current = false;
      setDisabledSubmit(false);
    }
  };

  const onSubmitClick = async () => {

    if(action === "delete" || disabledSync.current || disabledSubmit) return

    disabledSync.current = true
    setDisabledSubmit(true)

    try {
      if(onSubmit) await onSubmit();
    } finally {
      disabledSync.current = false;
      setDisabledSubmit(false);
    }
  }

  return (
    <div className="header-section">
      <div className="flex flex-row items-center justify-between p-[25px] gap-[25px">
        <div className="md:flex items-center gap-2 sm:block">
          <div className="flex-1 flex flex-col items-start justify-start sm:mb-2">
            <b className="md:text-sm sm:text-xs">{title}</b>
            <div className="md:text-smi sm:text-2xs text-grey-dark text-left">
              {subTitle}
            </div>
          </div>
          {statusLabel && <StatusCard status={statusLabel} />}
        </div>
        <div className="right-action flex items-center">
          {action !== "none" && (
            <div className="h-9 flex flex-row items-start justify-start gap-[12px] text-smi text-white">
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  {
                    width: "max-content",
                    height: "40px",
                  },
                ]}
                disabled={action === "delete" || disabledSync.current}
                onClick={onSubmitClick}
                data-testid=" astd-right-drawer-save-button-5997"
              >
                {submitText}
              </Button>

              {cancelText != "" && (
                <Button
                  sx={[
                    styles.buttonOutlinedGreen,
                    {
                      width: "max-content",
                      height: "40px",
                    },
                  ]}
                  data-testid="astd-right-drawer-cancel-delete-button-8523"
                  variant="outlined"
                  disabled={action === "add" || disabledSync.current}
                  onClick={onDeleteModal}
                >
                  {cancelText}
                </Button>
              )}
            </div>
          )}

          <div
            className="close-icon ml-2 cursor-pointer"
            data-testid="astd-right-drawer-close-button-8612"
          >
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/collapse1.svg"
              onClick={onCloseHeader}
            />
          </div>
        </div>
      </div>
      <DeleteModal
        open={openDelete}
        onClose={onDeleteModal}
        onDelete={onDeleteClick}
        deleteText={deleteText}
      />
    </div>
  );
};

const RightOverlayForm: React.FC<RightOverlayFormProps> = ({
  open,
  onClose,
  children,
  anchor = "left",
  showHeader = true,
  headerProps,
  action = "add",
  useConfirmModal = true,
  width,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const { marginTop } = useContainer(NotifContainer);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setOpenConfirmModal(false);
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={(_, reason) => {
        action != "delete" && useConfirmModal
          ? reason === "backdropClick" && setOpenConfirmModal(true)
          : handleClose();
      }}
      anchor={anchor}
      variant={"temporary"}
      sx={{
        "& .MuiDrawer-paper": {
          marginTop: `${marginTop}`,
          width: width,
        },
      }}
    >
      <div
        className={`border-b-[1px] border-grey-line h-full ${
          isOpen
            ? `${width ? `md:w-full` : `w-[700px]`} w-[100vw] mt-[${marginTop}]`
            : "hidden"
        }`}
      >
        {showHeader ? (
          <div className="header">
            <HeaderSection {...headerProps} action={action} />
          </div>
        ) : null}

        <div className="">{children}</div>
        <ConfirmModal
          isOpen={openConfirmModal && useConfirmModal}
          onConfirm={() => {
            handleClose();
          }}
          onCancel={() => setOpenConfirmModal(false)}
        />
      </div>
    </Drawer>
  );
};

export default RightOverlayForm;
