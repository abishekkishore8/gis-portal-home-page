"use client";

import { useEffect, useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type StatusState = {
  loading: boolean;
  message: string;
  count: number | null;
};

export function SupabaseStatus() {
  const [state, setState] = useState<StatusState>({
    loading: true,
    message: 'Checking Supabase connection...',
    count: null,
  });

  useEffect(() => {
    let active = true;

    const loadVillageStatus = async () => {
      const { count, error } = await supabase
        .from('villages')
        .select('*', { count: 'exact', head: true });

      if (!active) {
        return;
      }

      if (error) {
        setState({
          loading: false,
          message: error.message,
          count: null,
        });
        return;
      }

      setState({
        loading: false,
        message: 'Supabase connected successfully.',
        count: count ?? 0,
      });
    };

    loadVillageStatus();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          {state.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5" />}
        </div>
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-blue-900">Supabase status</p>
          <p className="text-[13px] text-gray-600">{state.message}</p>
          {state.count !== null ? (
            <p className="text-[12px] text-gray-500">Visible rows in `villages`: {state.count}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}