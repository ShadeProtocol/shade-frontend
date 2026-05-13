export type MerchantProfile = {
  walletAddress: string;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessLogo: string;
  businessCategory: string;
  businessDescription: string;
  emailVerified: boolean;
  createdAt: string;
};

const PROFILE_PREFIX = "shade:merchant-profile:";
export const MERCHANT_SESSION_KEY = "shade:merchant-session";

export function getMerchantProfile(address: string) {
  const profile = localStorage.getItem(`${PROFILE_PREFIX}${address}`);

  if (!profile) {
    return null;
  }

  return JSON.parse(profile) as MerchantProfile;
}

export function saveMerchantProfile(profile: MerchantProfile) {
  localStorage.setItem(
    `${PROFILE_PREFIX}${profile.walletAddress}`,
    JSON.stringify(profile),
  );
}

export function getMerchantSessionAddress() {
  const session = sessionStorage.getItem(MERCHANT_SESSION_KEY);

  if (!session) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(session) as { address?: string };
    return parsedSession.address ?? null;
  } catch {
    return null;
  }
}
