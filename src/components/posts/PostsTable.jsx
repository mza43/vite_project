
import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const PostsTable = ({ rowData, columnDefs, loading }) => {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", borderRadius: "8px" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        rowHeight={50}
        headerHeight={45}
        domLayout="autoHeight"
        floatingFilter={true}
      />
    </div>
  );
};

export default PostsTable;
