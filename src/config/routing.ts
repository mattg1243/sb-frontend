const devGatewayUrl = 'http://localhost:8000';
const prodGatewayUrl = 'https://api.sweatshopbeats.com';
const devSocketUrl = 'ws://localhost:4242';

let gatewayUrl: string;
let socketUrl: string;

process.env.NODE_ENV === 'production' ? (socketUrl = 'ws://courier.sweatshopbeats.com') : (socketUrl = devSocketUrl);
export { socketUrl };

process.env.NODE_ENV === 'production' ? (gatewayUrl = prodGatewayUrl) : (gatewayUrl = devGatewayUrl);

export default gatewayUrl;

export const cdnHostname = 'https://d3fulr0i8qqtgb.cloudfront.net';
