import Swiper, { Navigation, Pagination, Autoplay, EffectFade } from 'swiper';

// Init sliders
function initSliders() {

// .sec-1__slider
  new Swiper(".sec-1__slider", {
    modules: [Pagination, Autoplay, EffectFade],

    // Options
    loop: true,
    speed: 1000,

    // Modules
    pagination: {
      el: ".sec-1__slider__pagination",
      clickable: true,
    },
    autoplay: {
      delay: 2000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  });

// .sec-2__slider house-slider
  let sec2HouseSlider = new Swiper(".house-slider", {
    modules: [Navigation],

    // Options
    loop: true,
    spaceBetween: 30,
    slidesPerView: "auto",
    initialSlide: 1,
    observer: true,
    observerParents: true,
    observerSlideChildren: true,

    // Breakpoints
    breakpoints: {
      761: {
        spaceBetween: 50,
      },
    }
  });

// .sec-2__slider villa-slider
  let sec2VillaSlider = new Swiper(".villa-slider", {
    modules: [Navigation],

    // Options
    loop: true,
    spaceBetween: 30,
    slidesPerView: "auto",
    initialSlide: 1,
    observer: true,
    observerParents: true,
    observerSlideChildren: true,

    // Breakpoints
    breakpoints: {
      761: {
        spaceBetween: 50,
      },
    }
  });

// .sec-2__slider apartment-slider
  let sec2ApartmentSlider = new Swiper(".apartment-slider", {
    modules: [Navigation],

    // Options
    loop: true,
    spaceBetween: 30,
    slidesPerView: "auto",
    initialSlide: 1,
    observer: true,
    observerParents: true,
    observerSlideChildren: true,

    // Breakpoints
    breakpoints: {
      761: {
        spaceBetween: 50,
      },
    }
  });

// .sec-2__slider (tabs)
  let sec2SliderTabButtons = document.querySelectorAll(".sec-2__tab-nav__button");
  let sec2SliderTabItems = document.querySelectorAll(".sec-2__slider");
  sec2SliderTabButtons.forEach((item) => {
    item.addEventListener("click", () => {
      let arrItem = item.getAttribute("data-tab");
      let activeSlide = document.querySelector(arrItem);
      if (!item.classList.contains("active")) {
        sec2SliderTabButtons.forEach((item) => {
          item.classList.remove("active");
        });
        sec2SliderTabItems.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        activeSlide.classList.add("active");
      };
    });
  });

// .sec-2__slider (buttons)
  let prevEL = document.getElementById("sec2Slider-PrevEL");
  let nextEL = document.getElementById("sec2Slider-NextEL");
  prevEL.addEventListener("click", () => {
    sec2HouseSlider.slidePrev();
    sec2VillaSlider.slidePrev();
    sec2ApartmentSlider.slidePrev();
  });
  nextEL.addEventListener("click", () => {
    sec2HouseSlider.slideNext();
    sec2VillaSlider.slideNext();
    sec2ApartmentSlider.slideNext();
  });

// .sec-4__slider
  new Swiper(".sec-4__slider", {
    modules: [Pagination, Autoplay],

    // Options
    spaceBetween: 30,
    slidesPerView: "auto",
    initialSlide: 1,
    loop: true,
    speed: 1500,
    autoplay: {
      delay: 2500,
      stopOnLastSlide: false,
      disableOnInteraction: true,
    },

    // Control
    pagination: {
      el: ".sec-4__slider__pagination",
      clickable: true,
    },

    // Breakpoints
    breakpoints: {
      761: {
        spaceBetween: 56,
      },
    },
  });
};
initSliders();