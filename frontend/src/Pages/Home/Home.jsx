
import SectionTitle from '../../Components/SectionTitle';
import { Banner } from './Banner';
import Effect from './Effect';

const Home = () => {
    return (
        <div className="min-h-screen">
            <Banner></Banner>
            <SectionTitle title={'Waste Cause Polutions'} subTitle={'Clean Dhaka'}></SectionTitle>
            <Effect></Effect>
        </div>
    );
};

export default Home;