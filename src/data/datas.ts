import type { Lang } from '../i18n/ui';

/**
 * Visual das datas especiais neste site: texto da faixa, enfeites do hero, bolinha da Paçoca e ícone do Pawta no card.
 * Quem decide se a data está ativa é src/lib/datas-especiais.mjs (Remote Config `datas_especiais` + datas).
 * Um tema novo entra aqui, em TEMAS (datas-especiais.mjs) e nas regras de "Datas especiais" do global.css.
 *
 * Os arquivos ficam em public/datas/<tema>/. O favicon e a bolinha são deste site (`*-toski.svg`). Os do Halloween
 * (fantasminha e ícone do Pawta) foram recortados do canvas aqui; os do Natal (bengalinha e ícone do Pawta) vêm do S.18,
 * no pethealth-web, e a guirlanda em arco usa as peças da guirlanda do S.18.
 * Nada daqui é baixado fora da data: as imagens entram como fundo só quando o <html> tem o data-tema certo.
 */
export type Tema = 'halloween' | 'natal';

/**
 * Lugar na caixa quadrada da Paçoca (MascotHero), em % do lado da caixa: nunca na coluna do texto,
 * nunca para cima ou para baixo da caixa (no celular o texto fica logo abaixo).
 */
export interface Lugar {
  top: number;
  left: number;
  width: number;
}

export interface Enfeite {
  /** Arquivo em public/datas/<tema>/ (vazio = ainda não chegou, o enfeite não aparece). */
  claro: string;
  /** Versão para o tema escuro, se houver. */
  escuro?: string;
  /** Do md em diante (lado a lado com o texto): pode sair só um pouco para os lados (cai no espaço entre as colunas). */
  computador: Lugar;
  /** Abaixo do md (Paçoca centralizada em cima do texto): menor em px, nos lados do círculo, que estão vazios. */
  celular: Lugar;
  /** Proporção altura/largura do desenho. */
  ratio: number;
  /** Atraso da animação (s, negativo = já começa no meio), para os enfeites não se moverem juntos. */
  delay?: number;
  opacity?: number;
  /** Movimento: flutuar (szFloat, fantasminhas) ou balançar a partir do topo (szSway, Natal). Padrão: flutuar. */
  anim?: 'flutua' | 'balanca';
  /** Giro fixo (graus) e espelhamento, que não brigam com a animação (ex.: bengalinhas cruzadas). */
  rotate?: number;
  flip?: boolean;
  /** Ponto em volta do qual balança (transform-origin). Padrão: o topo do desenho. */
  origem?: string;
}

export interface DataEspecial {
  /** Faixa do topo: fala do laboratório (o Pawta aparece pelo ícone da data no card dele). */
  faixa: Record<Lang, { label: string; text: string; close: string }>;
  enfeites: Enfeite[];
  /** Ícone do Pawta da data, onde o ícone do Pawta aparece (Home, /projetos, /suporte). Vazio = fica o de sempre. */
  iconePawta: { claro: string; escuro?: string };
}

export const datas: Record<Tema, DataEspecial> = {
  halloween: {
    faixa: {
      pt: { label: 'Halloween', text: 'Feliz Halloween da Toski Labs! O laboratório está fantasiado até 31/10.', close: 'Fechar' },
      en: { label: 'Halloween', text: 'Happy Halloween from Toski Labs! The lab is in costume until Oct 31.', close: 'Close' },
    },
    // Fantasminhas do quadro SzSiteHalloween do canvas (desenho, cores e "flutuar devagar"): um grande, um médio e um
    // pequeno, mais transparentes conforme diminuem. No computador, nos cantos vazios em volta do círculo; no celular,
    // nos lados.
    enfeites: [
      { claro: 'fantasminha.svg', computador: { top: 3, left: -3, width: 13 }, celular: { top: 6, left: -26, width: 20 }, ratio: 1.15 },
      { claro: 'fantasminha.svg', computador: { top: 40, left: 92, width: 9 }, celular: { top: 36, left: 108, width: 15 }, ratio: 1.15, delay: -1.1, opacity: 0.9 },
      { claro: 'fantasminha.svg', computador: { top: 84, left: 9, width: 7 }, celular: { top: 74, left: -18, width: 12 }, ratio: 1.15, delay: -2.2, opacity: 0.8 },
    ],
    // Ícone de Halloween do quadro SzIcones (o mesmo do cabeçalho do SzSiteHalloween), igual no claro e no escuro.
    iconePawta: { claro: 'icone-pawta.svg' },
  },
  natal: {
    faixa: {
      pt: { label: 'Natal', text: 'Boas festas da Toski Labs! O laboratório já entrou no clima de Natal.', close: 'Fechar' },
      en: { label: 'Christmas', text: 'Happy holidays from Toski Labs! The lab is all set for Christmas.', close: 'Close' },
    },
    // Do S.18 (public/datas/natal/ do pethealth-web). Duas bengalinhas cruzadas em X em cima do círculo, acima da
    // cabeça da Paçoca (o mesmo arquivo, uma espelhada, ganchos para fora). A guirlanda do S.18 é uma faixa reta para a
    // tela toda; aqui as mesmas peças (folhas, bolinhas, bengalinhas e estrelas) vão em arco, abraçando a parte de baixo
    // do círculo, abaixo da bolinha (guirlanda-toski.svg, viewBox = faixa de baixo da caixa). Balançam devagar como a
    // guirlanda do quadro SzSiteNatal (szSway); a guirlanda gira em volta do centro do círculo.
    enfeites: [
      // O cabo fica a 1/4 da largura do desenho (e a 3/4 na espelhada): a espelhada vai meia largura para a esquerda
      // para os cabos se cruzarem no meio.
      { claro: 'bengalinha.svg', computador: { top: 2, left: 48.25, width: 7 }, celular: { top: 1, left: 47.5, width: 10 }, ratio: 2, anim: 'balanca', rotate: 24 },
      { claro: 'bengalinha.svg', computador: { top: 2, left: 44.75, width: 7 }, celular: { top: 1, left: 42.5, width: 10 }, ratio: 2, anim: 'balanca', rotate: -24, flip: true, delay: -2 },
      { claro: 'guirlanda-toski.svg', computador: { top: 60, left: 0, width: 100 }, celular: { top: 60, left: 0, width: 100 }, ratio: 0.4, anim: 'balanca', origem: '50% -25%', delay: -1 },
    ],
    // Ícone de Natal do Pawta do S.18 (icone.svg no pethealth-web), igual no claro e no escuro.
    iconePawta: { claro: 'icone-pawta.svg' },
  },
};

export const temas = Object.keys(datas) as Tema[];

/** URL de um arquivo do tema, para as variáveis CSS dos fundos. */
export const arquivoDe = (tema: Tema, nome: string) => `url(/datas/${tema}/${nome})`;
