import animation from '../../assets/About us/Animation - 1701198416051.json'
import { Helmet } from 'react-helmet-async';
import Lottie from 'lottie-react';
import SectionTitle from '../../Components/SectionTitle';


const AboutUs = () => {

    return (
        <div className="my-5 w-10/12 mx-auto">
            <Helmet><title>Dust Master | About Us</title></Helmet>
            <SectionTitle title={"About Us"} subTitle={'Wanna Know?'}></SectionTitle>

            <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                    <Lottie className="h-[450px] w-10/12" animationData={animation} loop={true}></Lottie>
                </div>

                <div className='flex-1'>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" defaultChecked />
                        <div className="collapse-title text-xl font-medium">
                            Click to open this one and close others
                        </div>
                        <div className="collapse-content">
                            <p>hello</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            Click to open this one and close others
                        </div>
                        <div className="collapse-content">
                            <p>hello</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            Click to open this one and close others
                        </div>
                        <div className="collapse-content">
                            <p>hello</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AboutUs;