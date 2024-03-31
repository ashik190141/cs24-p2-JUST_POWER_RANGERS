import animation from '../../assets/About us/Animation - 1701198416051.json'
import { Helmet } from 'react-helmet-async';
import Lottie from 'lottie-react';
import SectionTitle from '../../Components/SectionTitle';


const AboutUs = () => {

    return (
        <div className="my-5 w-10/12 mx-auto">
            <Helmet><title>EcoSync | About Us</title></Helmet>
            <SectionTitle title={"About Us"} subTitle={'Wanna Know?'}></SectionTitle>

            <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                    <Lottie className="h-[450px] w-10/12" animationData={animation} loop={true}></Lottie>
                </div>

                <div className='flex-1'>
                    <div className="collapse collapse-arrow bg-gray-300 my-1">
                        <input type="radio" name="my-accordion-2" defaultChecked />
                        <div className="collapse-title text-xl font-medium">
                            {"What is EcoSync's mission?"}
                        </div>
                        <div className="collapse-content">
                            <p>{"EcoSync's mission is to revolutionize waste management through technological innovation and sustainability."}</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-gray-300 my-1">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            {"How does EcoSync contribute to waste management?"}
                        </div>
                        <div className="collapse-content">
                            <p>{"EcoSync streamlines waste collection, transportation, and processing, enhancing efficiency and accountability."}</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-gray-300 my-1">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            {"What sets EcoSync apart from other solutions?"}
                        </div>
                        <div className="collapse-content">
                            <p>EcoSync stands out for its comprehensive web application that serves as a nerve center for waste management activities, offering real-time monitoring and analytics.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-gray-300 my-1">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            {"Who can benefit from using EcoSync?"}
                        </div>
                        <div className="collapse-content">
                            <p>EcoSync benefits municipalities, waste management agencies, and communities by optimizing resource allocation and reducing environmental impact.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-gray-300 my-1">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            {"How can I get started with EcoSync?"}
                        </div>
                        <div className="collapse-content">
                            <p>Getting started with EcoSync is easy! Simply contact us to schedule a demo and learn how our platform can transform your waste management operations.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AboutUs;