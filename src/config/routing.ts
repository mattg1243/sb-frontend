const devGatewayUrl = 'http://localhost:8000';
const prodGatewayUrl = 'https://sb-gateway.onrender.com';

let gatewayUrl: string;

process.env.NODE_ENV === 'production' ? (gatewayUrl = prodGatewayUrl) : (gatewayUrl = devGatewayUrl);

export default gatewayUrl;

export const cdnHostname = 'https://d3fulr0i8qqtgb.cloudfront.net';
