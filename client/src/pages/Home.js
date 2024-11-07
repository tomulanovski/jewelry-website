import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CustomCarousel from "../components/imageSlider";

const images = [
  { src: `${process.env.PUBLIC_URL}/gold_bracelt.jpg`, alt: 'Slide 1', caption: 'Elegant Necklace' },
  { src: `${process.env.PUBLIC_URL}/necklace.jpg`, alt: 'Slide 2', caption: 'Gold Bracelet' },
  { src: `${process.env.PUBLIC_URL}/ring.jpg`, alt: 'Slide 3', caption: 'Diamond Ring' },
  { src: `${process.env.PUBLIC_URL}/gold_bracelt-removebg-preview.jpg`, alt: 'Slide 4', caption: 'Diamond Ring' },
];

function Home() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="container mt-5">
        <h1 className="text-center mb-4">Welcome to Our Store</h1>

        {/* CustomCarousel (Bootstrap can be used here as well if needed) */}
        <CustomCarousel>
          {images.map((image, index) => (
            <div className="carousel-item" key={index}>
              <img
                className="d-block w-100"
                src={image.src}
                alt={image.alt}
                style={{ objectFit: "cover", height: "400px" }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{image.caption}</h5>
              </div>
            </div>
          ))}
        </CustomCarousel>

        {/* Add some content */}
        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card">
              <img src={`${process.env.PUBLIC_URL}/necklace.jpg`} alt="Product 1" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Elegant Necklace</h5>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <a href="#" className="btn btn-primary">Buy Now</a>
              </div>
            </div>
          </div>
          {/* Repeat for other products */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;