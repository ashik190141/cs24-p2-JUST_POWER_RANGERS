/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine"; // Import for side effects
import useAuth from '../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Helmet } from "react-helmet-async";

const STSManagerMapRoutes = () => {
    const { user } = useAuth();
    let axiosPublic = useAxiosPublic()
    const [destinationInfo, setDestinationInfo] = useState([]);

    const { data: stsId, isPending: isLoading } = useQuery({
        queryKey: ["stsLocation"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/sts-info/${user?.email}`);
            return res.data.data;
        },
    });
    console.log(stsId?.lat);
    const a = stsId?.lat;
    const b = stsId?.lng;

    const { data: landfill = [], isPending } = useQuery({
        queryKey: ["Get all Landfill"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/get-all-landfill`);
            return res.data;
        },
    });

    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [taxiLatLng, setTaxiLatLng] = useState([a, b]);

    const destinations = [];
    for (let i = 0; i < landfill?.length; i++) {
        let a = landfill[i]?.lat;
        let b = landfill[i]?.lng;
        let c = landfill[i]?.name;
        destinations.push([a, b, c]);
    }


    useEffect(() => {
        // const destinationInfo = [];
        const initializeMap = async () => {
            map.current = L.map(mapContainerRef.current).setView(taxiLatLng, 11);

            const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
            L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution: `Leaflet &copy; ${mapLink}, contribution`,
                maxZoom: 18,
            }).addTo(map.current);

            const taxiIcon = L.icon({
                iconUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCKeFbon4I1bPPkT3B0PFo9LpemWaL8aLX6lJZSUbHkw&s",
                iconSize: [40, 40],
            });

            const marker = L.marker(taxiLatLng, { icon: taxiIcon }).addTo(
                map.current
            );

            const newDestinationInfo = []; // Temporary array to hold destination information

            destinations?.forEach((destination) => {
                const routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(taxiLatLng[0], taxiLatLng[1]),
                        L.latLng(destination[0], destination[1]),
                    ],
                }).addTo(map.current);

                routingControl.on("routesfound", (e) => {
                    const route = e.routes[0];
                    const distanceKm = route.summary.totalDistance / 1000;
                    const timeH = route.summary.totalTime / 3600;

                    newDestinationInfo.push([
                        destination[0],
                        destination[1],
                        destination[2],
                        distanceKm.toFixed(2),
                        timeH.toFixed(2),
                    ]);
                    console.log("Destination Info:", newDestinationInfo);
                    setDestinationInfo([...newDestinationInfo]);
                });
            });

        };

        initializeMap();
    }, [taxiLatLng, destinations]);



    let newDetails = destinationInfo?.map((info, index) => {
        return {
            id: index + 1,
            stsName: stsId?.name,
            landfillName: info[2],
            distance: info[3],
            time: info[4]
        };
    });

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "stsName",
            headerName: "STS Name",
            width: 300,
            editable: false,
            sortable: true,
        },
        {
            field: "landfillName",
            headerName: "Landfill Name",
            width: 300,
            editable: false,
            sortable: true,
        },
        {
            field: "distance",
            headerName: "Distance",
            width: 200,
            editable: false,
            sortable: true,
        },
        {
            field: "time",
            headerName: "Time",
            sortable: true,
            width: 150,
        },
    ];

    let rows = [...newDetails];

    return (
        <div>
            <Helmet>
                <title>EcoSync | Optimize Route</title>
            </Helmet>
            {
                isPending || isLoading ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>

                </> : <>

                    {" "}
                    <div ref={mapContainerRef} style={{ height: "80vh" }} />

                    <div className="w-full md:w-10/12 mx-auto pt-5">
                        <Box sx={{ height: 400, width: "100%" }}>
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
                </>
            }
        </div>
    );
};

export default STSManagerMapRoutes;