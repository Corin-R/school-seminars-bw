import { useEffect, useState } from "react";
import { getHealth } from "../api/health";

export function HealthStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.status))
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <p>Backend error: {error}</p>;
  }

  if (status === null) {
    return <p>Checking backend...</p>;
  }

  return <p>Backend: {status}</p>;
}