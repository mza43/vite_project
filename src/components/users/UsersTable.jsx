import React, { useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getUserColumns } from "./userColumns.jsx";

const UsersTable = ({
  users = [],
  onView,
  onEdit,
  onDelete,
  onSortChanged,
  onFilterChanged,
}) => {
  const handleSortChanged = useCallback(
    (params) => {
      const sort = params.api.getSortModel();
      onSortChanged?.(sort);
    },
    [onSortChanged]
  );

  const handleFilterChanged = useCallback(
    (params) => {
      const filterModel = params.api.getFilterModel() || {};
      const newFilters = {};
      Object.entries(filterModel).forEach(([colId, model]) => {
        if (!model) return;
        const val = model.filter;
        if (val === undefined || val === null) return;
        const key = colId.includes(".") ? colId.split(".").pop() : colId;
        newFilters[key] = val;
      });
      onFilterChanged?.(newFilters);
    },
    [onFilterChanged]
  );

  const columnDefs = useMemo(
    () => getUserColumns(onView, onEdit, onDelete),
    [onView, onEdit, onDelete]
  );

  return (
    <div className="ag-theme-alpine" style={{ width: "100%" }}>
      <AgGridReact
        rowData={users}
        columnDefs={columnDefs}
        pagination={false}
        onSortChanged={handleSortChanged}
        onFilterChanged={handleFilterChanged}
        domLayout="autoHeight"
        rowHeight={40}
        defaultColDef={{
          sortable: true,
          filter: true,
          floatingFilter: true,
          minWidth: 100,
        }}
      />
    </div>
  );
};

export default UsersTable;
