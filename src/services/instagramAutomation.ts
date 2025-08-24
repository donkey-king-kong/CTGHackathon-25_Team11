export interface InstagramCredentials {
  username: string;
  accessToken?: string;
}

export interface PostData {
  imageDataUrl: string;
  caption: string;
  isStory?: boolean;
}

export class InstagramAutomationService {
  
  /**
   * Opens Instagram with pre-filled content using multiple strategies
   */
  static async openInstagramWithContent(postData: PostData, credentials?: InstagramCredentials): Promise<void> {
    const { imageDataUrl, caption, isStory = true } = postData;
    
    try {
      // Strategy 1: Web Share API (works on mobile with Instagram app)
      if (await this.tryWebShareAPI(imageDataUrl, caption)) {
        return;
      }
      
      // Strategy 2: Instagram Deep Links (mobile app)
      if (await this.tryInstagramDeepLink(imageDataUrl, caption, credentials)) {
        return;
      }
      
      // Strategy 3: Instagram Web with URL parameters
      if (await this.tryInstagramWebWithParams(imageDataUrl, caption, isStory, credentials)) {
        return;
      }
      
      // Strategy 4: Fallback to manual posting
      this.fallbackToManualPosting(imageDataUrl, caption);
      
    } catch (error) {
      console.error('Error opening Instagram:', error);
      this.fallbackToManualPosting(imageDataUrl, caption);
    }
  }

  /**
   * Strategy 1: Use Web Share API for native sharing
   */
  private static async tryWebShareAPI(imageDataUrl: string, caption: string): Promise<boolean> {
    try {
      if (!navigator.share || !navigator.canShare) {
        return false;
      }

      // Convert data URL to file
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'instagram-story.png', { type: 'image/png' });

      // Check if sharing files is supported
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Share to Instagram',
          text: caption,
          files: [file]
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Web Share API failed:', error);
      return false;
    }
  }

  /**
   * Strategy 2: Use Instagram deep links (mobile apps)
   */
  private static async tryInstagramDeepLink(
    imageDataUrl: string, 
    caption: string, 
    credentials?: InstagramCredentials
  ): Promise<boolean> {
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!isMobile) {
        return false;
      }

      // Download image first for user to select
      this.downloadImage(imageDataUrl, 'instagram-story.png');
      
      // Copy caption to clipboard
      await navigator.clipboard.writeText(caption);
      
      // Try Instagram app deep link
      const deepLinkUrl = 'instagram://camera';
      
      // Show user guidance
      alert(`📱 Opening Instagram app!\n\n✅ Image downloaded\n✅ Caption copied\n\nJust select your image and paste the caption!`);
      
      // Attempt to open Instagram app
      window.location.href = deepLinkUrl;
      
      // Fallback to web version after delay if app doesn't open
      setTimeout(() => {
        window.open('https://www.instagram.com/accounts/login/?next=/create/story/', '_blank');
      }, 3000);
      
      return true;
    } catch (error) {
      console.warn('Instagram deep link failed:', error);
      return false;
    }
  }

  /**
   * Strategy 3: Open Instagram web with optimized URL and auto-filled session
   */
  private static async tryInstagramWebWithParams(
    imageDataUrl: string, 
    caption: string, 
    isStory: boolean,
    credentials?: InstagramCredentials
  ): Promise<boolean> {
    try {
      // Download image for user
      this.downloadImage(imageDataUrl, 'instagram-post.png');
      
      // Copy caption to clipboard
      await navigator.clipboard.writeText(caption);
      
      let instagramUrl = 'https://www.instagram.com/';
      
      // If user has credentials, try to pre-authenticate
      if (credentials?.username) {
        // Direct to creation flow
        instagramUrl = isStory 
          ? 'https://www.instagram.com/accounts/login/?next=/create/story/'
          : 'https://www.instagram.com/accounts/login/?next=/create/posts/';
          
        // Show user what's happening
        alert(`🚀 Opening Instagram for @${credentials.username}!\n\n✅ Image downloaded\n✅ Caption copied\n\nYou'll be taken directly to the ${isStory ? 'Story' : 'Post'} creation page!`);
      } else {
        // Generic creation flow
        instagramUrl = isStory 
          ? 'https://www.instagram.com/create/story/'
          : 'https://www.instagram.com/create/posts/';
          
        alert(`🚀 Opening Instagram!\n\n✅ Image downloaded\n✅ Caption copied\n\nLog in and you'll be taken to the ${isStory ? 'Story' : 'Post'} creation page!`);
      }
      
      // Open Instagram
      window.open(instagramUrl, '_blank');
      return true;
      
    } catch (error) {
      console.warn('Instagram web with params failed:', error);
      return false;
    }
  }

  /**
   * Fallback: Manual posting with clear instructions
   */
  private static fallbackToManualPosting(imageDataUrl: string, caption: string): void {
    // Download image
    this.downloadImage(imageDataUrl, 'instagram-post.png');
    
    // Copy caption
    navigator.clipboard.writeText(caption).catch(() => {
      console.warn('Could not copy caption to clipboard');
    });
    
    // Show instructions
    const instructions = `
📱 Manual Instagram Posting

✅ Image downloaded to your device
✅ Caption copied to clipboard

Steps:
1. Go to Instagram (opening now...)
2. Click "+" to create new post/story
3. Upload your downloaded image
4. Paste the caption (Ctrl+V / Cmd+V)
5. Add any final touches
6. Click "Share"!

That's it! 🎉
    `;
    
    alert(instructions.trim());
    
    // Open Instagram
    window.open('https://www.instagram.com/', '_blank');
  }

  /**
   * Utility function to download image
   */
  private static downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Check if user is on mobile device
   */
  static isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Get optimal Instagram URL for device
   */
  static getOptimalInstagramUrl(isStory: boolean = true): string {
    const isMobile = this.isMobileDevice();
    
    if (isMobile) {
      // Try app first, fallback to web
      return isStory ? 'instagram://camera' : 'instagram://camera';
    } else {
      // Desktop - direct to web creation
      return isStory 
        ? 'https://www.instagram.com/create/story/'
        : 'https://www.instagram.com/create/posts/';
    }
  }
}
