import React, { useState } from "react";
import { z } from "zod";

const bpSchema = z.object({
  systolic: z.number({ required_error: "Systolic required" }).min(60, "Systolic must be ≥60").max(250, "Systolic must be ≤250"),
  diastolic: z.number({ required_error: "Diastolic required" }).min(30, "Diastolic must be ≥30").max(140, "Diastolic must be ≤140"),
});

const bloodSugarSchema = z.object({
  value: z.number({ required_error: "Blood sugar required" }).min(40, "Blood sugar must be ≥40").max(600, "Blood sugar must be ≤600"),
  unit: z.string().optional(),
});

const pulseSchema = z.object({
  value: z.number({ required_error: "Pulse required" }).min(20, "Pulse must be ≥20").max(250, "Pulse must be ≤250"),
  unit: z.string().optional(),
});

const weightSchema = z.object({
  value: z.number({ required_error: "Weight required" }).min(10, "Weight must be ≥10").max(300, "Weight must be ≤300"),
  unit: z.string().optional(),
});

const tempSchema = z.object({
  value: z.number({ required_error: "Temperature required" }).min(90, "Temperature must be ≥90").max(110, "Temperature must be ≤110"),
  unit: z.string().optional(),
});

const schemas: Record<string, z.ZodType<any, any, any>> = {
  blood_pressure: bpSchema,
  blood_sugar: bloodSugarSchema,
  pulse: pulseSchema,
  weight: weightSchema,
  temperature: tempSchema,
};

const defaultValues: Record<string, any> = {
  blood_pressure: { systolic: "", diastolic: "" },
  blood_sugar: { value: "", unit: "" },
  pulse: { value: "", unit: "" },
  weight: { value: "", unit: "" },
  temperature: { value: "", unit: "" },
};

const VitalEntryForm = ({ selectedType, onAddVital }) => {
  const [formValues, setFormValues] = useState(defaultValues[selectedType] || {});
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value === "" ? "" : isNaN(value) ? value : Number(value),
    }));
    setError("");
  };

  const validateVital = () => {
    try {
      const schema = schemas[selectedType];
      if (!schema) return true;
      schema.parse(formValues);
      return true;
    } catch (err: any) {
      return err.errors?.[0]?.message || "Invalid input";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateVital();
    if (validationResult !== true) {
      setError(validationResult);
      return;
    }
    setError("");
    await onAddVital(formValues);
    setFormValues(defaultValues[selectedType]);
  };

  // --- UI Render ---

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedType === "blood_pressure" && (
        <>
          <div>
            <label>Systolic (mmHg)</label>
            <input
              type="number"
              name="systolic"
              value={formValues.systolic}
              onChange={handleInputChange}
              className="input"
              min={60}
              max={250}
              required
            />
          </div>
          <div>
            <label>Diastolic (mmHg)</label>
            <input
              type="number"
              name="diastolic"
              value={formValues.diastolic}
              onChange={handleInputChange}
              className="input"
              min={30}
              max={140}
              required
            />
          </div>
        </>
      )}
      {selectedType === "blood_sugar" && (
  <div className="flex flex-col gap-2">
    <label htmlFor="bloodSugarValue">Blood Sugar</label>
    <input
      id="bloodSugarValue"
      type="number"
      name="value"
      value={formValues.value}
      onChange={handleInputChange}
      min={40}
      max={600}
      placeholder="Enter value"
      className="input w-full"
      required
    />
    <select
      name="unit"
      value={formValues.unit || "mg/dL"}
      onChange={handleInputChange}
      className="input w-full"
    >
      <option value="mg/dL">mg/dL</option>
      <option value="mmol/L">mmol/L</option>
    </select>
  </div>
)}

      {selectedType === "pulse" && (
        <>
          <div>
            <label>Pulse (bpm)</label>
            <input
              type="number"
              name="value"
              value={formValues.value}
              onChange={handleInputChange}
              className="input"
              min={20}
              max={250}
              required
            />
          </div>
        </>
      )}
      {selectedType === "weight" && (
        <>
          <div>
            <label>Weight</label>
            <input
              type="number"
              name="value"
              value={formValues.value}
              onChange={handleInputChange}
              className="input"
              min={10}
              max={300}
              required
            />
            <select
              name="unit"
              value={formValues.unit || "kg"}
              onChange={handleInputChange}
              className="input"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </>
      )}
      {selectedType === "temperature" && (
        <>
          <div>
            <label>Temperature</label>
            <input
              type="number"
              name="value"
              value={formValues.value}
              onChange={handleInputChange}
              className="input"
              min={90}
              max={110}
              required
            />
            <select
              name="unit"
              value={formValues.unit || "F"}
              onChange={handleInputChange}
              className="input"
            >
              <option value="F">°F</option>
              <option value="C">°C</option>
            </select>
          </div>
        </>
      )}

      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="bg-ojas-primary text-white py-2 px-5 rounded mt-2"
      >
        Add Vital
      </button>
    </form>
  );
};

export default VitalEntryForm;
