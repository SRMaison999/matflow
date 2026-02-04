// =====================================================
// MatFlow Desktop - App Component
// =====================================================

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
  const [version, setVersion] = useState('');
  const [systemInfo, setSystemInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    invoke<string>('get_app_version').then(setVersion);
    invoke<Record<string, string>>('get_system_info').then(setSystemInfo);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-3xl font-bold text-primary-foreground">
            M
          </div>
          <h1 className="text-4xl font-bold">MatFlow Desktop</h1>
          <p className="text-muted-foreground">
            Application de gestion de stock circulant pour l'événementiel
          </p>

          <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Informations système</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-mono">{version || '...'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">OS</dt>
                <dd className="font-mono">{systemInfo.os || '...'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Architecture</dt>
                <dd className="font-mono">{systemInfo.arch || '...'}</dd>
              </div>
            </dl>
          </div>

          <p className="text-sm text-muted-foreground">
            Cette application partage le code avec la version web
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
