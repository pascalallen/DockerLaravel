import _ from 'lodash';
import { v4 as uuidV4 } from 'uuid';

type Event = {
  name: string;
  data?: { [key: string]: any };
};
type CallBack = (messageId: string, data?: { [key: string]: any }) => void;
type EventListener = { id: string; callback: CallBack };

class EventDispatcher {
  private readonly handlers: { [key: string]: EventListener[] };

  constructor() {
    this.handlers = {};
  }

  public hasHandler(eventName: string): boolean {
    return !_.isEmpty(this.handlers[eventName]);
  }

  public attach(eventName: string, callback: CallBack): string {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    const listener = { id: uuidV4(), callback };
    this.handlers[eventName].push(listener);
    return listener.id;
  }

  public detach(eventName: string, listenerId: string): void {
    if (!this.hasHandler(eventName)) {
      return;
    }

    this.handlers[eventName] = _.reject(
      this.handlers[eventName],
      attachedEventListener => attachedEventListener.id === listenerId
    );
  }

  public trigger(event: Event): void {
    if (!this.hasHandler(event.name)) {
      return;
    }

    const messageId = uuidV4();

    _.each(this.handlers[event.name], eventListener => {
      eventListener.callback(messageId, event.data);
    });
  }
}

export default new EventDispatcher();
