import { useState, useEffect } from "react";
import { getRequsetsApi } from "../api/request";

import { TRequest } from "../types";

export function useRequest(requestId: string) {
  const [requests, setRequests] = useState<TRequest[]>([]);

  const getRequests = async (id: string) => {
    try {
      if (!id) return;
      const res = await getRequsetsApi(id);
      res && setRequests(res.requests);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    getRequests(requestId);
  }, [requestId]);

  return {
    requests,
  };
}
