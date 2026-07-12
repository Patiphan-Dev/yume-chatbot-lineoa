import { FormEvent, useEffect, useState } from "react";
import { CarInfoFields } from "./components/CarInfoFields";
import { INSURANCE_TYPE_LABEL_TH, isInsuranceType } from "./lib/insuranceType";
import { closeLiffWindow, getIdToken, initLiff } from "./lib/liffClient";
import { CarInfoFormValues, SubmitRequestError, submitInsuranceRequest } from "./lib/submitRequest";

type Phase = "initializing" | "form" | "submitting" | "success" | "fatal-error";

const EMPTY_VALUES: CarInfoFormValues = {
  carRegistration: "",
  province: "",
  brand: "",
  model: "",
  year: "",
  chassisNumber: "",
};

export default function App() {
  const [phase, setPhase] = useState<Phase>("initializing");
  const [fatalMessage, setFatalMessage] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [insuranceTypeLabel, setInsuranceTypeLabel] = useState<string | null>(null);
  const [values, setValues] = useState<CarInfoFormValues>(EMPTY_VALUES);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("requestId");
    const insuranceType = params.get("insuranceType");

    if (!id) {
      setFatalMessage("ลิงก์ไม่ถูกต้อง กรุณาเปิดจากข้อความที่แชทส่งมา");
      setPhase("fatal-error");
      return;
    }

    setRequestId(id);
    if (isInsuranceType(insuranceType)) {
      setInsuranceTypeLabel(INSURANCE_TYPE_LABEL_TH[insuranceType]);
    }

    initLiff()
      .then(() => setPhase("form"))
      .catch(() => {
        setFatalMessage("กรุณาเปิดฟอร์มนี้จากแอป LINE");
        setPhase("fatal-error");
      });
  }, []);

  function updateValue(field: keyof CarInfoFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!requestId) return;

    setPhase("submitting");
    try {
      const idToken = getIdToken();
      await submitInsuranceRequest(requestId, idToken, values);
      setPhase("success");
    } catch (error) {
      setFormError(error instanceof SubmitRequestError ? error.message : "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setPhase("form");
    }
  }

  if (phase === "initializing") {
    return <CenteredMessage text="กำลังโหลด..." />;
  }

  if (phase === "fatal-error") {
    return <CenteredMessage text={fatalMessage} tone="error" />;
  }

  if (phase === "success") {
    return (
      <div className="page success-page">
        <div className="success-icon">✓</div>
        <h1>ส่งข้อมูลสำเร็จ</h1>
        <p>เจ้าหน้าที่ได้รับข้อมูลรถของคุณแล้ว กำลังตรวจสอบเบี้ยประกันให้ครับ</p>
        <p className="hint">เมื่อได้ราคาแล้ว ทางเราจะแจ้งกลับผ่าน LINE นี้ครับ</p>
        <button type="button" className="primary-button" onClick={closeLiffWindow}>
          ปิดหน้าต่าง
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <img src="/logo.png" alt="YUME Insurance" className="logo" />
        <h1>กรอกข้อมูลรถ</h1>
        {insuranceTypeLabel && <p className="subtitle">{insuranceTypeLabel}</p>}
      </header>

      <form onSubmit={handleSubmit}>
        <CarInfoFields values={values} onChange={updateValue} />

        {formError && <p className="error-banner">{formError}</p>}

        <button type="submit" className="primary-button" disabled={phase === "submitting"}>
          {phase === "submitting" ? "กำลังส่ง..." : "ส่งข้อมูล"}
        </button>
      </form>
    </div>
  );
}

function CenteredMessage({ text, tone }: { text: string; tone?: "error" }) {
  return (
    <div className="page centered">
      <p className={tone === "error" ? "error-banner" : undefined}>{text}</p>
    </div>
  );
}
