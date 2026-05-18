import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: true,
  },
};

export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
})(nextConfig);

