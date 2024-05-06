/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Helmet } from "react-helmet-async";
import GetMyStsInfo from "../../Hooks/GetMyStsInfo";
import GetAllLandfill from "../../Hooks/GetAllLandfill";

const STSManagerMapRoutes = () => {
    const [destinationInfo, setDestinationInfo] = useState([]);
    let [stsId, isLoading] = GetMyStsInfo();
    let [allLandfill, isPending] = GetAllLandfill();

    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    console.log(stsId?.lat);
    const a = stsId?.lat;
    const b = stsId?.lng;

    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [taxiLatLng, setTaxiLatLng] = useState([a, b]);

    const destinations = [];
    for (let i = 0; i < allLandfill?.length; i++) {
        let a = allLandfill[i]?.lat;
        let b = allLandfill[i]?.lng;
        let c = allLandfill[i]?.name;
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

                    <h1 className="text-3xl text-rose-900 text-center my-5 font-bold">Optimum Routes</h1>

                    <div className="w-full md:w-10/12 mx-auto pt-5">
                        <Box sx={{ height: 400, width: "100%" }}>
                            <DataGrid
                                sx={{ color: `${theme == "dark" ? "white" : "dark"}` }}
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