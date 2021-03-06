// tamanho
const porcentagemTamPersMinimoTamOficina = 125;
// dinheiro por (1/frameRate)s: cada 0.05 eh um pouco mais que 5
const qntGanhaMinimoOficina = 0.15;
const qntSomaACadaLvOficina = 0.05;
class Oficina
{
  constructor(level)
  {
    //eh quadrado que fica no meio
    this._formaGeometrica = new Quadrado(null,null, Oficina.tamanhoOficinaPorLv(level), {fill: "green", stroke: "green"});
    this._formaGeometrica.colocarNoMeioX();
    this._formaGeometrica.colocarNoMeioY();

    //jah verifica pois o personagem pode nao andar nada logo na primeira vez
    this.verificarEstahConsertando();
  }

  verificarEstahConsertando()
  {
    this._persEstahConsertando = ControladorJogo.pers.vivo &&
      this._formaGeometrica.contem(ControladorJogo.pers.formaGeometrica); /* se tiver inteiramente dentro */
  }
  procVerificarConsertando(level)
  {
    if (this._persEstahConsertando)
      ControladorJogo.pers.mudarVida(Oficina.qtdGanhaVidaEmOficinaLevel(level));
  }

  static tamanhoOficinaPorLv(level)
  {
    let porcentagemTamPers = 340 - level*25;
    if (porcentagemTamPers < porcentagemTamPersMinimoTamOficina)
      porcentagemTamPers = porcentagemTamPersMinimoTamOficina;
    return Math.max(ControladorJogo.pers.formaGeometrica.width, ControladorJogo.pers.formaGeometrica.height)
      * porcentagemTamPers/100;
  }
  static qtdGanhaVidaEmOficinaLevel(level)
  { return qntGanhaMinimoOficina + (level-1)*qntSomaACadaLvOficina; }

  draw()
  { this._formaGeometrica.draw(); }
}
