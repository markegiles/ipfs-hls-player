# IPFS HLS Player

A Video.js-based HLS player optimized for IPFS-hosted video content. This player provides a clean, pre-configured Video.js setup that works seamlessly with HLS streams that have been properly transcoded for IPFS compatibility.

## What This Is

This player is a **playback solution** for HLS streams that have already been prepared for IPFS hosting. The key innovation that makes IPFS HLS possible happens during the transcoding process, where standard HLS playlists (with relative paths) are converted to use absolute IPFS gateway URLs.

## The IPFS HLS Challenge

Standard HLS uses relative paths in playlists:
```m3u8
#EXTINF:10.0,
segment001.ts
```

IPFS-compatible HLS uses absolute URLs with CIDs (each segment is a separate IPFS object):
```m3u8
#EXTINF:10.0,
https://gateway.ipfs.io/ipfs/QmSegmentHash123
```

**How HLS works on SPK Network:** During the transcoding/upload process:
1. Each video segment (.ts file) gets its own CID
2. The M3U8 playlist is rewritten to replace relative paths with absolute IPFS gateway URLs
3. The modified playlist gets its own CID
4. All segments and playlists are uploaded to IPFS
5. You play the video using the playlist's CID: `https://gateway.ipfs.io/ipfs/QmPlaylistHash`

This player is optimized to play these IPFS-hosted HLS streams.

## What This Player Provides

- **Pre-configured Video.js**: Optimized settings for IPFS gateway playback
- **VHS Override**: Forces JavaScript HLS implementation for better compatibility
- **Quality Selection UI**: Built-in adaptive bitrate controls
- **Automatic Enhancement**: Finds and upgrades video elements on the page
- **IPFS Gateway Optimization**: Tuned for distributed gateway performance

## Features

- **IPFS-Optimized**: Pre-configured for IPFS-hosted HLS streams
- **Quality Selector**: Manual quality selection UI for HLS streams
- **Auto-Enhancement**: Automatically upgrades video elements
- **Responsive**: Mobile-friendly controls and layouts
- **Customizable**: Clean styling with CSS variables
- **Vue Integration**: Optional Vue.js mixin included

## Installation

### NPM
```bash
npm install ipfs-hls-player
```

### CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/ipfs-hls-player/css/ipfs-hls-player.css">

<!-- JavaScript (minified for production) -->
<script src="https://unpkg.com/ipfs-hls-player/dist/ipfs-hls-player.min.js"></script>
```

## Usage

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/ipfs-hls-player.css">
</head>
<body>
  <!-- Apply width constraints to container, not video element -->
  <div style="max-width: 800px; margin: 0 auto;">
    <video id="my-video" style="width: 100%;"></video>
  </div>
  
  <script src="path/to/ipfs-hls-player.js"></script>
  <script>
    // Initialize player with IPFS HLS stream
    const video = document.getElementById('my-video');
    IPFSHLSPlayer.initializePlayer(video, {
      src: 'https://ipfs.io/ipfs/QmYourPlaylistCID'
    });
  </script>
</body>
</html>
```

**Important:** Apply width constraints (max-width, width) to the container element, not the video element itself. This ensures proper sizing in both normal and fullscreen modes.

### Automatic Enhancement

The player can automatically enhance all video elements on a page:

```javascript
// Enhance all videos on page load
document.addEventListener('DOMContentLoaded', async () => {
  await IPFSHLSPlayer.enhanceStaticVideos();
});
```

### Vue.js Integration

```javascript
import IPFSHLSPlayerMixin from 'ipfs-hls-player/src/vue-integration';

export default {
  mixins: [IPFSHLSPlayerMixin],
  // Your component code...
}
```

### CSS Class Configuration

The player allows customization of which CSS classes are applied to video elements:

```javascript
// Customize CSS classes for specific styling needs
IPFSHLSPlayer.initializePlayer(video, {
  src: 'https://ipfs.io/ipfs/QmYourPlaylistCID',
  cssClasses: {
    // Required classes (always applied)
    required: ['video-js', 'vjs-default-skin'],
    // Optional classes (applied by default, can be overridden)
    optional: ['vjs-big-play-centered', 'vjs-fluid'],
    // Custom classes for your application
    custom: ['my-custom-class', 'theme-dark']
  }
});
```

This is useful when:
- Integrating with existing styling systems
- Preventing conflicts with other video frameworks
- Applying custom themes or layouts

