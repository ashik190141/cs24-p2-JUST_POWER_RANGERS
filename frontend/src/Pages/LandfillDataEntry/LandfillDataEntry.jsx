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

import img from '../../../public/logo.png'

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
        let usableVehicle = res?.data?.data?.filter(vehicle => vehicle.type == "Compactor" || vehicle.type == "Dump Truck");
        setStsVehicle(usableVehicle);
    }

    let downloadPDF = (thankyouText = "Thank you for using EcoSync!") => {
        const pdf = new jsPDF();

        // Add logo to the PDF
        const logoWidth = 20; 
        const logoHeight = 20; 
        const logoX = 5; 
        const logoY = 5; 
        pdf.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);

        let y = 10 + logoHeight + 5;

        // Add bill information to the PDF
        pdf.setFontSize(24);
        pdf.setTextColor('#333');
        pdf.text('Bill Information', pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 20; // Increase Y coordinate for spacing

        // Add bill details
        const billDetails = [
            { label: 'STS Name:', value: pdfData.stsName },
            { label: 'Vehicle Number:', value: pdfData.vehicleRegNum },
            { label: 'Landfill Name:', value: pdfData.landName },
            { label: 'Weight of Waste:', value: pdfData.waste.toString() }, // Convert to string
            { label: 'Truck Arrival:', value: pdfData.arrival },
            { label: 'Truck Departure:', value: pdfData.departure },
            { label: 'Total Bill:', value: totalBill.toString() }, 
            { label: 'Distance:', value: totalDistance.toString() } 
        ];

        billDetails.forEach(detail => {
            pdf.setFontSize(14);
            pdf.setTextColor('#333');
            pdf.text(detail.label, 40, y);
            pdf.setTextColor('#666');
            pdf.text(detail.value, 120, y);
            y += 10; 
        });

        // Add thank you text
        y += 10; // Increase Y coordinate for spacing
        pdf.setFontSize(16);
        pdf.setTextColor('#008000');
        pdf.text(thankyouText, pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });

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
                    <div className="w-full md:w-10/12 mx-auto my-10 px-2">
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
                                                    <option key={sts._id} value={sts?.name}>{sts?.name}</option>
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
                                                    <option key={vehicle?._id} value={vehicle?.vehicleRegNum
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
                            onClick={() => downloadPDF()}
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