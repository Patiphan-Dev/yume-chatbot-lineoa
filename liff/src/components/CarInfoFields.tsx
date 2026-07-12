import { CarInfoFormValues } from "../lib/submitRequest";
import { THAI_PROVINCES } from "../lib/provinces";

const CURRENT_YEAR = new Date().getFullYear();

interface CarInfoFieldsProps {
  values: CarInfoFormValues;
  onChange: (field: keyof CarInfoFormValues, value: string) => void;
}

export function CarInfoFields({ values, onChange }: CarInfoFieldsProps) {
  return (
    <div className="field-group">
      <label className="field">
        <span>ทะเบียนรถ</span>
        <input
          type="text"
          value={values.carRegistration}
          onChange={(event) => onChange("carRegistration", event.target.value)}
          placeholder="กก 1234"
          required
        />
      </label>

      <label className="field">
        <span>จังหวัดทะเบียน</span>
        <select value={values.province} onChange={(event) => onChange("province", event.target.value)} required>
          <option value="" disabled>
            เลือกจังหวัด
          </option>
          {THAI_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>ยี่ห้อรถ</span>
        <input
          type="text"
          value={values.brand}
          onChange={(event) => onChange("brand", event.target.value)}
          placeholder="TOYOTA"
          required
        />
      </label>

      <label className="field">
        <span>รุ่นรถ</span>
        <input
          type="text"
          value={values.model}
          onChange={(event) => onChange("model", event.target.value)}
          placeholder="Camry"
          required
        />
      </label>

      <label className="field">
        <span>ปีรถ (กรอกได้ทั้ง ค.ศ. และ พ.ศ.)</span>
        <input
          type="number"
          inputMode="numeric"
          min={1990}
          max={CURRENT_YEAR + 1 + 543}
          value={values.year}
          onChange={(event) => onChange("year", event.target.value)}
          placeholder={`${CURRENT_YEAR} หรือ ${CURRENT_YEAR + 543}`}
          required
        />
      </label>

      <label className="field">
        <span>เลขตัวถัง</span>
        <input
          type="text"
          value={values.chassisNumber}
          onChange={(event) => onChange("chassisNumber", event.target.value)}
          placeholder="MRO53XXXXXXXXXXX"
          required
        />
      </label>
    </div>
  );
}
