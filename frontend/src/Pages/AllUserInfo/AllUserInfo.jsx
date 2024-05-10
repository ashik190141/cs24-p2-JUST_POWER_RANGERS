import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import GetAllUsers from "../../Hooks/GetAllUsers";
import { useEffect, useState } from 'react';

const AllUserInfo = () => {
    let [allUser, isPending] = GetAllUsers();
    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    useEffect(() => {
        setFilteredUsers(allUser);
    }, [allUser]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filtered = allUser?.filter(user =>
            user.userName.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    {
        filteredUsers?.map((user, index) => {
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
    }

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

    const rows = filteredUsers.map((user, index) => ({
        ...user,
        id: index + 1
    }));



    return (
        <div className='w-full mx-auto'>
            <Helmet>
                <title>EcoSync | User Profile</title>
            </Helmet>
            <SectionTitle title={"All Users Info"} subTitle={"need details?"}></SectionTitle>
            {
                isPending ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </> : <>
                    <div className='my-10 w-full mx-auto px-2 md:px-5 max-w-[425px] md:max-w-full overflow-auto max-h-screen'>
                        <div className='min-h-20 text-center mx-auto my-5 max-w-[400px]'>
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 placeholder:text-center"
                            />
                        </div>
                        <div className="`w-full px-4 max-w-[425px] md:max-w-full overflow-x-auto mx-auto pt-5">
                            <Box
                                sx={{ height: 650, width: '100%' }}>
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
                    </div>


                </>
            }
        </div>
    );
};

export default AllUserInfo;