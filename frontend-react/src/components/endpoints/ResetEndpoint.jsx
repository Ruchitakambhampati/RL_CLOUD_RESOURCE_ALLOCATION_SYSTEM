import { useState } from "react";
import EndpointCard from "../common/EndpointCard";
import PrimaryButton from "../common/PrimaryButton";

export default function ResetEndpoint({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const run = async () => {
    setLoading(true);
    setError("");
    setDone(false);

    try {
      await onSubmit();
      setDone(true);
    } catch (err) {
      setError(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard
      title="Fresh Start"
      description="Clear learned values when you want to begin training from a clean slate."
    >
      <PrimaryButton type="button" onClick={run} disabled={loading}>
        {loading ? "Resetting..." : "Reset Learning State"}
      </PrimaryButton>

      {loading ? <div className="response loading">Cleaning existing policy memory...</div> : null}
      {error ? <div className="response error">{error}</div> : null}
      {!loading && !error && !done ? (
        <div className="response idle">No reset yet. Use this only when you need to restart learning.</div>
      ) : null}
      {!loading && !error && done ? (
        <div className="insight-card">
          <div className="status-pill warn">State Reset Complete</div>
          <p className="status-copy">The learning table has been cleared and is ready for new training runs.</p>
        </div>
      ) : null}
    </EndpointCard>
  );
}
