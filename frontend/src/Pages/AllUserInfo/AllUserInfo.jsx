import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";

const AllUserInfo = () => {
    let axiosPublic = useAxiosPublic();
    const { data: allUser = [], isPending } = useQuery({
        queryKey: ['allUser'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users');
            return res.data;
        }
    });
    console.log(allUser);
    let newDetails = allUser?.map((user, index) => {
        return {
            id: index + 1,
            userName: user?.userName,
            email: user?.email,
            phone: user?.phone,
            role: user?.role,
            assigned: user?.assigned
        }
    })

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'userName',
            headerName: 'User Name',
            width: 300,
            editable: false,
            sortable: true,
        },
        {
            field: 'email',
            headerName: 'User Email',
            width: 300,
            editable: false,
            sortable: true,
        },
        {
            field: 'role',
            headerName: 'User Role',
            width: 200,
            editable: false,
            sortable: true,
        },
        {
            field: 'assigned',
            headerName: 'Assigned',
            sortable: false,
            width: 150,
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
                    <div className="w-full md:w-10/12 mx-auto">
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
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