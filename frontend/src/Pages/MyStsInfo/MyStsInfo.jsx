import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import GetMyStsInfo from "../../Hooks/GetMyStsInfo";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";


const MyStsInfo = () => {
    let [stsId, isLoading] = GetMyStsInfo();
    let axiosPublic = useAxiosPublic();
    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    const { data: allManagers = [] } = useQuery({
        queryKey: ['get-all-my-sts-managers'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-sts-managers/${stsId._id}`);
            return res.data;
        }
    });
    const { data: allVehicles = [] } = useQuery({
        queryKey: ['get-all-my-sts-vehicles'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-sts-vehicles/${stsId._id}`);
            return res.data;
        }
    });

    let managerDetails = allManagers?.map((user, index) => {
        return {
            id: index + 1,
            userName: user?.userName,
            email: user?.email,
            phone: user?.phone,
            district: user?.district,
            division: user?.division,
        }
    })

    const managersColumn = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            sortable: true,
        },
        {
            field: 'userName',
            headerName: 'User Name',
            width: 200,
            editable: false,
            sortable: true,
        },

        {
            field: 'email',
            headerName: 'User Email',
            width: 280,
            editable: false,
            sortable: true,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            width: 180,
            editable: false,
            sortable: true,
        },
        {
            field: 'district',
            headerName: 'District',
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: 'division',
            headerName: 'Division',
            width: 150,
            editable: false,
            sortable: true,
        },
    ];

    let managersRow = [...managerDetails];

    //This Table is for Vehicle
    let vehicleDetails = allVehicles?.map((vehicle, index) => {
        return {
            id: index + 1,
            stsName: vehicle.stsName,
            vehicleRegNum: vehicle.vehicleRegNum,
            type: vehicle.type,
            capacity: vehicle.capacity,
            fualCostLoaded: vehicle.fualCostLoaded,
            fualCostUnloaded: vehicle.fualCostUnloaded,
        }
    })

    const vehiclesColumn = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            sortable: true,
        },
        {
            field: 'stsName',
            headerName: 'Sts Name',
            width: 150,
            sortable: true,
        },
        {
            field: 'vehicleRegNum',
            headerName: 'Registration Number',
            width: 220,
            editable: false,
            sortable: true,
        },

        {
            field: 'type',
            headerName: 'Truck Type',
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: 'capacity',
            headerName: 'Capacity',
            width: 100,
            editable: false,
            sortable: true,
        },
        {
            field: 'fualCostLoaded',
            headerName: 'Fual Cost (Loaded)',
            width: 160,
            editable: false,
            sortable: true,
        },
        {
            field: 'fualCostUnloaded',
            headerName: 'Fual Cost (Unloaded)',
            width: 160,
            editable: false,
            sortable: true,
        },
    ];

    let vehiclesRow = [...vehicleDetails];



    return (
        <div>
            <Helmet>
                <title>EcoSync | My Sts Info</title>
            </Helmet>
            <SectionTitle title={"My Sts Info"} subTitle={"need details?"}></SectionTitle>
            <div className="w-full md:w-10/12 mx-auto px-2">
                {
                    isLoading ? <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div> : <div className="text-lg">
                        <div className="grid grid-cols-3 gap-20 my-10 font-semibold text-white">
                            <h1 className="bg-green-800 text-xl p-10 text-center rounded-lg">StsName: {stsId?.name}</h1>
                            <h1 className="bg-yellow-800 text-xl p-10 text-center rounded-lg">Ward Number: {stsId?.wardNumber}</h1>
                            <h1 className="bg-emerald-800 text-xl p-10 text-center rounded-lg">Waste Capacity: {stsId?.capacity}</h1>
                        </div>
                        <div>
                            <h1 className="text-3xl text-rose-900 text-center mt-10 mb-5 font-bold">Managers Details</h1>
                            <Box
                                sx={{ height: 300, width: '100%' }}>
                                <DataGrid
                                    sx={{ color: `${theme == "dark" ? "white" : "dark"}` }}
                                    rows={managersRow}
                                    columns={managersColumn}
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
                        <div>
                        <h1 className="text-3xl text-rose-900 text-center mt-10 mb-5 font-bold">Vehicles Details</h1>
                            <Box
                                sx={{ height: 300, width: '100%' }}>
                                <DataGrid
                                    sx={{ color: `${theme == "dark" ? "white" : "dark"}` }}
                                    rows={vehiclesRow}
                                    columns={vehiclesColumn}
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
                }

            </div>

        </div>
    );
};

export default MyStsInfo;