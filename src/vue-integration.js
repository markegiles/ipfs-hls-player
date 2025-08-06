/**
 * Vue Integration for IPFS HLS Player
 * Provides a Vue mixin for automatic video enhancement
 * 
 * @author Mark Giles
 * @license MIT
 */

export default {
  mounted() {
    this.enhanceVideos();
  },
  
  updated() {
    // Re-enhance videos when component content changes
    this.enhanceVideos();
  },
  
  beforeUnmount() {
    // Clean up video players when component is destroyed
    this.cleanupVideos();
  },
  
  methods: {
    enhanceVideos() {
      // Wait for DOM to update
      this.$nextTick(() => {
        if (!window.IPFSHLSPlayer) {
          console.warn('🚨 Vue Integration: IPFSHLSPlayer not available - video enhancement skipped');
          return;
        }
        
        // Universal approach: Search entire document for unenhanced videos
        // This handles component content, teleported modals, and any future video contexts
        const videos = document.querySelectorAll('video:not([data-ipfs-enhanced])');
        
        videos.forEach((video) => {
          // Skip videos that are not in the DOM
          if (!document.contains(video)) {
            return;
          }
          
          try {
            // Enhance the video with IPFS HLS Player
            window.IPFSHLSPlayer.enhanceVideoElement(video).catch(error => {
              console.error('🚨 Vue Integration: Failed to enhance video:', video.id || 'no-id', error);
            });
          } catch (error) {
            console.error('🚨 Vue Integration: Video enhancement error:', video.id || 'no-id', error);
          }
        });
      });
    },
    
    cleanupVideos() {
      // Clean up video players when component is destroyed
      if (!window.IPFSHLSPlayer) {
        return;
      }
      
      // Note: Global cleanup could be aggressive, but components are responsible for their own videos
      // For now, only clean up videos that were enhanced by this component instance
      // This is a conservative approach to avoid interfering with other components
      
      const componentVideos = document.querySelectorAll('video[data-ipfs-enhanced="true"]');
      componentVideos.forEach(video => {
        // Only cleanup if this video doesn't have an active component managing it
        if (!video.closest('[data-vue-app]')) {
          try {
            window.IPFSHLSPlayer.destroyPlayer(video);
          } catch (error) {
            console.error('🚨 Vue Integration: Failed to cleanup video:', video.id || 'no-id', error);
          }
        }
      });
    },
    
    // Manual method for dynamic content (modals, etc.)
    enhanceVideosManually() {
      this.enhanceVideos();
    }
  }
};