// Script do <head> das datas especiais (inline, antes da pintura), gerado no build a partir das funções de
// datas-especiais.mjs e minificado: o que os testes cobrem é o que roda no navegador. Fica num arquivo à parte para o
// esbuild não ir parar no JavaScript do navegador. Vai logo depois do <link rel="icon">, para poder trocar o favicon.
import { transformSync } from 'esbuild';
import { aplicar, hojeBrasilia, naJanela, OPCOES, resolver, validar } from './datas-especiais.mjs';

const fonte = `(function(){${validar}${hojeBrasilia}${naJanela}${resolver}${aplicar}try{aplicar(${JSON.stringify(OPCOES)},Date.now())}catch(e){}})()`;

export const datasScript = transformSync(fonte, { minify: true, target: 'es2017' }).code.trim();
