import { Options } from 'react-use-websocket';

const processMessages = (event: WebSocketEventMap['message']) => {
  console.log(event.data);
};

export const options: Options = {
  onOpen: () => {
    console.log('Websocket communication established!');
  },
  onClose: () => {
    console.log('Websocket connection closed.');
  },
  onMessage: (event) => {
    processMessages(event);
  },
};
