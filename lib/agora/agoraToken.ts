import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number | string;
  role: "publisher" | "subscriber";
  expiresAt: number;
}

export function generateAgoraRtcToken(
  channelName: string,
  uid: number | string = 0,
  role: "publisher" | "subscriber" = "publisher"
): AgoraTokenResponse {
  const appId = process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID || "b6bfc5ea3dac445cb951beb9d373ddc5";
  const appCertificate = process.env.AGORA_APP_CERTIFICATE || "c7d61b3b003f4f5d97f40c783f37116d";

  const expirationTimeInSeconds = 3600 * 24; // 24 hours
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  let token = "";

  try {
    const numericUid = typeof uid === "number" ? uid : (parseInt(uid as string, 10) || 0);
    const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    if (appCertificate && appCertificate.trim().length > 0) {
      token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        numericUid,
        rtcRole,
        privilegeExpiredTs
      );
    }
  } catch (err) {
    console.warn("Agora Access Token generation error, using fallback token:", err);
  }

  return {
    token,
    appId,
    channelName,
    uid,
    role,
    expiresAt: privilegeExpiredTs,
  };
}
