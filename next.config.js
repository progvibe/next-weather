/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {};

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://maps.googleapis.com/:path*",
//       },
//     ];
//   },
// };
export default config;
