import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseTest: React.FC = () => {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session:', data.session);
    };
    getSession();
  }, []);

  return null; // This component doesn't render anything
};

export default SupabaseTest;
