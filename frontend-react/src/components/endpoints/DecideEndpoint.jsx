import { useMemo, useState } from "react";
import EndpointCard from "../common/EndpointCard";
import FormField from "../common/FormField";
import PrimaryButton from "../common/PrimaryButton";

const initialState = {
  cpu: 50,
  memory: 40,
  instances: 2,
  request_rate: 100
};

function actionCopy(action) {
  if (action === "scale_up") return { label: "Scale Up", cue: "Traffic pressure is rising. Add capacity." };
  if (action === "scale_down") return { label: "Scale Down", cue: "Load is light. Reduce capacity safely." };
  return { label: "Hold Steady", cue: "Current setup is balanced. Keep it unchanged." };
}

export default function DecideEndpoint({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const ui = useMemo(() => actionCopy(result?.action), [result]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await onSubmit(form);
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not compute a decision.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard
      title="Capacity Decision"
      description="Provide current load signals to get the next scaling recommendation."
    >
      <form className="stack" onSubmit={submit}>
        <div className="fields-grid">
          <FormField label="CPU (%)" name="cpu" value={form.cpu} onChange={onChange} />
          <FormField label="Memory (%)" name="memory" value={form.memory} onChange={onChange} />
          <FormField label="Running Instances" name="instances" value={form.instances} onChange={onChange} step="1" />
          <FormField label="Incoming Requests" name="request_rate" value={form.request_rate} onChange={onChange} />
        </div>
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Analyzing Load..." : "Get Recommendation"}
        </PrimaryButton>
      </form>

      {loading ? <div className="response loading">Reviewing system behavior...</div> : null}
      {error ? <div className="response error">{error}</div> : null}
      {!loading && !error && !result ? (
        <div className="response idle">Your recommendation and scaling sketch will appear here.</div>
      ) : null}

      {!loading && !error && result ? (
        <div className="insight-card" aria-live="polite">
          <div className="insight-head">
            <p className="insight-kicker">Recommended Action</p>
            <h4>{ui.label}</h4>
            <p>{ui.cue}</p>
          </div>

          <div className={`scale-diagram ${result.action || "no_change"}`}>
            <span className="node" />
            <span className="arrow">{result.action === "scale_up" ? "▲" : result.action === "scale_down" ? "▼" : "●"}</span>
            <span className="node highlighted" />
          </div>
        </div>
      ) : null}
    </EndpointCard>
  );
}
