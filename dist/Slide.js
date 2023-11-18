import Timeout from "./Timeout.js";
export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    timeout;
    paused;
    pausedTimeout;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.timeout = null;
        this.index = Number(localStorage.getItem("activeSlide")) || 0;
        this.slide = this.slides[this.index];
        this.paused = false;
        this.pausedTimeout = null;
        this.init();
    }
    hide(el) {
        el.classList.remove("active");
        if (el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.pause();
        }
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[index];
        localStorage.setItem("activeSlide", index.toString());
        this.slides.forEach(el => this.hide(el));
        this.slides[index].classList.add("active");
        if (this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide);
            return;
        }
        this.auto(this.time);
    }
    autoVideo(video) {
        video.muted = true;
        video.play();
        let firstPlay = true;
        video.addEventListener("playing", () => {
            if (firstPlay) {
                firstPlay = false;
                this.auto(video.duration * 1000);
            }
        });
        this.auto(video.duration * 1000);
    }
    auto(time) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
    }
    prev() {
        if (this.paused)
            return;
        this.index === 0 ? this.show(this.slides.length - 1) : this.show(this.index - 1);
    }
    next() {
        if (this.paused)
            return;
        this.slides.length - 1 === this.index ? this.show(0) : this.show(this.index + 1);
    }
    pause() {
        this.pausedTimeout = new Timeout(() => {
            this.timeout?.pause();
            this.paused = true;
            this.slide instanceof HTMLVideoElement && this.slide.pause();
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            this.slide instanceof HTMLVideoElement && this.slide.play();
        }
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.textContent = "Slide Anterior";
        nextButton.textContent = "Proximo Slide";
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        this.controls.addEventListener("pointerdown", () => this.pause());
        this.controls.addEventListener("pointerup", () => this.continue());
        nextButton.addEventListener("pointerup", () => this.next());
        prevButton.addEventListener("pointerup", () => this.prev());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map