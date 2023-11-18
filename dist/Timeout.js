export default class Timeout {
    id;
    handler;
    start;
    timeLeft;
    constructor(handler, time = 3000) {
        this.handler = handler;
        this.id = setTimeout(this.handler, time);
        this.start = Date.now();
        this.timeLeft = time;
    }
    clear() {
        clearTimeout(this.id);
    }
    pause() {
        const passed = Date.now() - this.start;
        this.timeLeft = this.timeLeft - passed;
        this.clear();
    }
    continue() {
        this.clear();
        this.id = setTimeout(this.handler, this.timeLeft);
        this.start = Date.now();
    }
}
//# sourceMappingURL=Timeout.js.map