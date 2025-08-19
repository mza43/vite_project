import React from "react";
import UserActionsCell from "./UserActionsCell.jsx";

export const getUserColumns = (onView, onEdit, onDelete) => [
  {
    headerName: "ID",
    field: "id",
    width: 90,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Name",
    field: "name",
    flex: 1,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Email",
    field: "email",
    flex: 1,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Phone",
    field: "setting.phone",
    flex: 1,
    sortable: true,
    filter: "agTextColumnFilter",
    valueGetter: (params) => params.data?.setting?.phone || "-",
  },
  {
    headerName: "City",
    field: "setting.city",
    flex: 1,
    sortable: true,
    filter: "agTextColumnFilter",
    valueGetter: (params) => params.data?.setting?.city || "-",
  },
  {
    headerName: "Actions",
    width: 260,
    cellStyle: { display: "flex", alignItems: "center", padding: "0 8px" },
    cellRenderer: (params) => (
      <UserActionsCell
        data={params.data}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
