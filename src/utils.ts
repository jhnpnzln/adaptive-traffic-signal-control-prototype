import type {
  TrafficInput,
  LWRResult,
  ASCResult,
  TimeOfDay,
} from "./types/traffic";

// --- 1. LWR MODEL ---
export const calculateLWR = (input: TrafficInput): LWRResult => {
  // q = count / time (converted to hours)
  const flow = (input.vehicleCount / input.observationTimeMinutes) * 60;

  // k = count / distance
  const density = input.vehicleCount / input.roadLengthKm;

  // v = vf * (1 - k/kj) (Greenshields)
  let speed = input.freeFlowSpeed * (1 - density / input.jamDensity);
  if (speed < 0) speed = 0;

  // Determine Level of Service (LOS) roughly based on Density %
  const densityRatio = density / input.jamDensity;
  let los: LWRResult["levelOfService"] = "A";
  if (densityRatio > 0.85) los = "F";
  else if (densityRatio > 0.7) los = "E";
  else if (densityRatio > 0.5) los = "D";
  else if (densityRatio > 0.3) los = "C";
  else if (densityRatio > 0.1) los = "B";

  return {
    flow,
    density,
    speed,
    levelOfService: los,
  };
};

// --- 2. KALMAN FILTER (Unchanged) ---
export class KalmanFilter {
  private x: number;
  private p: number;
  private q: number;
  private r: number;

  constructor(initialValue: number = 0) {
    this.x = initialValue;
    this.p = 1.0;
    this.q = 0.1;
    this.r = 2.0;
  }

  predict() {
    this.p = this.p + this.q;
  }

  update(measurement: number) {
    const K = this.p / (this.p + this.r);
    this.x = this.x + K * (measurement - this.x);
    this.p = (1 - K) * this.p;
    return this.x;
  }
}

// --- 3. FUZZY LOGIC ASC SYSTEM ---
/**
 * Simplified Fuzzy Logic Controller
 * Inputs: Density (LWR), Predicted Queue (Kalman)
 * Output: Signal Timing (Green, Amber, Cycle)
 */
export const calculateASC = (
  lwr: LWRResult,
  predictedQueue: number
): ASCResult => {
  // Step 1: Fuzzification (Convert numbers to "Linguistic Variables")
  const isDensityHigh = lwr.density > 60;
  const isDensityMed = lwr.density > 30 && lwr.density <= 60;

  const isQueueLong = predictedQueue > 15;
  const isQueueMed = predictedQueue > 5 && predictedQueue <= 15;

  let green = 30; // Default Minimum Green
  let amber = 3; // Default Amber
  let cycle = 60; // Default Cycle
  let priority: ASCResult["priority"] = "Low";
  let explanation = "Traffic is light. Minimal green time required.";

  // Step 2: Rule Evaluation (Inference)

  // RULE 1: High Congestion (High Density OR Long Queue)
  if (isDensityHigh || isQueueLong) {
    green = 60; // Max Green
    cycle = 100;
    priority = "High";
    explanation =
      "Heavy congestion detected. Extending Green time to flush queue.";

    // Safety Adjustment: If speed is dangerously low (stop-and-go), standard amber is fine.
    // But if speed is moderatley high but density is high (risky), extend amber.
    if (lwr.speed > 30) {
      amber = 5; // Give more time to stop safely
      explanation += " Amber extended for safety due to speed.";
    }
  }
  // RULE 2: Moderate Traffic
  else if (isDensityMed || isQueueMed) {
    green = 45;
    cycle = 80;
    priority = "Medium";
    explanation = "Moderate flow. Balanced timing applied.";
  }

  // RULE 3: Emergency / Jammed State (Velocity near 0)
  if (lwr.speed < 5 && lwr.density > 100) {
    priority = "Emergency";
    green = 20; // Short green to prevent gridlock blocking intersections
    cycle = 120; // Very long cycle to allow downstream to clear
    explanation =
      "Gridlock detected! Throttling inflow to allow downstream clearance.";
  }

  return {
    greenTime: green,
    amberTime: amber,
    cycleLength: cycle,
    priority,
    logicExplanation: explanation,
  };
};

export const generateDiagramData = (kj: number, vf: number) => {
  const data = [];
  for (let k = 0; k <= kj; k += 5) {
    const v = vf * (1 - k / kj);
    const q = k * v;
    data.push({ density: k, flow: q, speed: v });
  }
  return data;
};

export const getScenarioMultiplier = (time: TimeOfDay) => {
  switch (time) {
    case "Morning":
      return { demand: 1.2, noise: 0.2 };
    case "Noon":
      return { demand: 0.7, noise: 0.1 };
    case "Afternoon":
      return { demand: 1.3, noise: 0.15 };
    default:
      return { demand: 1.0, noise: 0.1 };
  }
};
