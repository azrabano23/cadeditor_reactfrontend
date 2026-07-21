import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';

interface AuthProps {
  onAuthSuccess?: () => void;
}

const AuthComponent: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full mx-4">
        <div className="bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent mb-2">Welcome to Holodraft</h1>
            <p className="text-gray-400">Sign in to access your CAD-to-AR workspace</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#22c55e',
                    brandAccent: '#16a34a',
                  },
                },
              },
              className: {
                anchor: 'text-accent hover:text-accent/80',
                button: 'bg-accent text-black font-semibold rounded-lg hover:bg-accent/90',
                input: 'bg-zinc-800 border-zinc-700 text-white rounded-lg focus:border-accent',
                label: 'text-gray-300',
                loader: 'border-accent',
                message: 'text-red-400',
              },
            }}
            providers={['google', 'github']}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthComponent; 