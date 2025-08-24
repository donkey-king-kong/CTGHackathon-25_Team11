export interface InstagramCredentials {
  accessToken: string;
  userId: string;
}

export interface MediaUploadResponse {
  id: string;
  upload_id?: string;
}

export interface StoryPostResponse {
  id: string;
  permalink?: string;
}

export class InstagramService {
  private static baseUrl = 'https://graph.instagram.com/v18.0';

  static async uploadImageToInstagram(
    imageDataUrl: string,
    credentials: InstagramCredentials
  ): Promise<MediaUploadResponse> {
    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // For Instagram Stories, we need to upload as a media object first
      const formData = new FormData();
      formData.append('image', blob, 'story-image.png');
      formData.append('access_token', credentials.accessToken);

      const uploadResponse = await fetch(
        `${this.baseUrl}/${credentials.userId}/media`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      return await uploadResponse.json();
    } catch (error) {
      console.error('Error uploading image to Instagram:', error);
      throw error;
    }
  }

  static async postToInstagramStory(
    mediaId: string,
    caption: string,
    credentials: InstagramCredentials
  ): Promise<StoryPostResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${credentials.userId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            media_type: 'STORIES',
            media_id: mediaId,
            caption: caption,
            access_token: credentials.accessToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Story post failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Publish the story
      const publishResponse = await fetch(
        `${this.baseUrl}/${credentials.userId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: result.id,
            access_token: credentials.accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        throw new Error(`Story publish failed: ${publishResponse.statusText}`);
      }

      return await publishResponse.json();
    } catch (error) {
      console.error('Error posting to Instagram Story:', error);
      throw error;
    }
  }

  static async getInstagramProfile(credentials: InstagramCredentials) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${credentials.userId}?fields=account_type,media_count,followers_count&access_token=${credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Instagram profile:', error);
      throw error;
    }
  }

  // Instagram OAuth flow helpers
  static getInstagramAuthUrl(clientId: string, redirectUri: string): string {
    const scopes = 'user_profile,user_media,instagram_basic,pages_show_list,instagram_manage_insights';
    const baseUrl = 'https://api.instagram.com/oauth/authorize';
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  static async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<{ access_token: string; user_id: string }> {
    try {
      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }
}
