import { useState } from "react";

export const CarouselMain = () => {
  const [currentSlider, setCurrentSlider] = useState(0);
  const sliders = [
    {
      img: "https://images.unsplash.com/photo-1620509048004-415ebb9e2755?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: "",
    },
    {
      img: "https://images.unsplash.com/photo-1637681262973-a516e647e826?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: "",
    },
    {
      img: "https://images.unsplash.com/photo-1610141160723-d2d346e73766?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: "",
    },
    {
      img: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: "",
    },
  ];
  const nextSlider = () =>
    setCurrentSlider((currentSlider) =>
      currentSlider === sliders.length - 1 ? 0 : currentSlider + 1
    );
  return (
    <div className="h-[540px] md:h-[670px] flex items-center relative overflow-hidden">
      {/* arrow */}
      <button
        onClick={nextSlider}
        className="absolute flex justify-center items-center right-2 top-1/2 bg-white rounded-full z-50 w-6 h-6 md:w-8 md:h-8 bgWhite "
      >
        <svg
          viewBox="0 0 1024 1024"
          className="w-4 h-4 md:w-6 md:h-6 icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          transform="rotate(180)"
        >
          <g strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#0095FF"
              d="M685.248 104.704a64 64 0 010 90.496L368.448 512l316.8 316.8a64 64 0 01-90.496 90.496L232.704 557.248a64 64 0 010-90.496l362.048-362.048a64 64 0 0190.496 0z"
            ></path>
          </g>
        </svg>
      </button>
      {/* slider container */}
      <div
        className="ease-linear duration-300 flex gap-[2%]"
        style={{ transform: `translateX(-${currentSlider * 52}%)` }}
      >
        {/* sliders */}
        {sliders.map((slide, inx) => (
          <div
            key={inx}
            className={`${
              currentSlider === inx
                ? "h-[310px] md:h-[310px] lg:h-[580px] "
                : "h-[260px] md:h-[280px] lg:h-[480px]"
            } min-w-[50%] bg-black/30 relative duration-200`}
          >
            <img src={slide.img} className="w-full h-full" alt={slide.tags} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Banner = () => {
  return (
    <div className="h-[540px] lg:h-[670px] px-3 lg:px-5 flex flex-col lg:flex-row items-center justify-center overflow-hidden gap-5 lg:gap-10 relative">
      <div className="bg-[#f3f9fc] w-full absolute left-0 h-[540px] lg:h-[670px] -z-40"></div>
      <div className="w-2/3 lg:w-1/3 text-center lg:text-left space-y-2 lg:space-y-5 py-5">
        <h1 className="text-lg md:text-2xl lg:text-[40px] font-bold">
          Turning trash into treasure,One Collection at a time
        </h1>
        <p className="text-[#616161] text-xs md:text-lg">
          Our Volunteers already made a lot of excellent works that inspire you
        </p>
        <button className="font-bold py-2 xl:py-3 text-xs md:text-base lg:text-lg xl:text-xl hover:scale-95 duration-300 px-4 lg:px-10 text-white bg-[#2f9fb8]">
          Explore More
        </button>
      </div>
      <CarouselMain />
    </div>
  );
};
