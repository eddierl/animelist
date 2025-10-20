import type { NextConfig } from "next";
import { execSync } from "child_process";

const gitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_SHA: gitSha,
  },
  /* config options here */
  images: {
    remotePatterns: [new URL("https://s4.anilist.co/**")],
  },
};

export default nextConfig;
