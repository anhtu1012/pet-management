/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./index.scss";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";
import { useEffect, useState } from "react";
//props
//number of Slides +> định nghĩa số lượng slide của carousel
// carousel => numberOfSlides = 3 => carousel show 3 item 1 lüc
// carousel => numberOfSlides = 1 => carousel show 1 item 1 lüc

export default function Carousel({
  numberOfSiles = 1,
  category = "Cat",
  autoplay = false,
}) {
  const [pets, setPets] = useState([]);
  const fetchMovies = async () => {
    const res = await axios.get(
      "https://662a755267df268010a405bf.mockapi.io/PetManagement"
    );
    console.log(res.data);
    setPets(res.data);
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={numberOfSiles}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={
          autoplay
            ? [Autoplay, Pagination, Navigation]
            : [Pagination, Navigation]
        }
        className={`carousel ${numberOfSiles > 1 ? "multi-item" : ""}`} //toán tử 3 ngôi
      >
        {pets
          .filter((pet) => pet.category === category)
          .map((pet) => (
            <SwiperSlide>
              <img className="carousel__img" src={pet.poster.poster1} alt="" />
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
