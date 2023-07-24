const devGatewayUrl = 'http://localhost:8000';
const prodGatewayUrl = 'https://sb-gateway.onrender.com';
const devSocketUrl = 'ws://localhost:4242';

let gatewayUrl: string;

process.env.NODE_ENV === 'production' ? (gatewayUrl = prodGatewayUrl) : (gatewayUrl = devGatewayUrl);

export default gatewayUrl;

export const cdnHostname = 'https://d3fulr0i8qqtgb.cloudfront.net';
export const socketUrl = devSocketUrl;
