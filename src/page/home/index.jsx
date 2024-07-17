import Carousel from "../../components/carousel";

function HomePage() {
  return (
    <div>
      <Carousel autoplay />
      <Carousel numberOfSiles={3} category="Dog" />
    </div>
  );
}

export default HomePage;
