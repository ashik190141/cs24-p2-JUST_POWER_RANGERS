import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine"; // Import for side effects
import useAuth from '../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const STSManagerMapRoutes = () => {
    const { user } = useAuth();
    let axiosPublic = useAxiosPublic()
    const [destinationInfo, setDestinationInfo] = useState([]); // State to hold destination information
    
    const { data: stsId } = useQuery({
      queryKey: ["stsLocation"],
      queryFn: async () => {
        const res = await axiosPublic.get(`/sts-info/${user?.email}`);
        return res.data.data;
        },
    });
    console.log(stsId?.lat);
    const a = stsId?.lat;
    const b = stsId?.lng;

    const { data: landfill = [] } = useQuery({
      queryKey: ["landfillLocation"],
      queryFn: async () => {
        const res = await axiosPublic.get(`/get-all-landfill`);
        return res.data;
      },
    });
    console.log(landfill);

  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const [taxiLatLng, setTaxiLatLng] = useState([
    a, b
  ]); // Initial taxi location
//   const destinations = [
//     [27.245, 83.992, "a"],
//     [28.245, 80.992, "b"],
//     [28.245, 81.992, "c"],
//   ];
    
    const destinations = [];
    for (let i = 0; i < landfill?.length; i++){
        let a = landfill[i].lat;
        let b = landfill[i].lng;
        let c = landfill[i].name;
        destinations.push([a,b,c]);
    }

  useEffect(() => {
    const destinationInfo = [];

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

      destinations.forEach((destination) => {
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
          // console.log("Destination Info:", newDestinationInfo);
          setDestinationInfo([...newDestinationInfo]);
        });
      });
    };

    initializeMap();
  }, [taxiLatLng, destinations]); // Re-render map when taxiLatLng or destinations change
  // Sort the destinationInfo array based on time
//   useEffect(() => {
//       const sortedDestinationInfo = [...destinationInfo].sort(
//           (a, b) => a[4] - b[4]
//       );
//       setDestinationInfo(sortedDestinationInfo);
//   }, [destinationInfo]);

  console.log("Destination Info:", destinationInfo);

  return (
    <>
      {" "}
      <div ref={mapContainerRef} style={{height: "80vh" }} />
      <ul>
        {destinationInfo.map((info, index) => (
          <li key={index}>
            Destination {info[2]} - Distance: {info[3]} km, Time: {info[4]} h,
            lat: {info[0]}, lon: {info[1]}
          </li>
        ))}
      </ul>
    </>
  );
};

export default STSManagerMapRoutes;
