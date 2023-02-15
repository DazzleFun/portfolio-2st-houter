"use strict";

function initPreloader() {
  if (document.querySelector(".preloader")) {
    let preloader = document.querySelector(".preloader");
    window.onload = () => preloader.classList.remove("active");
  };
};
initPreloader();