import { CAMPAIGNS_PARAM, DATES_PARAM, firebaseConfig } from './firebase';

/**
 * Busca o Remote Config uma vez por página e divide a resposta entre quem pedir (campanhas e datas especiais).
 * O Firebase só é baixado na primeira chamada, e só chama quem precisa (dentro de uma janela de campanha ou de data).
 * Parâmetro ausente volta como texto vazio. Falha ou demora (4 s) rejeita a promessa.
 */
let pending: Promise<Record<string, string>> | null = null;

export function fetchRemoteConfig(): Promise<Record<string, string>> {
  pending ??= (async () => {
    const [{ initializeApp }, rc] = await Promise.all([import('firebase/app'), import('firebase/remote-config')]);
    const remoteConfig = rc.getRemoteConfig(initializeApp(firebaseConfig));
    remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV ? 0 : 5 * 60 * 1000;
    remoteConfig.settings.fetchTimeoutMillis = 4000;
    remoteConfig.defaultConfig = { [CAMPAIGNS_PARAM]: '', [DATES_PARAM]: '' };
    await rc.fetchAndActivate(remoteConfig);
    return {
      [CAMPAIGNS_PARAM]: rc.getValue(remoteConfig, CAMPAIGNS_PARAM).asString(),
      [DATES_PARAM]: rc.getValue(remoteConfig, DATES_PARAM).asString(),
    };
  })();
  return pending;
}
