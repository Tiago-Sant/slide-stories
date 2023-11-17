export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = this.slides[this.index];
        this.init();
    }
    hide(el) {
        el.classList.remove("active");
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[index];
        this.slides.forEach(el => this.hide(el));
        this.slides[index].classList.add("active");
    }
    prev() {
        this.index === 0 ? this.show(this.slides.length - 1) : this.show(this.index - 1);
    }
    next() {
        this.slides.length - 1 === this.index ? this.show(0) : this.show(this.index + 1);
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Slide Anterior";
        nextButton.innerText = "Proximo Slide";
        nextButton.addEventListener("pointerup", () => this.next());
        prevButton.addEventListener("pointerup", () => this.prev());
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map