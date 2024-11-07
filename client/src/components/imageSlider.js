import React, { useState, useEffect } from "react";
import "../imageSlider.css";

function CustomCarousel({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeID, setTimeID] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      slideNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  const slideNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % children.length); // Loop to the first slide after the last
  };

  const slidePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length); // Loop to the last slide from the first
  };

  return (
    <div
      className="container__slider"
      onMouseEnter={() => clearInterval(timeID)} // Stop autoplay when mouse enters
      onMouseLeave={() => setTimeID(setInterval(slideNext, 5000))} // Start autoplay again when mouse leaves
    >
      {/* Render the slides */}
      {children.map((item, index) => (
        <div
          key={index}
          className={`slider__item slider__item-active-${activeIndex + 1}`}
          style={{
            opacity: activeIndex === index ? 1 : 0, // Only show the active slide
          }}
        >
          {item}
        </div>
      ))}

      {/* Navigation indicators */}
      <div className="container__slider__links">
        {children.map((_, index) => (
          <button
            key={index}
            className={
              activeIndex === index
                ? "container__slider__links-small container__slider__links-small-active"
                : "container__slider__links-small"
            }
            onClick={() => setActiveIndex(index)} // Jump to specific slide
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button className="slider__btn-next" onClick={slideNext}>
        {">"}
      </button>
      <button className="slider__btn-prev" onClick={slidePrev}>
        {"<"}
      </button>
    </div>
  );
}

export default CustomCarousel;