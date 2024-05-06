import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import GetAllUsers from "../../Hooks/GetAllUsers";
import { useEffect, useState } from 'react';

const AllUserInfo = () => {
    let [allUser, isPending] = GetAllUsers();

    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    let newDetails = allUser?.map((user, index) => {
        return {
            id: index + 1,
            userName: user?.userName,
            gender: user?.gender,
            email: user?.email,
            phone: user?.phone,
            role: user?.role,
            assigned: user?.assigned,
            address: user?.address,
            district: user?.district,
            division: user?.division,
        }
    })

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'userName',
            headerName: 'User Name',
            width: 180,
            editable: false,
            sortable: true,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 80,
            editable: false,
            sortable: true,
        },
        {
            field: 'email',
            headerName: 'User Email',
            width: 250,
            editable: false,
            sortable: true,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            width: 160,
            editable: false,
            sortable: true,
        },
        {
            field: 'district',
            headerName: 'District',
            width: 130,
            editable: false,
            sortable: true,
        },
        {
            field: 'division',
            headerName: 'Division',
            width: 130,
            editable: false,
            sortable: true,
        },

        {
            field: 'role',
            headerName: 'User Role',
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: 'assigned',
            headerName: 'Assigned',
            sortable: false,
            width: 100,
        },
    ];

    let rows = [...newDetails];



    return (
        <div>
            <Helmet>
                <title>EcoSync | User Profile</title>
            </Helmet>
            <SectionTitle title={"All Users Info"} subTitle={"need details?"}></SectionTitle>
            {
                isPending ? <>
                </> : <>
                    <div className="w-full px-4 mx-auto">
                        <Box
                            sx={{ height: 700, width: '100%' }}>
                            <DataGrid
                                sx={{ color: `${theme == "dark" ? "white" : "dark"}` }}
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
                </>
            }
        </div>
    );
};

export default AllUserInfo;