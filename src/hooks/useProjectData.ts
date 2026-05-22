"use client";

import { useEffect, useRef, useState } from "react";
import { getProjects, getActiveProject } from "../lib/api/project";

export default function useProjectData() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeData, setActiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: active } = await getActiveProject();

        setActiveData(active || null);

        if (active) {
          setProjects([]);
          return;
        }

        const { data: list = [] } = await getProjects();

        setProjects(list);
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
    activeData,
    isLoading,
  };
}