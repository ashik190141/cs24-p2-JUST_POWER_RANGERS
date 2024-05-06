import img from "../../assets/Home/dustan-woodhouse-RUqoVelx59I-unsplash.jpg";
import img1 from "../../assets/Home/chris-leboutillier-TUJud0AWAPI-unsplash.jpg";
import img2 from "../../assets/Home/xianyu-hao-betJpW6fuoY-unsplash.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const Effect = () => {

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-10 my-10'>
      <div data-aos="fade-up"
        data-aos-duration="3000"
        className="px-4 font-play glass py-8 max-w-[450px] shadow-lg font-sans space-y-3 mx-auto bg-[#bcb382]">
        <div className="flex gap-3 items-start justify-center">

          <div className="flex flex-col justify-center w-full h-52 lg:h-[280px] relative">
            <img className="size-48 bg-black/40 " src={img} alt="card navigate ui" />
            <h6 className="text-lg font-bold py-2">Environment Polution</h6>
            <p className="text-[#2d4739] text-left text-sm"> <span className="font-bold">Biodiversity Decline:</span> Pollution disrupts ecosystems, leading to biodiversity loss and threatening the survival of various plant and animal species.</p>

          </div>

          <div className="text-left w-[100%] mx-auto space-y-2">
            <p className="text-[#2d4739] text- text-sm"><span className="font-bold"> Health Risks:</span> Pollution from air, water, and soil contaminants poses significant health risks to humans, including respiratory diseases, waterborne illnesses, and exposure to harmful chemicals.</p>
            <p className="text-[#2d4739] text-xs md:text-sm"><span className="font-bold"> Climate Change:</span> Certain pollutants, like greenhouse gases, contribute to climate change, resulting in rising temperatures, sea-level rise, and extreme weather events.</p>
          </div>
        </div>
      </div>
      <div data-aos="fade-up"
        data-aos-duration="3000"
        className="px-4 font-play glass py-8 max-w-[450px] shadow-lg font-sans space-y-3 mx-auto bg-[#bcb382]">
        <div className="flex items-start justify-center">

          <div className="flex flex-col justify-center w-full h-52 lg:h-[280px] relative">
            <img className="size-48 bg-black/40 " src={img1} alt="card navigate ui" />
            <h6 className="text-xl font-bold py-2">Air Polution</h6>
            <p className="text-[#2d4739] text-sm"><span className="font-bold"> Health Impacts:</span> Air pollution leads to respiratory illnesses, cardiovascular problems, and premature deaths due to the inhalation of harmful pollutants.</p>
          </div>

          <div className="text-left w-[85%] mx-auto space-y-2">
            <p className="text-[#2d4739] text-xs md:text-sm"> <span className="font-bold">Environmental Damage:</span> It harms ecosystems, reduces crop yields, and contributes to the formation of smog, acid rain, and ozone depletion.</p>
            <p className="text-[#2d4739] text-xs md:text-sm"><span className="font-bold">Economic Costs: </span> Air pollution imposes significant healthcare expenses, productivity losses, and damages to infrastructure and industries.</p>
          </div>
        </div>
      </div>

      <div data-aos="fade-up"
        data-aos-duration="3000"
        className="px-4 font-play glass py-8 max-w-[450px] shadow-lg font-sans space-y-3 mx-auto bg-[#bcb382]">
        <div className="flex items-start gap-2 justify-center">

          <div className="flex flex-col justify-center w-full h-52 lg:h-[280px] relative">
            <img className="size-48 bg-black/40 " src={img2} alt="card navigate ui" />
            <h6 className="text-xl font-bold py-2">Water Polution</h6>
            <p className="text-[#2d4739] text-sm"><span className="font-bold">Ecosystem Degradation:</span>Polluted water harms aquatic life and disrupts entire ecosystems, leading to declines in biodiversity.</p>
          </div>

          <div className="text-left w-[85%] mx-auto space-y-2">
            <p className="text-[#2d4739] text-xs md:text-sm"> <span className="font-bold">Contamination Spread:</span> Pollutants in water bodies can spread across different regions through interconnected water systems, exacerbating pollution in larger areas..</p>
            <p className="text-[#2d4739] text-xs md:text-sm"><span className="font-bold">Economic Consequences: </span> Water pollution has economic implications, including damage to fisheries, tourism, agriculture. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Effect;
