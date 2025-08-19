// src/components/category/CategoriesTable.jsx
import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// AG Grid modules (keep table self-contained)
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const CategoriesTable = ({ data = [], columns = [], loading = false }) => {
  if (loading) return null;

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", borderRadius: 8 }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        pagination
        paginationPageSize={10}
        rowHeight={50}
        headerHeight={45}
        domLayout="autoHeight"
        defaultColDef={{
          sortable: true,
          filter: true,
          floatingFilter: true,
          resizable: true,
        }}
      />
    </div>
  );
};

export default CategoriesTable;
