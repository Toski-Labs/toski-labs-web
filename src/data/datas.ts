import type { Lang } from '../i18n/ui';

/**
 * Visual das datas especiais neste site: texto da faixa, enfeites do hero, bolinha da Paçoca e ícone do Pawta no card.
 * Quem decide se a data está ativa é src/lib/datas-especiais.mjs (Remote Config `datas_especiais` + datas).
 * Um tema novo entra aqui, em TEMAS (datas-especiais.mjs) e nas regras de "Datas especiais" do global.css.
 *
 * Os arquivos ficam em public/datas/<tema>/. Os enfeites e o ícone do Pawta vêm do site do Pawta (S.18, mesmo caminho
 * no pethealth-web); o favicon e a bolinha são deste site (`*-toski.svg`).
 * Nada daqui é baixado fora da data: as imagens entram como fundo só quando o <html> tem o data-tema certo.
 */
export type Tema = 'halloween' | 'natal';

export interface Enfeite {
  /** Arquivo em public/datas/<tema>/ (vazio = ainda não chegou do S.18, o enfeite não aparece). */
  claro: string;
  /** Versão para o tema escuro, se houver. */
  escuro?: string;
  /**
   * Posição na caixa quadrada da Paçoca (MascotHero), em %: nunca na coluna do texto.
   * Pode sair até 8% para os lados (no celular os lados estão vazios; no computador, cai no espaço entre as colunas),
   * mas nunca para cima ou para baixo (no celular o texto fica logo abaixo).
   */
  top: number;
  left: number;
  width: number;
  /** Proporção altura/largura do desenho. */
  ratio: number;
  /** Atraso da animação (s), para os enfeites não flutuarem juntos. */
  delay?: number;
}

export interface DataEspecial {
  /** Faixa do topo: fala do laboratório (o Pawta aparece pelo ícone da data no card dele). */
  faixa: Record<Lang, { label: string; text: string; close: string }>;
  enfeites: Enfeite[];
  /** Ícone do Pawta da data, no card da Home (do S.18). Vazio = fica o ícone de sempre. */
  iconePawta: { claro: string; escuro?: string };
}

export const datas: Record<Tema, DataEspecial> = {
  halloween: {
    faixa: {
      pt: { label: 'Halloween', text: 'Feliz Halloween da Toski Labs! O laboratório está fantasiado até 31/10.', close: 'Fechar' },
      en: { label: 'Halloween', text: 'Happy Halloween from Toski Labs! The lab is in costume until Oct 31.', close: 'Close' },
    },
    // Fantasminhas fora do círculo, em cantos opostos.
    // TODO(S.18): preencher `claro` (e `escuro`) com os SVGs de public/datas/halloween/ do pethealth-web.
    enfeites: [
      { claro: '', top: 2, left: -6, width: 22, ratio: 1.15 },
      { claro: '', top: 34, left: 88, width: 18, ratio: 1.15, delay: 1.2 },
      { claro: '', top: 76, left: 4, width: 15, ratio: 1.15, delay: 2.1 },
    ],
    iconePawta: { claro: '' },
  },
  natal: {
    faixa: {
      pt: { label: 'Natal', text: 'Boas festas da Toski Labs! O laboratório já entrou no clima de Natal.', close: 'Fechar' },
      en: { label: 'Christmas', text: 'Happy holidays from Toski Labs! The lab is all set for Christmas.', close: 'Close' },
    },
    // Bengalinhas cruzadas no alto, à esquerda, e a guirlanda abraçando o círculo embaixo, à direita
    // (fora do caminho da bolinha, que fica embaixo à esquerda).
    // TODO(S.18): preencher `claro` (e `escuro`) com os SVGs de public/datas/natal/ do pethealth-web.
    enfeites: [
      { claro: '', top: 1, left: -4, width: 24, ratio: 1 },
      { claro: '', top: 66, left: 64, width: 34, ratio: 1, delay: 1.5 },
    ],
    iconePawta: { claro: '' },
  },
};

export const temas = Object.keys(datas) as Tema[];

/** URL de um arquivo do tema, para as variáveis CSS dos fundos. */
export const arquivoDe = (tema: Tema, nome: string) => `url(/datas/${tema}/${nome})`;
