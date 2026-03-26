export default function FormField({ label, name, value, onChange, type = "number", step = "any" }) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <input id={name} name={name} type={type} step={step} value={value} onChange={onChange} required />
    </label>
  );
}
