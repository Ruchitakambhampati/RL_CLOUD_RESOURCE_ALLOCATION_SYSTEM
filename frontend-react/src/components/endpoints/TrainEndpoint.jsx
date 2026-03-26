import { useState } from "react";
import EndpointCard from "../common/EndpointCard";
import FormField from "../common/FormField";
import PrimaryButton from "../common/PrimaryButton";

export default function TrainEndpoint({ onSubmit, defaultEpisodes = 300 }) {
  const [episodes, setEpisodes] = useState(defaultEpisodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setDone(false);

    try {
      await onSubmit(Number(episodes));
      setDone(true);
    } catch (err) {
      setError(err.message || "Training did not complete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard
      title="Learning Sprint"
      description="Run focused training cycles to improve future scaling decisions."
    >
      <form className="stack" onSubmit={submit}>
        <FormField
          label="Training Cycles"
          name="episodes"
          value={episodes}
          onChange={(event) => setEpisodes(event.target.value)}
          step="1"
        />
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Training in Progress..." : "Start Training"}
        </PrimaryButton>
      </form>

      {loading ? <div className="response loading">Learning from simulated traffic patterns...</div> : null}
      {error ? <div className="response error">{error}</div> : null}
      {!loading && !error && !done ? (
        <div className="response idle">No training run yet. Launch a cycle to strengthen policy quality.</div>
      ) : null}
      {!loading && !error && done ? (
        <div className="insight-card">
          <div className="status-pill good">Training Complete</div>
          <p className="status-copy">
            Model updates have been applied using <strong>{episodes}</strong> cycles.
          </p>
        </div>
      ) : null}
    </EndpointCard>
  );
}
