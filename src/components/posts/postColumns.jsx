
import { Button } from "@mui/material";

const postColumns = (handleViewClick, handleOpenDialog, handleDeleteClick) => [
  { headerName: "ID", field: "id", width: 70, filter: true },
  { headerName: "Title", field: "title", flex: 1, filter: true },
  { headerName: "Description", field: "description", flex: 1, filter: true },
  {
    headerName: "User",
    field: "user.name",
    flex: 1,
    filter: true,
    valueGetter: (p) => p.data.user?.name || "-",
  },
  {
    headerName: "Categories",
    field: "categories",
    flex: 1,
    filter: true,
    valueGetter: (p) =>
      p.data.categories?.map((c) => c.title).join(", ") || "-",
  },
  {
    headerName: "Actions",
    width: 240,
    cellRenderer: (params) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          size="small"
          variant="outlined"
          color="info"
          onClick={() => handleViewClick(params.data)}
        >
          View
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => handleOpenDialog(params.data)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleDeleteClick(params.data.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default postColumns;
