import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const AdminHome = () => {
    const [truckDetails, setTruckDetails] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/dashboard")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTruckDetails(data)
            });
    }, [])

    const rows = truckDetails?.map((truck, index) => ({
      ...truck,
      id: index + 1,
    }));
    
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      {
        field: "vehicleNum",
        headerName: "Vehicle Number",
        width: 200,
        editable: false,
        sortable: true,
      },
      {
        field: "stsName",
        headerName: "STS Name",
        width: 200,
        editable: false,
        sortable: true,
      },
      {
        field: "fuelCost",
        headerName: "Total Fuel Cost",
        width: 150,
        editable: false,
        sortable: true,
      },
      {
        field: "stsWasteWeight",
        headerName: "Total Waste Weight of STS",
        sortable: true,
        width: 200,
      },
      {
        field: "landfillWasteWeight",
        headerName: "Total Waste Weight of Landfill",
        width: 200,
        editable: false,
        sortable: true,
      },
      {
        field: "landLocation",
        headerName: "Last Location",
        width: 200,
        editable: false,
        sortable: true,
      },
      {
        field: "arrival",
        headerName: "Arrival Time",
        width: 200,
        editable: false,
        sortable: true,
      },
      {
        field: "departure",
        headerName: "Departure Time",
        sortable: true,
        width: 150,
      },
    ];

    return (
      <div>
        <Helmet>
          <title>Dust Master | Admin Home</title>
        </Helmet>
        <SectionTitle
          title={"Admin Home"}
          subTitle={"Real time monitoring"}
        ></SectionTitle>
        <div className="md:w-10/12 mx-auto pt-5">
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
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