import { useState, useCallback } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const useGetData = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const action = useCallback(
    async (path, param = null) => {
      try {
        setLoading(true);
        setError(null);

        const url = param ? `${path}/${param}` : path;

        const currentUser = auth.currentUser;
        let token = currentUser ? await currentUser.getIdToken() : null;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if(response.status !== 200)
        {
          navigate(
            !token
            ? '/auth'
            : "/error", { state: { code: response.status, message: data.message || "Algo salió mal" } }
          );
        }

        setResponseData(data);
      } catch (err) {
        console.error(err);
        navigate("/error", { state: { code: 500, message: err.message } });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { responseData, loading, error, action };
};
