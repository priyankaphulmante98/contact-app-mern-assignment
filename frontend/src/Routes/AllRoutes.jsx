import { Routes, Route } from "react-router-dom";
import React from "react";
import SidebarWithHeader from "../Components/Common/Sidebar";
import DataTable from "../Components/DataTable";

function AllRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SidebarWithHeader>
            <DataTable />
          </SidebarWithHeader>
        }
      />
    </Routes>
  );
}

export default AllRoutes;
