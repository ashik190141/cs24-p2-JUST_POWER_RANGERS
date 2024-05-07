import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const AdminHome = () => {
  const [truckDetails, setTruckDetails] = useState([]);

  let [theme, setTheme] = useState(localStorage.getItem("theme"));
  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
  }, [theme]);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard", { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTruckDetails(data)
      });
  }, [])

  const rows = truckDetails?.map((truck, index) => ({
    ...truck,
    id: index + 1,
  }));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      color: "primary"
    },
    {
      field: "vehicleNum",
      headerName: "Vehicle Number",
      width: 180,
      editable: false,
      sortable: true,
    },
    {
      field: "stsName",
      headerName: "STS Name",
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      field: "fuelCost",
      headerName: "Total Fuel Cost",
      width: 130,
      editable: false,
      sortable: true,
    },
    {
      field: "stsWasteWeight",
      headerName: "Total Waste (STS)",
      sortable: true,
      width: 150,
    },
    {
      field: "landfillWasteWeight",
      headerName: "Total Waste (Landfill)",
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      field: "landLocation",
      headerName: "Last Location",
      width: 160,
      editable: false,
      sortable: true,
    },
    {
      field: "arrival",
      headerName: "Arrival Time",
      width: 120,
      editable: false,
      sortable: true,

    },
    {
      field: "departure",
      headerName: "Departure Time",
      sortable: true,
      width: 120,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>EcoSync | Admin Home</title>
      </Helmet>
      <SectionTitle title={"Vehicle Update"} subTitle={"Real time monitoring"}></SectionTitle>
      <div className={`w-full px-4 max-w-[425px] md:max-w-full overflow-x-auto mx-auto pt-5 text-${theme == "dark" ? "white" : "black"}`}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            sx={{ color: `${theme == "dark" ? "white" : "dark"}`, }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default AdminHome;