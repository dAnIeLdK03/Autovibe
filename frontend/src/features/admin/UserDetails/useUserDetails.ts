import { useCallback, useEffect, useState } from "react";
import {
  getAdminUserById,
  getAdminUserCars,
  UserRole,
  type AdminUserDto,
} from "../../../api/adminService";
import axios from "axios";
import { extractApiErrorMessage } from "../../../shared/extractErrorMessage/extractApiErrorMessage";
import { useParams } from "react-router-dom";
import type { Car } from "@autovibe/app-state";

export const useUserDetails = () => {
  const { userId: userIdParam } = useParams<{ userId: string }>();

  const userId =
    userIdParam && /^\d+$/.test(userIdParam) ? Number(userIdParam) : NaN;
  const invalidId = !Number.isInteger(userId) || userId < 1;

  const [user, setUser] = useState<AdminUserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (invalidId) {
      setUser(null);
      setError(null);
      setForbidden(false);
      setNotFound(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setForbidden(false);
    setNotFound(false);

    try {
      const data = await getAdminUserById(userId);
      setUser(data);
    } catch (e: unknown) {
      setUser(null);
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 403) {
          setForbidden(true);
        } else if (status === 404) {
          setNotFound(true);
        } else {
          setError(extractApiErrorMessage(e));
        }
      } else {
        setError(extractApiErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  }, [userId, invalidId]);

  const fetchCars = useCallback(async () => {
    if (invalidId) {
      setCars([]);
      setCarsError(null);
      setCarsLoading(false);
      return;
    }

    setCarsLoading(true);
    setCarsError(null);
    try {
      const res = await getAdminUserCars(userId, 1, 18);
      setCars((res.items ?? []) as Car[]);
    } catch (e: unknown) {
      setCarsError(extractApiErrorMessage(e));
      setCars([]);
    } finally {
      setCarsLoading(false);
    }
  }, [userId, invalidId]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    void fetchCars();
  }, [fetchCars]);

  const roleLabel = (r: UserRole) => (r === UserRole.Admin ? "Admin" : "User");

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
  };

  return {
    user,
    loading,
    error,
    forbidden,
    notFound,
    invalidId,
    roleLabel,
    formatDate,
    refetch: fetchUser,
    cars,
    carsLoading,
    carsError,
  };
};
