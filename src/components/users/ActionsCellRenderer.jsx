import React from "react";
import { Button } from "@mui/material";

const ActionsCellRenderer = (props) => {
  const { data, context } = props;

  const onView = () => context?.onView?.(data);
  const onEdit = () => context?.onEdit?.(data);
  const onDelete = () => context?.onDelete?.(data?.id);

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", width: "100%" }}>
      <Button size="small" variant="outlined" color="info" onClick={onView} sx={{ minWidth: 64, height: 32, textTransform: "none" }}>
        View
      </Button>
      <Button size="small" variant="outlined" color="secondary" onClick={onEdit} sx={{ minWidth: 64, height: 32, textTransform: "none" }}>
        Edit
      </Button>
      <Button size="small" variant="outlined" color="error" onClick={onDelete} sx={{ minWidth: 64, height: 32, textTransform: "none" }}>
        Delete
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;