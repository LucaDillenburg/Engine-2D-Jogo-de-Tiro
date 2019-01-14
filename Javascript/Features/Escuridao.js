const minEscuroAtualRaio = 50; //de 255
const denominadorChanceRaio = 12;

// EXPLICACAO DE NOMENCLATURA
  // Bloco: todas os qtdRepeticoes de escurecer-clarear
  // EscClar: uma repeticao de escurecer-clarear
class InfoEscuridao
{
  constructor(tempoEscurecendo, desvioTempoEscurec, tempoEscuroTotal, desvioEscuroTotal, intervaloEntreEscClarMsmBloco=0, intervalo, desvioIntervalo, qtdRepeticoes, desvioQtdRep, infosImgsRaios)
  // infosImgsRaios nao pode ser undefined e cada posicao (se houver) precisa ter {img, ponto{x,y}}
  {
    this.tempoEscurecendo = tempoEscurecendo;
    this.desvioTempoEscurec = desvioTempoEscurec;
    this.tempoEscuroTotal = tempoEscuroTotal;
    this.desvioEscuroTotal = desvioEscuroTotal;
    this.intervaloEntreEscClarMsmBloco = intervaloEntreEscClarMsmBloco;
    this.intervalo = intervalo;
    this.desvioIntervalo = desvioIntervalo;
    this.qtdRepeticoes = qtdRepeticoes;
    this.desvioQtdRep = desvioQtdRep;
    this.infosImgsRaios = infosImgsRaios;
  }
}
class Escuridao
{
  constructor(infoEscuridao)

  {
    //tempo que demora pra escurecer de 0% a 100%
    this._tempoEscurecendo = infoEscuridao.tempoEscurecendo;
    this._desvioTempoEscurec = infoEscuridao.desvioTempoEscurec;

    //tempo que fica escuro total ateh voltar a clarear
    this._tempoEscuroTotal = infoEscuridao.tempoEscuroTotal;
    this._desvioEscuroTotal = infoEscuridao.desvioEscuroTotal;

    //tempo entre cada escurecer-clarear dentro de cada bloco
    this._intervaloEntreEscClarMsmBloco = infoEscuridao.intervaloEntreEscClarMsmBloco;

    //intervalo de tempo de acabar de clarear a ultima vez ateh comecar a escurecer de novo
    this._intervalo = infoEscuridao.intervalo;
    this._desvioIntervalo = infoEscuridao.desvioIntervalo;

    //numero de repeticoes de escurecer-clarear
    this._qtdRepeticoes = infoEscuridao.qtdRepeticoes;
    this._desvioQtdRep = infoEscuridao.desvioQtdRep;

    //imagens dos raios
    this._infosImgsRaios = infoEscuridao.infosImgsRaios;

    this._programarComecoProxBloco();
  }

  //COMECAR ESCURECER
  _programarComecoProxBloco()
  {
    //calcular tempo do próximo escurecer
    const tempoProx = Math.randomComDesvio(this._intervalo, this._desvioIntervalo);

    //setar próximo começar a escurecer
    const _this = this;
    new Timer(function() { _this._comecarBloco(); }, tempoProx);
  }
  _comecarBloco()
  {
    // setar quantas repeticoes vai ter e quantas jah foram
    this._qtdRepeticoesAtual = Math.randomComDesvio(this._qtdRepeticoes, this._desvioQtdRep);
    this._vezesEscurecerCompletas = 0;

    //comecar primeiro escurecer-clarear
    this._comecarEscClarAtual();
  }
  _comecarEscClarAtual()
  {
    /* tempoTotal/frameRate —— 255 (total)
                         1  —— qtdEscurecer  */
    this._qtdEscurecer = 255/(Math.randomComDesvio(this._tempoEscurecendo, this._desvioTempoEscurec)/frameRatePadrao);
    this._qtdEscuroAtual = 0;

    this._escurecendo = true; //se for false eh porque esta ficando mais claro
  }

  _proximoEscClarMsmBloco()
  {
    this._vezesEscurecerCompletas++;
    if (this._vezesEscurecerCompletas === this._qtdRepeticoesAtual) // se jah acabou todas as repeticoes
      this._acabarBloco();
    else
    {
      //acabar escurecer-clarear atual
      this._acabarEscClar();

      //setar o comeco do proximo escurecer-clarear
      const _this = this;
      new Timer(function() { _this._comecarEscClarAtual(); }, this._intervaloEntreEscClarMsmBloco);
    }
  }

  //ACABAR
  _acabarEscClar()
  {
    //dar delete em tudo o que foi estado em this._comecarEscClarAtual()
    delete this._qtdEscurecer;
    delete this._qtdEscuroAtual;
    delete this._escurecendo;
  }
  _acabarBloco()
  {
    //dar delete em tudo o que foi estado em this._comecarEscClarAtual()
    this._acabarEscClar();

    //dar delete em tudo o que foi estado em this._comecarBloco()
    delete this._vezesEscurecerCompletas;
    delete this._qtdRepeticoesAtual;

    //programar o proximo bloco
    this._programarComecoProxBloco();
  }

  draw()
  {
    if (this._qtdEscuroAtual !== undefined)
    // se nao estah dentro de nenhum bloco
    {
      //MUDAR this._qtdEscuroAtual
      if (this._escurecendo !== 0)
      // se for pra continuar preto, this._escurecendo vai ser zero e entao nao precisa aumentar this._qtdEscuroAtual (jah tá no máximo)
      {
        //mudar qtdEscuroAtual
        if (this._escurecendo)
          this._qtdEscuroAtual = Math.min(this._qtdEscuroAtual + this._qtdEscurecer, 255); //maximo eh 255
        else
          this._qtdEscuroAtual = Math.max(this._qtdEscuroAtual - this._qtdEscurecer, 0); //minimo eh 0
      }

      //DESENHAR
      //background preto
      background(color(0,0,0, this._qtdEscuroAtual)); //this._qtdEscuroAtual eh a opacidade (de 0 a 255)
      //raios
      if (this._infosImgsRaios.length > 0 && //se tem alguma imagem de raio
        this._qtdEscuroAtual >= minEscuroAtualRaio && Probabilidade.chance(1, denominadorChanceRaio))
      {
        image(this._infosImgsRaios[this._indexRaio].img, this._infosImgsRaios[this._indexRaio].ponto.x, this._infosImgsRaios[this._indexRaio].ponto.y);
        this._indexRaio = (this._indexRaio+1)%this._infosImgsRaios.length; //se for igual qtdInfosImgsRaios voltar para indice zero
      }

      // VERIFICAR SE VAI COMECAR A CLAREAR DE NOVO OU VAI ESPERAR UM TEMPO PRETO
      if (this._qtdEscuroAtual === 255 && this._escurecendo !== 0)
      // precisa ficar certo tempo começar a clarear
      {
          //setar this._escurecendo para nao mudar this._qtdEscuroAtual
          this._escurecendo = 0; //quando escurecendo for zero significa que nao eh pra mudar this._qtdEscuroAtual

          //programar para comecar a clarear
          const tempoComecarClar = Math.randomComDesvio(this._tempoEscuroTotal, this._desvioEscuroTotal);
          const _this = this;
          new Timer(function() { _this._escurecendo = false; }, tempoComecarClar);
      }
      else
      if (this._qtdEscuroAtual === 0)
      // jah acabou de clarear, entao vai comecar a escurecer de novo ou acaba o bloco
        this._proximoEscClarMsmBloco();
    }
  }
}
