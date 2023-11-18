export default class Timeout {
    id;
    handler;
    constructor(handler, time = 3000) {
        this.handler = handler;
        this.id = setTimeout(this.handler, time);
    }
    clear() {
        clearTimeout(this.id);
    }
}
//# sourceMappingURL=Timeout.js.map