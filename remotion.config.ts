import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Optional: point Remotion at a specific Chrome/Chromium binary
// (e.g. REMOTION_BROWSER=/usr/bin/chromium npm run render).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
  Config.setChromiumOpenGlRenderer('swiftshader');
}
