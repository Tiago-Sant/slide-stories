export default class Timeout {
    id;
    handler;

    constructor(handler: TimerHandler, time: number = 3000) {
        this.handler = handler;
        this.id = setTimeout(this.handler, time);
    }
        
    clear() {
        clearTimeout(this.id);
    }
}