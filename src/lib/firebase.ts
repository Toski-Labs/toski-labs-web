/**
 * Configuração do app Web "site" no projeto Firebase toski-labs.
 * Esses valores são públicos por natureza (vão no código que roda no navegador);
 * o site só usa o Remote Config, para ligar e desligar campanhas e datas especiais.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyAJ56k8X86ztVlg5IM1BHNkfpqpXZyuAug',
  authDomain: 'toski-labs.firebaseapp.com',
  projectId: 'toski-labs',
  storageBucket: 'toski-labs.firebasestorage.app',
  messagingSenderId: '412467402980',
  appId: '1:412467402980:web:ca1d94bceb1a1aec95b4f1',
};

/** Parâmetro do Remote Config com as chaves de campanha, por projeto. */
export const CAMPAIGNS_PARAM = 'campanhas';

/** Parâmetro do Remote Config com as datas especiais (o mesmo do site do Pawta). Formato em src/lib/datas-especiais.mjs. */
export const DATES_PARAM = 'datas_especiais';
