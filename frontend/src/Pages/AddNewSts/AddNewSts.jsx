/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";

import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useState } from "react";
import GelAvailableStsManager from "../../Hooks/GelAvailableStsManager";
// center={[23.7654, 90.3917]} zoom={14}

const AddNewSts = () => {
  const { register, handleSubmit, reset } = useForm();
  let axiosPublic = useAxiosPublic();
  let [availableStsManager] = GelAvailableStsManager();
  console.log(availableStsManager);

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [clickedPosition, setClickedPosition] = useState(null);
  const handleClick = (e) => {
    setClickedPosition(e.latlng);
    closeModal();
    console.log(e);
  };

  const onSubmit = async (data) => {
    const stsInfo = {
      name: data.stsName,
      wardNumber: data.wardNumber,
      capacity: parseInt(data.capacity),
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      id: data.stsmanager,
    };
    console.log(stsInfo);
    let res = await axiosPublic.post("/create-sts", stsInfo);
    if (res.data.result) {
      Swal.fire({
        position: "top-middle",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      reset();
      setClickedPosition(null);
    } else {
      Swal.fire({
        position: "top-middle",
        icon: "error",
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  return (
    <div>
      <Helmet>
        <title>Dust Master | Add Sts</title>
      </Helmet>
      <SectionTitle
        title={"Add New Sts"}
        subTitle={"More Waste in City?"}
      ></SectionTitle>
      <div>
        <div className="w-10/12 mx-auto my-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-10 my-8">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Sts Name*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Sts Name"
                  {...register("stsName", { required: true })}
                  className="w-full p-2 rounded-md placeholder:pl-2"
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Ward number
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Ward Number"
                  {...register("wardNumber", { required: true })}
                  className="w-full p-2 rounded-md placeholder:pl-2"
                />
              </div>
            </div>
            <div className="flex gap-10 my-8">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Waste Capacity
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Waste Capacity"
                  {...register("capacity", { required: true })}
                  className="w-full p-2 rounded-md placeholder:pl-2"
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    GPS Coordinates*
                  </span>
                </label>
                {!clickedPosition && (
                  <p
                    onClick={openModal}
                    className="btn w-[508px] p-2 rounded-md placeholder:pl-2"
                  >
                    Open Map
                  </p>
                )}
                {clickedPosition && (
                  <input
                    type="text"
                    placeholder="Enter Latitude"
                    value={clickedPosition?.lat}
                    {...register("lat", { required: true })}
                    required
                    className="w-[508px] p-2 rounded-md placeholder:pl-2"
                  />
                )}
                {clickedPosition && (
                  <input
                    type="text"
                    placeholder="Enter Longitude"
                    value={clickedPosition?.lng}
                    {...register("lng", { required: true })}
                    required
                    className="w-[508px] p-2 rounded-md placeholder:pl-2 mt-5"
                  />
                )}
              </div>
            </div>
            <div>
              <div className="w-[508px] mb-5">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Ward number
                  </span>
                </label>
                <select
                  defaultValue="default"
                  {...register("stsmanager", { required: true })}
                  className="w-full py-2 rounded-md"
                >
                  <option disabled value="default">
                    Select Sts Name
                  </option>
                  {availableStsManager?.map((stsManager, index) => {
                    return (
                      <option
                        className="text-black"
                        key={index}
                        value={stsManager?._id}
                      >
                        {stsManager?.userName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              className="bg-green-800 px-4 py-2 rounded-md text-white"
              type="submit"
            >
              Submit Now!
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div
            className="pb-3"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button onClick={closeModal}>Close Map</button>
          </div>
          <MapContainer
            center={[23.7654, 90.3917]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "70vh", width: "60vw", position: "relative" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onClick={handleClick} />
            {clickedPosition && <PositionDisplay position={clickedPosition} />}
          </MapContainer>
        </Modal>
      </div>
    </div>
  );
};

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });

  return null;
};

const PositionDisplay = ({ position }) => {
  return (
    <div
      style={{
        color: "black",
        position: "absolute",
        top: "10px",
        left: "50px",
        background: "white",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        zIndex: 1000,
        // margin-bottom:"10px",
      }}
    >
      Latitude: {position.lat.toFixed(5)}, Longitude: {position.lng.toFixed(5)}
    </div>
  );
};
MapClickHandler.propTypes = {
  onClick: PropTypes.func,
};
PositionDisplay.propTypes = {
  position: PropTypes.node,
};
export default AddNewSts;
