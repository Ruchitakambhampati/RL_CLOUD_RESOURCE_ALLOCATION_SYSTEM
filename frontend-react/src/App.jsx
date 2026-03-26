import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import EndpointSection from "./components/layout/EndpointSection";
import DecideEndpoint from "./components/endpoints/DecideEndpoint";
import TrainEndpoint from "./components/endpoints/TrainEndpoint";
import ResetEndpoint from "./components/endpoints/ResetEndpoint";
import { api } from "./services/apiClient";

export default function App() {
  return (
    <div className="app-shell">
      <div className="backdrop" aria-hidden="true" />
      <main className="content-wrap">
        <Navbar />
        <Hero />

        <EndpointSection
          id="decide"
          title="Decide"
          subtitle="Understand the next best scaling move from current traffic signals."
        >
          <DecideEndpoint onSubmit={api.nodeDecide} />
        </EndpointSection>

        <EndpointSection
          id="train"
          title="Train"
          subtitle="Run learning cycles to improve decision quality over time."
        >
          <TrainEndpoint onSubmit={api.nodeTrain} />
        </EndpointSection>

        <EndpointSection
          id="reset"
          title="Reset"
          subtitle="Restart policy memory cleanly whenever you need a fresh baseline."
        >
          <ResetEndpoint onSubmit={api.pyReset} />
        </EndpointSection>
      </main>
    </div>
  );
}
