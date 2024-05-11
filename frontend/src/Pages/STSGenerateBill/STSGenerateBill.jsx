import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import jsPDF from "jspdf";
import img from '../../../public/logo.png'

const STSGenerateBill = () => {
    let contractorList = useLoaderData().data;
    console.log(contractorList);

    let [theme, setTheme] = useState(localStorage.getItem("theme"));
    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, [theme]);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 90
        },
        {
            field: "name",
            headerName: "Contractor Id",
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: "requiredAmount",
            headerName: "Required Amounts",
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: "actualCollection",
            headerName: "Actual Collection",
            width: 200,
            editable: false,
            sortable: true,
        },
        {
            field: "basicPay",
            headerName: "Basic Pay",
            sortable: true,
            width: 150,
        },
        {
            field: "fine",
            headerName: "Fine",
            sortable: true,
            width: 150,
        },
        {
            field: "totalBill",
            headerName: "Total Bill",
            sortable: true,
            width: 100,
        },
        {
            field: "actions",
            headerName: "Generate Bill",
            sortable: false,
            width: 150,
            renderCell: (params) => (
                <button className="bg-blue-800 rounded-md text-white px-2" onClick={() => handleButtonClick(params.id)}>
                    Download
                </button>
            ),
        },
    ];



    let newDetails = contractorList?.map((info, index) => {
        let basicPay = parseInt(info.actualCollection * info.paymentPerTon);
        let requiredAmount = parseInt(info.requiredAmount);
        let actualCollection = parseInt(info.actualCollection);
        let fine = 0;
        let deficit = Math.max(0, requiredAmount - actualCollection);
        let fineRate = parseInt(info.fine)
        fine = parseInt(deficit * fineRate);
        let totalBill = basicPay - fine;

        return {
            id: index + 1,
            name: info.name,
            requiredAmount: requiredAmount,
            actualCollection: actualCollection,
            basicPay: basicPay,
            fine: fine,
            totalBill: totalBill,
        };
    });
    // console.log(newDetails);
    let rows = [...newDetails];


    const handleButtonClick = (id) => {
        let thankyouText = "Thank you for using EcoSync!"
        let name = contractorList[id - 1].name;
        let required = contractorList[id - 1].requiredAmount;
        let actual = contractorList[id - 1].actualCollection;
        let basic = parseInt(contractorList[id - 1].actualCollection * contractorList[id - 1].paymentPerTon);
        let deficit = Math.max(0, contractorList[id - 1].requiredAmount - contractorList[id - 1].actualCollection);
        let fineRate = parseInt(contractorList[id - 1].fine)
        let fine = parseInt(deficit * fineRate);
        let totalBill = basic - fine;

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
        pdf.text('Contructor Bill Information', pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 20; // Increase Y coordinate for spacing

        // Add bill details
        const billDetails = [
            { label: 'Contructor Id:', value: name },
            { label: 'Required Waste:', value: required.toString() },
            { label: 'Actual Collection:', value: actual.toString() },
            { label: 'Basic Pay:', value: basic.toString() }, // Convert to string
            { label: 'Fine:', value: fine.toString() },
            { label: 'Total Bill:', value: totalBill.toString() },
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
    return (
        <div>
            <Helmet>
                <title>EcoSync | Admin Home</title>
            </Helmet>
            <SectionTitle title={"Generate Bill"} subTitle={"Need Money Update?"}></SectionTitle>

            <div className={`w-full px-4 md:px-5 max-w-[425px] md:max-w-full overflow-x-auto mx-auto pt-5 text-${theme == "dark" ? "white" : "black"}`}>
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
        </div>
    );
};

export default STSGenerateBill;
