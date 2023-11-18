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
    thumbItems;
    thumb;
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
        this.thumbItems = null;
        this.thumb = null;
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
        if (this.thumbItems) {
            this.thumbItems.forEach(el => el.classList.remove("active"));
            this.thumb = this.thumbItems[index];
            this.thumb?.classList.add("active");
        }
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
        if (this.thumb)
            this.thumb.style.animationDuration = `${time}ms`;
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
            this.thumb?.classList.add("paused");
            this.slide instanceof HTMLVideoElement && this.slide.pause();
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            this.thumb?.classList.remove("paused");
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
    addThumbItems() {
        const thumbContainer = document.createElement("div");
        thumbContainer.id = "slide-thumb";
        for (let i = 0; i < this.slides.length; i++) {
            thumbContainer.innerHTML += `<span><span class="thumb-item"></span></span>`;
        }
        this.controls.appendChild(thumbContainer);
        this.thumbItems = Array.from(thumbContainer.querySelectorAll(".thumb-item"));
    }
    init() {
        this.addControls();
        this.addThumbItems();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map