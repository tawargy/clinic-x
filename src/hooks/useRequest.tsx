import { useState, useEffect, useCallback } from "react";
import { getRequsetsApi } from "../api/request";

import { TRequest } from "../types";

export const useRequest = (requestId: string | undefined) => {
  const [requests, setRequests] = useState<TRequest[] | null>(null);
  const [requestsId, setRequestsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!requestId) return;

    setLoading(true);
    try {
      const response = await getRequsetsApi(requestId);
      if (response) {
        setRequestsId(response.id);
        setRequests(response.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    requestsId,
    loading,
    refetch: fetchRequests,
  };
};
