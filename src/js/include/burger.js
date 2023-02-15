function initBurger() {
  if (document.querySelector(".header")) {
    let html = document.querySelector("html");
    let burger = document.querySelector(".header__burger");
    let header = document.querySelector(".header");
    let burgerMenu = document.querySelector(".burger-menu");
    let main = document.querySelector(".main");

    burger.addEventListener("click", () => {
      if (!burger.classList.contains("active")) {
        html.classList.add("active");
        burger.classList.add("active");
        header.classList.add("active");
        burgerMenu.classList.add("active");
        main.classList.add("active");
      } else {
        html.classList.remove("active");
        burger.classList.remove("active");
        header.classList.remove("active");
        burgerMenu.classList.remove("active");
        main.classList.remove("active");
      };

      window.addEventListener("resize", () => {
        if ((window.innerWidth > 640)) {
          html.classList.remove("active");
          burger.classList.remove("active");
          header.classList.remove("active");
          burgerMenu.classList.remove("active");
          main.classList.remove("active");
        }
      })
    });
  };
};
initBurger();