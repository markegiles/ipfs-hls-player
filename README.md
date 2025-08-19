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
- **Intelligent Type Detection**: Handles IPFS CIDs and various video formats without assumptions

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

### Intelligent MIME Type Detection

The player includes advanced type detection specifically designed for IPFS content where file extensions are not available:

#### Magic Byte Detection
For IPFS CIDs without file extensions, the player uses **magic byte detection** - the industry standard method for identifying file types:

1. **Fetches first 200 bytes** of the content using a Range request (efficient)
2. **Checks magic bytes** to identify the format:
   - `#EXTM3U` → HLS playlist (`application/x-mpegURL`)
   - `ftyp` box → MP4/MOV/QuickTime (`video/mp4`)
   - EBML header → WebM/Matroska (`video/webm`)
   - `OggS` → Ogg/Ogv (`video/ogg`)
   - And more formats...

3. **Falls back to Content-Type** header if magic bytes don't match
4. **Normalizes MIME types** (e.g., `video/quicktime` → `video/mp4`)

#### Video.js Middleware Integration
The player uses Video.js middleware to transparently handle IPFS URLs:

```javascript
// Automatically detects type for IPFS URLs
IPFSHLSPlayer.initializePlayer(video, {
  src: 'https://ipfs.io/ipfs/QmYourCID'  // No type needed!
});
```

The middleware:
- Only processes IPFS URLs without an explicit type
- Runs magic byte detection asynchronously
- Provides the detected type to Video.js
- Falls back to `video/mp4` if detection fails

#### Manual Type Override
You can still manually specify types for faster initialization:
```javascript
IPFSHLSPlayer.initializePlayer(video, {
  src: 'https://ipfs.io/ipfs/QmYourHLSPlaylist',
  type: 'application/x-mpegURL'  // Skip detection for known HLS
});
```

This intelligent detection ensures all video formats work correctly with IPFS, not just MP4.

## API Reference

### `IPFSHLSPlayer.initializePlayer(element, options)`

Initialize a player on a video element.

**Parameters:**
- `element` (HTMLVideoElement): Video element to enhance
- `options` (Object): Player configuration
  - `src` (String): Video source URL
  - `type` (String): MIME type (optional - intelligently auto-detected based on URL)
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

## HLS Quality Selector

The player includes an optimized quality selector for HLS streams with proper timing to ensure all quality levels are detected:

### How It Works
1. **For .m3u8 URLs**: Quality selector initializes immediately
2. **For IPFS CIDs**: 
   - Waits for the `loadstart` event (after type detection)
   - Checks if content is HLS
   - Initializes selector before manifest loads
   - Ensures all quality levels are tracked

### Quality Levels Display
- Shows all available resolutions (1080p, 720p, 480p, etc.)
- Allows manual quality selection
- Displays current quality
- Only appears for HLS content (hidden for MP4s)

### Timing Optimization
The player uses the `loadstart` event for perfect timing:
- Fires after middleware detects content type
- Occurs before HLS manifest loads
- Ensures quality selector catches all levels as they're added
- Prevents empty quality dropdowns

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+ (⚠️ HLS not supported - see Safari Limitations below)
- Edge 79+
- iOS Safari 11+ (⚠️ HLS not supported, limited MSE support)
- Chrome for Android

### Safari Limitations

**Important**: Video.js 8.x HLS playback is **incompatible with Safari**. This is a known Video.js issue, not specific to this player.

#### What Works in Safari
- ✅ MP4 videos (with type detection)
- ✅ WebM videos (if Safari supports the codec)
- ✅ Other standard video formats
- ✅ All non-HLS features of the player

#### What Doesn't Work
- ❌ HLS streams (.m3u8) via Video.js
- ❌ Quality selector for HLS
- ❌ Any Video.js HLS features

#### Safari HLS Options
If you need HLS in Safari, consider these alternatives:

1. **Use MP4/WebM formats instead** - Best compatibility
2. **Native HTML5 video** - Safari's native HLS works but lacks Video.js features
3. **Wait for Video.js 9.x** - Future versions may fix Safari compatibility
4. **Alternative players** - Some players like Shaka Player may work differently with Safari

#### Technical Background
Video.js 8.x attempts to override Safari's native HLS support to provide consistent cross-browser behavior, but this override is broken. The VHS (Video.js HTTP Streaming) engine has fundamental incompatibilities with Safari's media handling.

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

### Type Detection Issues
If videos fail to play with IPFS CIDs:
- Check the Content-Type headers from your IPFS gateway using browser dev tools
- Try manually specifying the type parameter
- Ensure your gateway properly sets Content-Type headers for video files
- For HLS streams without .m3u8 extension, always specify `type: 'application/x-mpegURL'`

### Safari HLS Incompatibility
**HLS streams do not work in Safari with Video.js 8.x** - This is a known limitation.

If you encounter HLS playback issues in Safari:
- This is expected behavior - Video.js HLS is incompatible with Safari
- Use MP4 or WebM formats for Safari compatibility
- See the [Safari Limitations](#safari-limitations) section for alternatives
- Test in Chrome or Firefox to verify your HLS stream works correctly

### "Player Already Initialized" Warning
When reusing video elements:
```javascript
// Clean up existing player first
if (video._ipfsHLSPlayer) {
  IPFSHLSPlayer.destroyPlayer(video);
}
// Now safe to initialize new player
const player = IPFSHLSPlayer.initializePlayer(video, options);
```

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
