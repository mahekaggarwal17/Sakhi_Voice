"use client";

import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";

export interface AgoraConnectionState {
  isConnected: boolean;
  isMuted: boolean;
  channelName: string | null;
  remoteUsersCount: number;
  audioVolume: number;
  connectionQuality: "good" | "fair" | "poor" | "offline";
  error: string | null;
}

export class AgoraVoiceManager {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private remoteAudioTracks: Map<string | number, IRemoteAudioTrack> = new Map();
  private onStateChangeCallback: ((state: AgoraConnectionState) => void) | null = null;
  private volumeInterval: any = null;

  public state: AgoraConnectionState = {
    isConnected: false,
    isMuted: false,
    channelName: null,
    remoteUsersCount: 0,
    audioVolume: 0,
    connectionQuality: "offline",
    error: null,
  };

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.state });
    }
  }

  public onStateChange(callback: (state: AgoraConnectionState) => void) {
    this.onStateChangeCallback = callback;
  }

  public async joinChannel(channelName: string, uid?: number): Promise<boolean> {
    try {
      if (typeof window === "undefined") return false;

      // Dynamic import to avoid SSR errors
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

      // Clean up previous session
      await this.leaveChannel();

      // Initialize client
      this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      // Fetch RTC token from backend API
      const res = await fetch(`/api/agora/token?channelName=${encodeURIComponent(channelName)}&uid=${uid || 0}`);
      const tokenData = await res.json();

      const appId = tokenData.appId || process.env.NEXT_PUBLIC_AGORA_APP_ID || "b6bfc5ea3dac445cb951beb9d373ddc5";
      const token = tokenData.token;

      // Subscribe to events
      this.client.on("user-published", async (user, mediaType) => {
        if (mediaType === "audio" && this.client) {
          await this.client.subscribe(user, mediaType);
          const remoteTrack = user.audioTrack;
          if (remoteTrack) {
            this.remoteAudioTracks.set(user.uid, remoteTrack);
            remoteTrack.play();
          }
          this.state.remoteUsersCount = this.client.remoteUsers.length;
          this.notify();
        }
      });

      this.client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          const track = this.remoteAudioTracks.get(user.uid);
          if (track) {
            track.stop();
            this.remoteAudioTracks.delete(user.uid);
          }
          if (this.client) {
            this.state.remoteUsersCount = this.client.remoteUsers.length;
          }
          this.notify();
        }
      });

      this.client.on("connection-state-change", (curState) => {
        if (curState === "CONNECTED") {
          this.state.connectionQuality = "good";
        } else if (curState === "DISCONNECTED") {
          this.state.connectionQuality = "offline";
        }
        this.notify();
      });

      // Join channel
      await this.client.join(appId, channelName, token || null, uid || null);

      // Create and publish local mic track if permissions granted
      try {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true, // Acoustic Echo Cancellation
          ANS: true, // Automatic Noise Suppression
          AGC: true, // Automatic Gain Control
        });
        await this.client.publish([this.localAudioTrack]);
      } catch (micErr) {
        console.warn("Microphone creation handled with fallback:", micErr);
      }

      this.state.isConnected = true;
      this.state.channelName = channelName;
      this.state.error = null;
      this.state.connectionQuality = "good";

      // Track volume levels
      this.startVolumeMonitoring();

      this.notify();
      return true;
    } catch (err: any) {
      console.error("Agora join channel failed:", err);
      this.state.error = err.message || "Failed to join Agora audio channel";
      this.state.isConnected = false;
      this.notify();
      return false;
    }
  }

  private startVolumeMonitoring() {
    if (this.volumeInterval) clearInterval(this.volumeInterval);

    this.volumeInterval = setInterval(() => {
      if (this.localAudioTrack) {
        const level = this.localAudioTrack.getVolumeLevel();
        this.state.audioVolume = Math.round(level * 100);
        this.notify();
      }
    }, 100);
  }

  public toggleMute(): boolean {
    if (this.localAudioTrack) {
      const nextMuted = !this.state.isMuted;
      this.localAudioTrack.setMuted(nextMuted);
      this.state.isMuted = nextMuted;
      this.notify();
      return nextMuted;
    }
    return false;
  }

  public async leaveChannel(): Promise<void> {
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }

    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    this.remoteAudioTracks.forEach((track) => {
      track.stop();
    });
    this.remoteAudioTracks.clear();

    if (this.client) {
      try {
        await this.client.leave();
      } catch (e) {
        console.warn("Error leaving Agora client:", e);
      }
      this.client = null;
    }

    this.state.isConnected = false;
    this.state.channelName = null;
    this.state.remoteUsersCount = 0;
    this.state.audioVolume = 0;
    this.state.connectionQuality = "offline";
    this.notify();
  }
}
