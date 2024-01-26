export default class ListenerManager {
    private listeners: any = {};
    private nextId = 1;

    public on(
        elem: HTMLElement,
        event?: string,
        listener?: any,
        useCapture?: boolean
    ) {
        const args = [event, listener, useCapture];
        elem.addEventListener.apply(elem, args as any);
        const id = this.nextId++;
        this.listeners[id] = {
            elem,
            args,
        };
        return id;
    }

    public remove(id: number) {
        const listener = this.listeners[id];
        if (listener) {
            delete this.listeners[id];
            listener.elem.removeEventListener.apply(
                listener.elem,
                listener.args
            );
        }
    }

    public removeAll() {
        const old = this.listeners;
        this.listeners = {};
        Object.keys(old).forEach((id) => {
            const listener = old[id];
            listener.elem.removeEventListener.apply(
                listener.elem,
                listener.args
            );
        });
    }
}
