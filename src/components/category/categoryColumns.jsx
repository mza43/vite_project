// src/components/category/categoryColumns.js
import { Button } from "@mui/material";

const categoryColumns = ({ onView, onEdit, onDelete }) => [
  { headerName: "ID", field: "id", width: 70 },
  { headerName: "Title", field: "title", flex: 1 },
  { headerName: "Description", field: "description", flex: 2 },
  {
    headerName: "Actions",
    width: 240,
    cellRenderer: (params) => (
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          size="small"
          variant="outlined"
          color="info"
          onClick={() => onView(params.data)}
        >
          View
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => onEdit(params.data)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => onDelete(params.data.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default categoryColumns;
