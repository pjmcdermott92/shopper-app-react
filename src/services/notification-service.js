let instance = null;
let subscribers = [];
export default class NotificationService {
    constructor() {
        if (!instance) instance = this;
        return instance;
    }

    subscribe = (notifyName, subscriber, callback) => {
        let subs = subscribers[notifyName];
        if (!subs) subscribers[notifyName] = [];
        let obj = { subscriber, callback };
        subscribers[notifyName].push(obj);
    }

    unsubscribe = (notifyName, subscriber) => {
        let subs = subscribers[notifyName];
        if (!subs) return;
        for (let i = 0; i < subs.length; i++) {
            if (subscriber === subs[i].subscriber) {
                subs.splice(i, 1);
                subscribers[notifyName] = subs;
                break;
            }
        }
    }

    dispatch = (notifyName, payload) => {
        let subs = subscribers[notifyName];
        if (!subs) return;
        for (let i = 0; i < subs.length; i++) {
            subs[i].callback(payload);
        }
    }
}
