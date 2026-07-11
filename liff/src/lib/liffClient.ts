import liff from "@line/liff";

export async function initLiff(): Promise<void> {
  await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

export function getIdToken(): string {
  const token = liff.getIDToken();
  if (!token) {
    throw new Error("ไม่พบ LINE ID token กรุณาเปิดฟอร์มนี้จากแอป LINE อีกครั้ง");
  }
  return token;
}

export function closeLiffWindow(): void {
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}
