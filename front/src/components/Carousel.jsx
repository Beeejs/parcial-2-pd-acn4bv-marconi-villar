// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
/* Constante */
import { carouselList } from '../constants/constants';

const Carousel = () => {
  return (
    <aside className='flex justify-center items-center w-full h-full bg-secondary/60 rounded-md p-8 my-12'>  
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true
        }}
        className="flex justify-center items-center w-full h-full"
      >
        {
          carouselList.map((carousel) => (
            <SwiperSlide key={carousel.id}>
              <img src={carousel.image} alt={carousel.title} className='block object-cover m-auto w-full h-full'/>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </aside>
  )
}

export default Carousel;