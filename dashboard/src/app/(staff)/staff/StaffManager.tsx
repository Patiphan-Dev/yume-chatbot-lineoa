"use client";

import { FormEvent, useRef, useState } from "react";
import { createStaffAction, resetStaffPasswordAction, setStaffActiveAction } from "./actions";

// Forms here use onSubmit + preventDefault instead of form action={fn}: client
// function actions require React 19, and this app runs React 18 — there the
// action is silently ignored and submit buttons do nothing.

export interface StaffRow {
  id: string;
  name: string;
  username: string;
  active: boolean;
  createdAt: string;
}

export function AddStaffForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError(null);
    setSuccess(false);
    const result = await createStaffAction(formData);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <FieldInput label="ชื่อ-นามสกุล" name="name" type="text" placeholder="สมชาย ใจดี" />
      <FieldInput label="ชื่อผู้ใช้" name="username" type="text" placeholder="somchai" />
      <FieldInput label="รหัสผ่าน (อย่างน้อย 8 ตัว)" name="password" type="password" placeholder="••••••••" />
      <button
        type="submit"
        className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
      >
        เพิ่มสมาชิก
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
      {success && <p className="w-full text-sm text-emerald-700">เพิ่มสมาชิกเรียบร้อยแล้ว</p>}
    </form>
  );
}

function FieldInput({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor={`staff-${name}`}>
        {label}
      </label>
      <input
        id={`staff-${name}`}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-52 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
      />
    </div>
  );
}

export function StaffRowActions({ staff }: { staff: StaffRow }) {
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  async function handleToggleActive() {
    setError(null);
    const result = await setStaffActiveAction(staff.id, !staff.active);
    if (!result.ok) setError(result.message);
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError(null);
    const result = await resetStaffPasswordAction(staff.id, formData);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setShowReset(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowReset((value) => !value)}
          className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-100"
        >
          เปลี่ยนรหัสผ่าน
        </button>
        <button
          type="button"
          onClick={handleToggleActive}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            staff.active
              ? "border border-red-200 text-red-600 hover:bg-red-50"
              : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {staff.active ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
        </button>
      </div>

      {showReset && (
        <form onSubmit={handleResetPassword} className="flex gap-2">
          <input
            name="password"
            type="password"
            required
            placeholder="รหัสผ่านใหม่"
            className="w-36 rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-amber-700 focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white">
            บันทึก
          </button>
        </form>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
