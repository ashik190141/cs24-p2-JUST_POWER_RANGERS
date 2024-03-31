/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useState } from "react";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import SectionTitle from "../../Components/SectionTitle";

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
import GetAvailableLandManager from "../../Hooks/GetAvailableLandManager";

const AddNewLandFill = () => {
  const { register, handleSubmit, reset } = useForm();
  let axiosPublic = useAxiosPublic();
  const [startValue, setStartValue] = useState('00:00');
  const [endValue, setEndValue] = useState('00:00');

  let [availableLandManager] = GetAvailableLandManager();

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
  };

  const onSubmit = async (data) => {
    if (availableLandManager.length === 0) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Create a Landfill Manager First",
        showConfirmButton: false,
        timer: 2000
      })

    }

    const landFillInfo = {
      name: data.landfillName,
      capacity: parseInt(data.capacity),
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      startTime: startValue,
      endTime: endValue,
      id: data.LandManager
    };
    let res = await axiosPublic.post('/create-landfill', landFillInfo);
    if (res.data.result) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000
      });
      reset();
      setClickedPosition(null);
      setStartValue('00:00');
      setEndValue('00:00');
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  return (
    <div>
      <Helmet>
        <title>EcoSync | Add Landfill</title>
      </Helmet>
      <SectionTitle
        title={"Add New Landfill"}
        subTitle={"More Waste?"}
      ></SectionTitle>
      <div>
        <div className="w-10/12 mx-auto my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-10 my-5">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Landfill Name*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Landfill Name"
                  {...register("landfillName", { required: true })}
                  className="w-full p-2 rounded-md placeholder:pl-2"
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Waste Capacity
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Enter Waste Capacity"
                  {...register("capacity", { required: true })}
                  className="w-full p-2 rounded-md placeholder:pl-2"
                />
              </div>
            </div>
            <div>
              <div className="w-[508px] mb-5">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Available Landfill Manager
                  </span>
                </label>
                <select defaultValue="default"
                  {...register('LandManager', { required: true })}
                  className="w-full py-2 rounded-md">
                  <option disabled value="default">Select Manager Name</option>
                  {
                    availableLandManager?.map((landManager, index) => {
                      return (
                        <option className="text-black" key={index} value={landManager?._id}>
                          {landManager?.userName}</option>
                      )
                    })
                  }

                </select>
              </div>
            </div>
            <div className="my-5">
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
              <div className="flex gap-5">
                <div className="flex-1">
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
                </div>
                <div className="flex-1">
                  {clickedPosition && (
                    <input
                      type="text"
                      placeholder="Enter Longitude"
                      value={clickedPosition?.lng}
                      {...register("lng", { required: true })}
                      required
                      className="w-[508px] p-2 rounded-md placeholder:pl-2"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-10 my-5">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Landfill Start Time
                  </span>
                </label>
                <div className="w-full">
                  <TimePicker
                    className={"w-1/2"}
                    onChange={setStartValue}
                    value={startValue}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xl font-semibold">
                    Landfill End Time
                  </span>
                </label>
                <div className="w-full">
                  <TimePicker
                    className={"w-1/2"}
                    onChange={setEndValue}
                    value={endValue}
                  />
                </div>
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
            {clickedPosition && (
              <PositionDisplay position={clickedPosition} />
            )}
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

export default AddNewLandFill;