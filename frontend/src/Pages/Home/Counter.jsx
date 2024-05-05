import CountUp from 'react-countup';
import SectionTitle from '../../Components/SectionTitle';
import GetAllSts from '../../Hooks/GetAllSts';
import GetAllUsers from '../../Hooks/GetAllUsers';
import GetAllLandfill from '../../Hooks/GetAllLandfill';
import GetAllVehicle from '../../Hooks/GetAllVehicle';

const Counter = () => {
    let [allStsCollection] = GetAllSts();
    let [allUser] = GetAllUsers();
    let [allLandfill] = GetAllLandfill();
    let [allVehicle] = GetAllVehicle();
    let stsNumber = allStsCollection?.length;
    let userNumber = allUser?.length;
    let landfillNumber = allLandfill?.length;
    let vehicleNumber = allVehicle?.length;
    return (
        <div>
            <SectionTitle title={"System Info"} subTitle={"Our Dynamic"}></SectionTitle>
            <div
                className='bg-gradient-to-r from-emerald-600 to-cyan-900 my-5 h-52 mx-6 grid grid-cols-1 md:grid-cols-4 gap-10 justify-center items-center rounded-md'>
                <div className='text-center bg-white rounded-full h-36'>
                    <h1 className='text-2xl font-bold mb-2'>Number of Users</h1>
                    <div className='h-20 w-20 rounded-full mx-auto bg-sky-900 text-white p-6'>
                        <CountUp
                            className='text-xl font-bold'
                            start={0}
                            end={userNumber}
                            duration={5} />
                    </div>

                </div>
                <div className='text-center bg-white rounded-full h-36'>
                    <h1 className='text-2xl font-bold mb-2'>Number of STS</h1>
                    <div className='h-20 w-20 rounded-full mx-auto bg-sky-900 text-white p-6'>
                        <CountUp
                            className='text-xl font-bold'
                            start={0}
                            end={stsNumber}
                            duration={5} />
                    </div>
                </div>
                <div className='text-center bg-white rounded-full h-36'>
                    <h1 className='text-2xl font-bold mb-2'>Number of Landfil</h1>
                    <div className='h-20 w-20 rounded-full mx-auto bg-sky-900 text-white p-6'>
                        <CountUp
                            className='text-xl font-bold'
                            start={0}
                            end={landfillNumber}
                            duration={5} />
                    </div>
                </div>
                <div className='text-center bg-white rounded-full h-36'>
                    <h1 className='text-2xl font-bold mb-2'>Number of Vehicle</h1>
                    <div className='h-20 w-20 rounded-full mx-auto bg-sky-900 text-white p-6'>
                        <CountUp
                            className='text-xl font-bold'
                            start={0}
                            end={vehicleNumber}
                            duration={5} />
                    </div>
                </div>
            </div>

        </div>


    );
};

export default Counter;