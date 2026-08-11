import { createContext, useContext, useEffect, useState } from "react";
import { getAllStatuses, markStatusSeen, createStatus } from "../api.js";

const StatusContext = createContext(null);

export function StatusProvider({ children }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllStatuses()
      .then(setStatuses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const seeStatus = async (statusId, userId) => {
    const { status } = await markStatusSeen(statusId, userId);
    setStatuses((prev) => prev.map((s) => (s._id === statusId ? status : s)));
  };
  const addStatus = async (caption, ownerId, image) => {
  const { status } = await createStatus(caption, ownerId, image);
  setStatuses((prev) => [status, ...prev]);
};

  return (
    <StatusContext.Provider value={{ statuses, loading, error, seeStatus, addStatus }}>
      {children}
    </StatusContext.Provider>
  );
}

export const useStatuses = () => useContext(StatusContext);