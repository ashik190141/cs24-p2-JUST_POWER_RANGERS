import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import GetWorkforceTracking from "../../Hooks/GetWorkforceTracking";
import SectionTitle from "../../Components/SectionTitle";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

const WorkforceTracking = () => {
    const [workforceData, isPending] = GetWorkforceTracking();
    const [taxiLatLng, setTaxiLatLng] = useState(null);

    const mapContainerRef = useRef(null);
    const map = useRef(null);
    let HandleMapClose = () =>{
       setTaxiLatLng(false);
    }

    useEffect(() => {
        if (taxiLatLng) {
            const initializeMap = async () => {
                map.current = L.map(mapContainerRef.current).setView(
                    taxiLatLng,
                    11
                );

                const mapLink =
                    "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                    attribution: `Leaflet &copy; ${mapLink}, contribution`,
                    maxZoom: 18,
                }).addTo(map.current);

                const taxiIcon = L.icon({
                    iconUrl:
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCKeFbon4I1bPPkT3B0PFo9LpemWaL8aLX6lJZSUbHkw&s",
                    iconSize: [40, 40],
                });

                const marker = L.marker(taxiLatLng, {
                    icon: taxiIcon
                }).addTo(map.current);
            };

            initializeMap();
        }
    }, [taxiLatLng]);

    function handleMapOpen(a, b) {
        setTaxiLatLng([a, b]);
    }

    return (
        <div>
            <Helmet>
                <title>EcoSynce | Workforce Tracking</title>
            </Helmet>
            <SectionTitle title={"Workforce Tracking"} subTitle={"need details?"}></SectionTitle>
            {
                isPending ? (
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <div className="my-10 w-full mx-auto px-2 md:px-10 max-w-[425px] md:max-w-full overflow-auto max-h-screen">
                        <table className="table table-zebra">
                            <thead>
                                <tr className="text-center">
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Index</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Name</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Email</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Role</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Current Location</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    workforceData?.map((item, index) => (
                                        <tr key={item?._id}>
                                            <th className="p-4 border-b border-blue-gray-50">{index + 1}</th>
                                            <td className=" border-b border-blue-gray-50">
                                                {item?.name}
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                {item?.email}
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                {item?.role}
                                            </td>
                                            <th className="p-2 md:p-4 border-b border-blue-gray-50">
                                                <button className="bg-teal-900 text-white rounded-md px-4 py-2"
                                                    onClick={() => handleMapOpen(item?.lat, item?.lng)}>Open Map</button>
                                            </th>
                                            <th className="p-2 md:p-4 border-b border-blue-gray-50">
                                                <button className="bg-teal-900 text-white rounded-md px-4 py-2"
                                                    onClick={() => HandleMapClose()}>Close Map</button>
                                            </th>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            <div ref={mapContainerRef} style={{ height: "60vh", width:'60vh', display: taxiLatLng ? 'block' : 'none' }} />
        </div>
    );
};

export default WorkforceTracking;

