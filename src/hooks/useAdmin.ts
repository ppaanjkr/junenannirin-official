"use client";

import {
  getAdminBanks,
  getAdminProjectDetail,
  getAdminProjectOrders,
  getAdminProjects,
  getAdminTransactions,
  getAdminUsers,
} from "@/lib/api/admin";
import { AdminOrderList, AdminProjectDetail, Bank, User } from "@/lib/api/types";
import { useEffect, useRef, useState } from "react";

export default function useProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isProjectLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: list = [] } = await getAdminProjects();
        const openProjects = list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setProjects(openProjects);
      } catch (err) {
        console.error("fetch project error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    projects,
    isProjectLoading,
  };
}

export function useProjectDetail(project_id: string) {
  const [project, setProject] = useState<AdminProjectDetail>();

  const [isDetailLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!project_id) return;

    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data } = await getAdminProjectDetail(project_id);

        setProject(data ?? undefined);
      } catch (err) {
        console.error("fetch project error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [project_id]);

  return {
    project,
    isDetailLoading,
  };
}

export function useOrderList(project_id: string) {
  const [orders, setOrders] = useState<AdminOrderList[]>();

  const [isOrderLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!project_id) return;

    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data } = await getAdminProjectOrders(project_id);

        setOrders(data ?? undefined);
      } catch (err) {
        console.error("fetch project error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [project_id]);

  return {
    orders,
    isOrderLoading,
  };
}

export function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: list = [] } = await getAdminUsers();

        setUsers(list || []);
      } catch (err) {
        console.error("fetch project error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    users,
    isUserLoading,
  };
}

export function useBankList() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isBankLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: list = [] } = await getAdminBanks();

        setBanks(list || []);
      } catch (err) {
        console.error("fetch project error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    banks,
    isBankLoading,
  };
}

export function useTransactionList(
  projectId: string,
) {
  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [isLoading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!projectId) return;

    load();
  }, [projectId]);

  async function load() {
    try {
      setLoading(true);

      const res =
        await getAdminTransactions(
          projectId,
        );

      if (res.success) {
        setTransactions(
          res.data || [],
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    transactions,
    isLoading,
  };
}

