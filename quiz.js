// Quiz "Qual é o teu bloqueio com dinheiro?" → resultado → oferta do caderno.
// Cada resposta soma ponto em medo (m), culpa (c) ou merecimento (v).
(function () {
  "use strict";
  var G = window.GALO || {};

  var PERGUNTAS = [
    { t: "Sobrou um dinheirinho no fim do mês. O que tu faz?", o: [
      ["Guardo tudo, vai que falta depois", "m"],
      ["Some rápido, parece que queima na mão", "c"],
      ["Gasto com os outros antes de pensar em mim", "v"],
      ["Sobrar? Nunca sobra", "m"] ] },
    { t: "Alguém te elogia ou te dá um presente. Tu…", o: [
      ["Desconfio: o que será que vai querer em troca?", "m"],
      ["Fico sem graça e digo “imagina, não precisava”", "v"],
      ["Me sinto mal por fazerem gastar comigo", "c"] ] },
    { t: "O que tu mais ouvia sobre dinheiro em casa?", o: [
      ["“Dinheiro é difícil, tem que ralar muito”", "m"],
      ["“Rico é tudo ladrão, dinheiro estraga as pessoas”", "c"],
      ["“Isso não é pra gente como a gente”", "v"] ] },
    { t: "Caíram R$ 10 mil na tua conta amanhã. Primeiro pensamento?", o: [
      ["Guardar tudo, sei lá o que vem por aí", "m"],
      ["Dividir com a família, nem penso em mim", "c"],
      ["Não acreditar: isso não acontece comigo", "v"] ] },
    { t: "Na hora de cobrar, vender ou pedir aumento…", o: [
      ["Travo com medo de perder o cliente ou o emprego", "m"],
      ["Acho feio falar de dinheiro", "c"],
      ["Cobro menos do que vale, ou nem cobro", "v"] ] },
    { t: "Qual frase tem mais a tua cara?", o: [
      ["“E se faltar?”", "m"],
      ["“Querer muito é ganância”", "c"],
      ["“Isso é pra quem tem sorte”", "v"] ] },
  ];

  var PERFIS = {
    m: { nome: "Medo", emoji: "😰", galo: "Meu filho, tu vive no modo sobrevivência!",
      explica: "Tu segura tudo com medo de faltar e nunca arrisca. O problema: quem só se protege não abre espaço pra nada novo chegar. Dinheiro precisa circular, e a tua cabeça precisa aprender que tá tudo bem ter.",
      dias: "Dias 5, 13 e 17 do caderno: o medo de ter mais, o passo pequeno e olhar a conta sem drama." },
    c: { nome: "Culpa", emoji: "😔", galo: "Tu acha feio querer dinheiro, né? Decide, meu filho!",
      explica: "Lá no fundo tu aprendeu que dinheiro é sujo ou que ter mais é errado. Aí, sem perceber, tu empurra ele pra longe: gasta rápido, dá tudo, sabota. Querer uma vida boa não é ganância.",
      dias: "Dias 1, 4 e 19 do caderno: as frases da tua casa, a inveja que vira pedido e falar de dinheiro sem vergonha." },
    v: { nome: "Merecimento", emoji: "🙈", galo: "Tu acha que vale pouco, e cobra pouco!",
      explica: "Tu dá desconto sem ninguém pedir, fica sem graça com elogio e acha que coisa boa é pros outros. O universo te dá o tamanho que tu acha que merece. Bora aumentar esse tamanho.",
      dias: "Dias 6, 15 e 16 do caderno: quanto tu te cobra, o que já chegou e aceitar sem diminuir." },
  };

  var $ = function (id) { return document.getElementById(id); };
  var passo = 0, pontos = { m: 0, c: 0, v: 0 };

  function conta(evento) {
    if (!G.metricas) return;
    try { navigator.sendBeacon(G.metricas + "/e", new Blob([JSON.stringify({ e: evento, o: new URLSearchParams(location.search).get("o") || "direto" })], { type: "text/plain" })); } catch (e) { /* sem métrica */ }
  }

  function mostra(id) {
    ["inicio", "quiz", "resultado"].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function pergunta() {
    var p = PERGUNTAS[passo];
    $("q-num").textContent = "Pergunta " + (passo + 1) + " de " + PERGUNTAS.length;
    $("q-barra").style.width = (passo / PERGUNTAS.length * 100) + "%";
    $("q-texto").textContent = p.t;
    $("q-opcoes").innerHTML = "";
    p.o.forEach(function (op) {
      var b = document.createElement("button");
      b.className = "op"; b.type = "button"; b.textContent = op[0];
      b.onclick = function () { pontos[op[1]]++; passo++; passo < PERGUNTAS.length ? pergunta() : resultado(); };
      $("q-opcoes").appendChild(b);
    });
  }

  function resultado() {
    // Empate: medo > culpa > merecimento (a ordem das chaves decide).
    var chave = Object.keys(pontos).reduce(function (a, b) { return pontos[b] > pontos[a] ? b : a; });
    var p = PERFIS[chave];
    $("r-emoji").textContent = p.emoji;
    $("r-nome").textContent = p.nome;
    $("r-galo").textContent = "“" + p.galo + "”";
    $("r-explica").textContent = p.explica;
    $("r-dias").textContent = p.dias;
    $("r-preco").textContent = G.preco || "17";
    mostra("resultado");
    conta("quiz_fim");
  }

  $("comecar").onclick = function () { passo = 0; pontos = { m: 0, c: 0, v: 0 }; pergunta(); mostra("quiz"); conta("quiz_inicio"); };
  $("refazer").onclick = function () { mostra("inicio"); };
  $("comprar").onclick = function () {
    conta("clique_compra");
    if (G.checkout) location.href = G.checkout;
    else alert("O caderno abre em breve! Segue o Galo pra ver primeiro.");
  };
  conta("visita");
})();
