import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import GetAllSts from "../../Hooks/GetAllSts";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import { useState } from "react";
import GetMyLandfill from "../../Hooks/GetMyLandfill";
import jsPDF from 'jspdf';

const LandfillDataEntry = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let [allStsCollection] = GetAllSts();
    const [arrival, setArrival] = useState('00:00');
    const [departure, setDeparture] = useState('00:00');
    const [disable, setDisable] = useState(true);
    const [pdfData, setPdfData] = useState({});
    let [totalBill, setTotalBill] = useState(0);
    let [totalDistance, setTotalDistance] = useState(0);
    let [stsVehicle, setStsVehicle] = useState([]);

    let [myLandfill, isLandfillPending] = GetMyLandfill();

    let handleStsChange = async (e) => {
        let stsName = e.target.value;
        const foundItem = allStsCollection.find(item => item.name === stsName);
        let wardNo = foundItem.wardNumber;
        let res = await axiosPublic.get(`/sts-vehicles/${wardNo}`)
        setStsVehicle(res.data.data);
    }

    let downloadPDF = () => {
        const content = `
          STS Name: ${pdfData.stsName}
          Vehicle Number: ${pdfData.vehicleRegNum}
          Landfill Name: ${pdfData.landName}
          Weight of Waste: ${pdfData.waste}
          Truck Arrival: ${pdfData.arrival}
          Truck Departure: ${pdfData.departure}
          Total Bill: ${totalBill}
          Distance: ${totalDistance}
        `;

        const pdf = new jsPDF();
        pdf.text(content, 10, 10);
        pdf.save('Total_bill.pdf');
    };

    const onSubmit = async (data) => {
        const landData = {
            stsName: data.stsName,
            vehicleRegNum: data.vehicleRegNum,
            landName: data.landName,
            waste: parseInt(data.waste),
            arrival: arrival,
            departure: departure
        };
        if (data.stsName == 'default') {
            return Swal.fire({
                position: "center",
                icon: "error",
                title: "Please select a Sts Name",
                showConfirmButton: false,
                timer: 1500
            });
        }
        if (data.vehicleRegNum == 'default') {
            return Swal.fire({
                position: "center",
                icon: "error",
                title: "Please select a Vehicle Number",
                showConfirmButton: false,
                timer: 1500
            });
        }
        setPdfData(landData);
        let res = await axiosPublic.post('/create-truck-dumping', landData);
        if (res.data.result) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            console.log(res.data);
            reset();
            setArrival('00:00');
            setDeparture('00:00');
            setDisable(false);
            setTotalBill(res.data.bill.toFixed(2));
            setTotalDistance(res.data.distance.toFixed(2));
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
    return (
        <div>
            <Helmet>
                <title>EcoSync | Land Manager Data Entry</title>
            </Helmet>
            <SectionTitle title={"Update Data"} subTitle={'Stay Updated?'}></SectionTitle>
            {
                isLandfillPending ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </> : <div>
                    <div className="w-10/12 mx-auto my-10">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex gap-10">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Sts Name</span>
                                    </label>
                                    <select defaultValue="default"
                                        {...register('stsName', { required: true })}
                                        onChange={handleStsChange}
                                        className="w-full py-2 rounded-md">
                                        <option disabled value="default">Select a Sts</option>
                                        {
                                            allStsCollection?.map((sts) => {
                                                return (
                                                    <option className="text-black" key={sts._id} value={sts?.name}>{sts?.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Vehicle Number</span>
                                    </label>
                                    <select defaultValue="default"
                                        {...register('vehicleRegNum', { required: true })}
                                        className="w-full py-2 rounded-md">
                                        <option disabled value="default">Select a Vehicle</option>
                                        {
                                            stsVehicle?.map((vehicle) => {
                                                return (
                                                    <option className="text-black" key={vehicle?._id} value={vehicle?.vehicleRegNum
                                                    }>{vehicle?.vehicleRegNum
                                                        }</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-10 my-5">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Landfill Name*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={myLandfill?.name}
                                        readOnly
                                        {...register('landName', { required: true })}
                                        className="w-full p-2 rounded-md placeholder:pl-2" />
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Weight of Waste</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Weight of Waste"
                                        {...register('waste', { required: true })}
                                        className="w-full p-2 rounded-md placeholder:pl-2" />
                                </div>
                            </div>
                            <div className="flex gap-10 my-5">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">
                                            Truck Arrival Time
                                        </span>
                                    </label>
                                    <div className="w-full">
                                        <TimePicker
                                            className={"w-1/2"}
                                            onChange={setArrival}
                                            value={arrival}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">
                                            Truck Departure Time
                                        </span>
                                    </label>
                                    <div className="w-full">
                                        <TimePicker
                                            className={"w-1/2"}
                                            onChange={setDeparture}
                                            value={departure}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                className="bg-green-800 px-4 py-2 rounded-md text-white"
                                type="submit">
                                Submit Now!
                            </button>
                        </form>
                    </div>
                    <div className="w-10/12 mx-auto my-10">
                        <button
                            disabled={disable}
                            onClick={downloadPDF}
                            className="bg-blue-800 px-4 py-2 rounded-md text-white disabled:bg-gray-400"
                            type="submit">
                            Download Slip!
                        </button>
                    </div>
                </div >
            }
        </div>
    );
};

export default LandfillDataEntry;