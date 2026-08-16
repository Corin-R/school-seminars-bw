import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getSchools, type School } from "@/api/schools";
import { getCategories } from "@/api/categories";
import { interpolateRainbow } from "d3-scale-chromatic";

type SchoolContextType = {
  categories: Record<string, string>;
  colorForCategories: Record<string, string>;
  selectedCategories: Record<string, boolean>;
  schools: School[];
  loading: boolean;
  error: string | null;
  toggleSelection: (category: string) => void;
  addRemoveAll: (add: boolean) => void;
};
export function colorForIndex(index: number, total: number) {
  return interpolateRainbow(index / total);
};


const SchoolContext = createContext<SchoolContextType | null>(null);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [colorForCategories, setCfC] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addRemoveAll = useCallback((add: boolean) => {
    setLoading(true);
    setSelectedCategories(prev =>
      Object.fromEntries(
        Object.keys(prev).map(category => [category, add])
      )
    );
    setLoading(false);
  }, []);

  const toggleSelection = useCallback((category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !(prev[category] ?? false),
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(false);
    setError(null);
    try {
      var schools = await getSchools();
      var categories = await getCategories();

      const cfc: Record<string, string> = {};
      const selected: Record<string, boolean> = {};
      Object.keys(categories).forEach((element, idx, keys) => {
        if (!element.includes("undefined")) {
          cfc[element] = colorForIndex(idx, keys.length);
        }
        selected[element] = true;
      });


      setSelectedCategories(selected);
      setCfC(cfc);
      setCategories(categories);
      setSchools(schools);

    } catch (error) {
      setError(`${error}`);
    } finally {
      setLoading(false);
    }
  }, [getSchools, getCategories]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SchoolContext.Provider value={{ categories, colorForCategories, selectedCategories, schools, loading, error, toggleSelection, addRemoveAll }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchools() {
  const context = useContext(SchoolContext);

  if (context === null) {
    throw new Error("useSchools must be used within a SchoolProvider");
  }

  return context;
}