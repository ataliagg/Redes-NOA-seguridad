document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".work-slider");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".work-slider-track");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dotsContainer = slider.querySelector(".slider-dots");
    const slides = Array.from(slider.querySelectorAll(".work-slide"));

    if (!track || !prevBtn || !nextBtn || !dotsContainer || slides.length === 0) return;

    let index = 0;
    let autoplay = null;
    let startX = 0;
    let endX = 0;

    function getVisibleSlides() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleSlides());
    }

    function updateSlider() {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      updateDots();
    }

    function goToSlide(newIndex) {
      const maxIndex = getMaxIndex();

      if (newIndex > maxIndex) {
        index = 0;
      } else if (newIndex < 0) {
        index = maxIndex;
      } else {
        index = newIndex;
      }

      updateSlider();
    }

    function createDots() {
      dotsContainer.innerHTML = "";
      const pages = getMaxIndex() + 1;

      for (let i = 0; i < pages; i++) {
        const dot = document.createElement("button");
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);

        if (i === index) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
          goToSlide(i);
          resetAutoplay();
        });

        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll(".slider-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function startAutoplay() {
      if (slider.dataset.autoplay !== "true") return;
      stopAutoplay();
      autoplay = setInterval(() => {
        goToSlide(index + 1);
      }, 3500);
    }

    function stopAutoplay() {
      if (autoplay) {
        clearInterval(autoplay);
        autoplay = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    prevBtn.addEventListener("click", () => {
      goToSlide(index - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener("click", () => {
      goToSlide(index + 1);
      resetAutoplay();
    });

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    slider.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(index + 1);
        } else {
          goToSlide(index - 1);
        }
        resetAutoplay();
      }
    }, { passive: true });

    window.addEventListener("resize", () => {
      const maxIndex = getMaxIndex();
      if (index > maxIndex) {
        index = maxIndex;
      }
      createDots();
      updateSlider();
    });

    createDots();
    updateSlider();
    startAutoplay();
  });
});