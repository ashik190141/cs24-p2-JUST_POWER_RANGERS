import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";

import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import GetMyLandfill from "../../Hooks/GetMyLandfill";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";


const MyLandfillInfo = () => {
    let [myLandfill, isLandfillPending] = GetMyLandfill()
    let axiosPublic = useAxiosPublic();
    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    const { data: allManagers = [] } = useQuery({
        queryKey: ['get-all-my-landfill-managers'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-landfill-managers/${myLandfill._id}`);
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


    return (
        <div>
            <Helmet>
                <title>EcoSync | My Landfill Info</title>
            </Helmet>
            <SectionTitle title={"My Landfill Info"} subTitle={"need details?"}></SectionTitle>
            <div className="w-full md:w-10/12 mx-auto">
                {
                    isLandfillPending ? <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div> : <div className="text-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 my-10 font-semibold text-white">
                            <h1 className="bg-green-800 text-xl p-8 text-center rounded-lg">
                                Landfil Name: {myLandfill?.name}</h1>
                            <h1 className="bg-violet-950 text-xl p-8 text-center rounded-lg">
                                Waste Capacity: {myLandfill?.capacity}</h1>
                            <h1 className="bg-yellow-800 text-xl p-8 text-center rounded-lg">
                                Start Time: {myLandfill?.startTime}</h1>
                            <h1 className="bg-blue-950 text-xl p-8 text-center rounded-lg">
                                End Time: {myLandfill?.endTime}</h1>
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

                    </div>
                }

            </div>

        </div>
    );
};

export default MyLandfillInfo;