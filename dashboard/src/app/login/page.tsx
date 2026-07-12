import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorCode = resolvedSearchParams.error;
  const errorMessage =
    errorCode === "locked"
      ? "พยายามเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอ 15 นาทีแล้วลองใหม่"
      : errorCode !== undefined
        ? "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <img src="/logo.png" alt="YUME Insurance" className="mb-4 h-12 w-12 rounded-full" />
        <h1 className="mb-1 text-lg font-bold text-neutral-900">YUME Insurance</h1>
        <p className="mb-6 text-sm text-neutral-500">เข้าสู่ระบบสำหรับเจ้าหน้าที่</p>

        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="username">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoFocus
          autoComplete="username"
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
        />

        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
        />

        {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