## API Reference

### `IPFSHLSPlayer.initializePlayer(element, options)`

Initialize a player on a video element.

**Parameters:**
- `element` (HTMLVideoElement): Video element to enhance
- `options` (Object): Player configuration
  - `src` (String): Video source URL
  - `type` (String): MIME type (auto-detected if not provided)
  - `poster` (String): Poster image URL
  - `autoplay` (Boolean): Auto-start playback
  - `loop` (Boolean): Loop playback
  - `muted` (Boolean): Start muted
  - `cssClasses` (Object): CSS class configuration
    - `required` (Array): Classes always applied
    - `optional` (Array): Default classes (can be overridden)
    - `custom` (Array): Additional custom classes

**Returns:** Video.js player instance

### `IPFSHLSPlayer.enhanceVideoElement(video, options)`

Enhance an existing video element with IPFS HLS Player.

**Parameters:**
- `video` (HTMLVideoElement): Video element to enhance
- `options` (Object): Enhancement options

**Returns:** Promise<Player>

### `IPFSHLSPlayer.destroyPlayer(element)`

Destroy a player instance and clean up.

**Parameters:**
- `element` (HTMLVideoElement): Video element with player

### `IPFSHLSPlayer.enhanceStaticVideos(container)`

Enhance all unenhanced videos in a container.

**Parameters:**
- `container` (HTMLElement): Container to search within (default: document)

**Returns:** Promise<Array> of player instances

## Configuration

### Global Configuration

```javascript
window.ipfsHLSPlayerConfig = {
  debug: true,                      // Enable debug logging
  enableStaticEnhancement: false    // Disable automatic enhancement
};
```

### Player Options

```javascript
IPFSHLSPlayer.initializePlayer(video, {
  html5: {
    vhs: {
      overrideNative: true,        // Critical for IPFS
      smoothQualityChange: true,
      fastQualityChange: true
    }
  },
  playbackRates: [0.5, 1, 1.5, 2],
  fluid: true,
  responsive: true
});
```

## IPFS Gateway Support

The player works with any IPFS gateway:

```javascript
// IPFS.io gateway
src: 'https://ipfs.io/ipfs/QmPlaylistCID'

// Cloudflare gateway
src: 'https://cloudflare-ipfs.com/ipfs/QmPlaylistCID'

// Local IPFS node
src: 'http://localhost:8080/ipfs/QmPlaylistCID'

// Custom gateway (like SPK Network)
src: 'https://ipfs.dlux.io/ipfs/QmPlaylistCID'
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- iOS Safari 11+
- Chrome for Android

## Troubleshooting

### CORS Errors
Ensure your IPFS gateway supports CORS headers for cross-origin playback. Most public gateways handle this correctly, but local nodes may need configuration.

### Mixed Content Warnings
If your site uses HTTPS, ensure all IPFS gateway URLs also use HTTPS. Browsers block HTTP content on HTTPS pages.

### Player Not Initializing
- Check browser console for errors
- Verify Video.js CSS is loading (the player includes automatic fallback CDN loading)
- Ensure the video element exists in DOM before calling `initializePlayer`

### HLS Playback Issues
- Verify the M3U8 playlist uses absolute IPFS URLs (not relative paths)
- Check that all segment files are accessible via the gateway
- Test the playlist URL directly in the browser

## Development

```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build
```

**Note:** Browsers handle local file access differently. For testing the examples, it's recommended to serve them from a local web server (e.g., `python -m http.server` or `npx http-server`).

## Why Use This Player

While Video.js can play HLS streams out of the box, IPFS-hosted content benefits from specific optimizations:

1. **Gateway Performance**: Tuned buffering and timeout settings for distributed gateways
2. **JavaScript HLS**: Uses VHS (Video.js HTTP Streaming) which handles IPFS URLs more reliably than native HLS
3. **Quality Selection**: Clear UI for manual quality switching when adaptive bitrate needs help
4. **Simplified Setup**: Pre-configured Video.js with all the right settings for IPFS content

This player packages these optimizations into a drop-in solution for IPFS video playback.

## Credits

Built on top of:
- [Video.js](https://videojs.com/) - The open source HTML5 video player
- [videojs-hls-quality-selector](https://github.com/chrisboustead/videojs-hls-quality-selector) - Quality selection UI

## License

MIT © Mark E. Giles

See [LICENSE](LICENSE) file for details.
