//import "GeometriaBasica.js";

//FORMAS: quadrado, retangulo, triangulo, paralelogramo, quadrilatero

// BASICO
class FormaGeometrica
{
  constructor (corImg)
  // corImg: imagem ou {strokeColor: cor, fillColor: cor}
  {
    //se nao estah querendo soh a parte de backend (sem colocar na tela)
    if (corImg != null)
      this.corImg = corImg;
  }

  //imagem/cor
  get corImg()
  { return this._corImg; }
  set corImg(corImg)
  {
    this._ehCor = corImg.strokeColor != null;
    this._corImg = corImg;
  }
  get ehCor()
  { return this._ehCor; }

  //desenhar imagem
  _desenharImagem()
  { image(this._img, this.x, this.y, this.width, this.height); }
  _colocarCores()
  {
    stroke(this._corImg.strokeColor);
    fill(this._corImg.fillColor);
  }

  //arestas
  get arestas()
  {
    if (this._arestas == null)
    {
      this._arestas = new Array(this.vertices.length);
      //Ex: se tiver quatro lados (0 -> 1), (1 -> 2), (2 -> 3), (3 -> 0)
      for (let i = 0; i<this._arestas.length; i++)
        this._arestas[i] = new Semirreta(this._vertices[i],
          this._vertices[(i+1)%this._arestas.length]);
    }

    return this._arestas;
  }

  //width, height e posicoes
  get width()
  { return this.maiorX - this.menorX; }
  get height()
  { return this.maiorY - this.menorY; }

  colocarNoMeioX()
  { this.x = Tela.xParaEstarNoMeio(this.width); }
}
/*Quem der extends em FormaGeometricaComplexa tem que ter:
  //forma
  -> get codForma()
  -> get nLados()
  -> get vertices() //SENTIDO HORARIO
  -> interseccao(obj) //retorna se estah intersectando

  -> get menorX()
  -> get maiorX()
  -> get menorY()
  -> get maiorY()

  -> get x()
  -> set x()
  -> get y()
  -> set y()

  //forma e cor
  -> draw()

ps: nao fiz com interface, pois nao faz muito sentido em javascript
*/


// FORMAS SIMPLES
class FormaGeometricaSimples extends FormaGeometrica
{
  constructor(x, y, corImg)
  {
    super(corImg);
    this._x = x;
    this._y = y;

    this._vertices = null;
    this._arestas = null;
  }

  get nLados()
  { return 4; }
  get vertices()
  {
    if (this._vertices == null)
    {
      this._vertices = new Array(4);
      this._vertices[0] = new Ponto(this._x, this._y);
      this._vertices[1] = new Ponto(this._x + this.width, this._y);
      this._vertices[2] = new Ponto(this._x + this.width, this._y + this.height);
      this._vertices[3] = new Ponto(this._x, this._y + this.height);
    }

    return this._vertices;
  }

  _mudouArestasVertices()
  {
    this._vertices = null;
    this._arestas = null;
  }

  //forma
  set x(x)
  {
    if (this._x == x)
      return;
    this._mudouArestasVertices();
    this._x = x;
  }
  get x()
  { return this._x; }
  mudarX(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar X)
  {
    this._x += qtdMuda;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    //se aparece um pouco
    return this._x + this._width > 0 && this._x <= width;
  }
  set y(y)
  {
    if (this._y == y)
      return;
    this._mudouArestasVertices();
    this._y = y;
  }
  get y()
  { return this._y; }
  mudarY(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar Y)
  {
    this._y += qtdMuda;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    //se aparece um pouco
    return this._y + this._height > 0 && this._y <= height - heightVidaUsuario;
  }

  menorX()
  { return this._x; }
  maiorX()
  { return this._x + this.width; }
  menorY()
  { return this._y; }
  maiorY()
  { return this._y + this.height; }

  //draw
  draw()
  {
    if (this._ehCor)
    {
      this._colocarCores();
      //desenhar retangulo
      rect(this._x, this._y, this.width, this.height);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }

  //interseccao
  interseccao(obj)
  {
    return Interseccao.intersecDirecao(this._x, this.width, obj._x, obj.width)
      && Interseccao.intersecDirecao(this._y, this.height, obj._y, obj.height);
  }
}

class Retangulo extends FormaGeometricaSimples
{
  constructor(x, y, width, height, corImg)
  {
    super(x, y, corImg);

    if (width < 0 || height < 0)
      throw "Dados inválidos para criar retângulo!";

    this._width = width;
    this._height = height;
  }

  //getters basicos
  get codForma()
  { return 2; }

  //getters e setters tamanho
  set width(width)
  {
    if (width != this._width)
      this.mudarWidth(width - this._width);
  }
  get width()
  { return this._width; }
  mudarWidth(qtdMuda)
  {
    if (qtdMuda - this._width < 0)
    //nao deixa width ficar negativo
      qtdMuda = -this._width;
    if (qtdMuda == 0)
      return this._width > 0;

    //aumenta ou diminui igual para os dois lados
    this._x -= qtdMuda/2;
    this._width += qtdMuda;

    this._mudouArestasVertices();
    return this._width > 0;
  }
  set height(height)
  {
    if (height != this._height)
      this.mudarHeight(height - this._height);
  }
  get height()
  { return this._height; }
  mudarHeight(qtdMuda)
  {
    if (qtdMuda - this._height < 0)
    //nao deixa height ficar negativo
      qtdMuda = -this._height;
    if (qtdMuda == 0)
      return this._height > 0;

    //aumenta ou diminui igual para os dois lados
    this._y -= qtdMuda/2;
    this._height += qtdMuda;

    this._mudouArestasVertices();
    return this._height > 0;
  }
}

class Quadrado extends FormaGeometricaSimples
{
  constructor(x, y, tamanhoLado, corImg)
  {
    super(x, y, corImg);

    if (width < 0 || height < 0)
      throw "Dados inválidos para criar quadrado!";

    this._tamLado = tamanhoLado;
  }

  //getters basicos
  get codForma()
  { return 1; }

  //getters e setters tamanho
  set tamanhoLado(tamLado)
  {
    if (this._tamLado != tamLado)
      this.mudarTamanhoLado(tamLado - this._tamLado);
  }
  get tamanhoLado()
  { return this._tamLado; }
  mudarTamanhoLado(qtdMuda)
  {
    if (qtdMuda - this._tamLado < 0)
    //nao deixa tamanho lado ficar negativo
      qtdMuda = -this._tamLado;
    if (qtdMuda == 0)
      return this._tamLado > 0;

    //aumenta ou diminui igual para os dois lados
    this._x -= qtdMuda/2;
    this._y -= qtdMuda/2;
    this._tamLado += qtdMuda;

    this._mudouArestasVertices();
    return this._tamLado > 0;
  }
  get width()
  { return this._tamLado; }
  get height()
  { return this._tamLado; }
}


//FORMAS COMPLEXAS
class FormaGeometricaComplexa extends FormaGeometrica
{
  //PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
  constructor (a, corImg)
  {
    super(corImg);

    //forma
    this._a = a;

    this._width = null;

    this._maiorX = null;
    this._menorX = null;
    this._maiorY = null;

    this._vertices = null;
    this._arestas = null;
  }

  _mudouArestasTriang()
  {
    this._arestas = null;
    this.__triangulos = null;
  }

  //forma
  set x(novoX) //muda todos os vertices
  { this.mudarX(novoX - this.x); }
  mudarX(qtdMuda) //muda todos os vertices
  {
    if (qtdMuda != 0)
    {
      let jahTemMaiorMenorXY = this._maiorX != null;

      let maiorX = null;
      let menorX = null;
      let maiorY = null;

      for (let i = 0; i<this.vertices.length; i++)
      {
        this._mudarXYVertice(i, true, this.vertices[i].x + qtdMuda);
        //mudar X do vertice (em {a,b,c,...} e no vetor)

        if (!jahTemMaiorMenorXY)
        {
          if (menorX == null || this.vertices[i].x < menorX)
            menorX = this.vertices[i].x;
          if (maiorX == null || this.vertices[i].x > maiorX)
            maiorX = this.vertices[i].x;
          if (maiorY == null || this.vertices[i].y > maiorY)
            maiorY = this.vertices[i].y;
        }
      }

      if (jahTemMaiorMenorXY)
      {
        this._maiorX += qtdMuda;
        this._menorX += qtdMuda;
        //nao muda nada em maiorY
      }else
      {
        this._maiorX = maiorX;
        this._menorX = menorX;
        this._maiorY = maiorY;
      }

      this._mudouArestasTriang();
    }

    //retorna se aparece um pouco
    return (maiorX > 0 && maiorX < width) || (menorX > 0 && menorX < width);
  }
  set y(novoY) //muda todos os vertices
  { this.mudarY(novoY - this.y); }
  mudarY(qtdMuda) //muda todos os vertices
  {
    if (qtdMuda != 0)
    {
      let jahTemMaiorMenorXY = this._maiorY != null;

      let maiorX = null;
      let menorX = null;
      let maiorY = null;

      for (let i = 0; i<this.vertices.length; i++)
      {
        this._mudarXYVertice(i, false, this.vertices[i].y + qtdMuda);
        //mudar Y do vertice (em {a,b,c,...} e no vetor)

        if (!jahTemMaiorMenorXY)
        {
          if (menorX == null || this.vertices[i].x < menorX)
            menorX = this.vertices[i].x;
          if (maiorX == null || this.vertices[i].x > maiorX)
            maiorX = this.vertices[i].x;
          if (maiorY == null || this.vertices[i].y > maiorY)
            maiorY = this.vertices[i].y;
        }
      }

      if (jahTemMaiorMenorXY)
      {
        this._maiorY += qtdMuda;
        //nao muda nada em maiorX e menorX
      }else
      {
        this._maiorX = maiorX;
        this._menorX = menorX;
        this._maiorY = maiorY;
      }

      this._mudouArestasTriang();
    }

    //retorna se aparece um pouco
    return (this._maiorY > 0 && this._maiorY < height - heightVidaUsuario) ||
      (this.menorY > 0 && this.menorY < height - heightVidaUsuario);
  }

  //get (x,y)
  get x()
  { return this.menorX; }
  get y()
  { return this.menorY; }

  get width()
  { return this.maiorX - this.menorX; }
  get height()
  { return this.maiorY - this.menorY; }

  _pegarMenorMaiorXY()
  {
    let maiorX = this.vertices[0].x;
    let menorX = this.vertices[0].x;
    let maiorY = this.vertices[0].y;

    for (let i = 1; i<this.vertices.length; i++)
    {
      if (this.vertices[i].x < menorX)
        menorX = this.vertices[i].x;
      if (this.vertices[i].x > maiorX)
        maiorX = this.vertices[i].x;
      if (this.vertices[i].y > maiorY)
        maiorY = this.vertices[i].y;
    }

    this._maiorX = maiorX;
    this._menorX = menorX;
    this._maiorY = maiorY;
  }
  menorX()
  {
    if (this._menorX == null)
      this._pegarMenorMaiorXY();
    return this._menorX;
  }
  maiorX()
  {
    if (this._maiorX == null)
      this._pegarMenorMaiorXY();
    return this._maiorX;
  }
  menorY()
  { return this._a.y; }
  maiorY()
  {
    if (this._maiorY == null)
      this._pegarMenorMaiorXY();
    return this._maiorY;
  }

  //vertices
  get vertices()
  //primeiro vertice mais alto (menor Y) depois em sentido horario
  {
    if (this._vertices == null)
    {
      this._vertices = new Array(this.nLados);
      for (let i = 0; i<this._vertices.length; i++)
      {
        let vert = null;
        switch (i)
        {
          case 0: vert = this._a; break;
          case 1: vert = this._b; break;
          case 2: vert = this._c; break;
          case 3: vert = this._d; break;
          // Para novas figuras complexas: ...
        }
        this._vertices[i] = vert;
      }
    }

    return this._vertices;
  }
  _mudarXYVertice(i, ehX, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        if (ehX)
          this._a.x = novoValor;
        else
          this._a.y = novoValor;
        break;
      case 1:
        if (ehX)
          this._b.x = novoValor;
        else
          this._b.y = novoValor;
        break;
      case 2:
        if (ehX)
          this._c.x = novoValor;
        else
          this._c.y = novoValor;
        break;
      case 3:
        if (ehX)
          this._d.x = novoValor;
        else
          this._d.y = novoValor;
        break;
      // Para novas figuras complexas: ...
    }

    if (this._vertices != null)
    {
      if (ehX)
        this._vertices[i].x = novoValor;
      else
        this._vertices[i].y = novoValor;
    }
  }
  _mudarVertice(i, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        this._a = novoValor;
        break;
      case 1:
        this._b = novoValor;
        break;
      case 2:
        this._c = novoValor;
        break;
      case 3:
        this._d = novoValor;
        break;
      // Para novas figuras complexas: ...
    }

    if (this._vertices != null)
      this._vertices[i] = novoValor;
  }

  //triangulos
  get _triangulos()
  {
    if (this.__triangulos == null)
    {
      this.__triangulos = new Array(this.nLados - 2);
      //colocar vertices na ordem certa!!
      for (let i = 0; i<this.__triangulos.length; i++)
      {
        let vert = triang;
        switch (i)
        {
          case 0: triang = new Triangulo(this._a, this._b, this._c); break;
          case 1: triang = new Triangulo(this._a, this._c, this._d); break;
          // Para novas figuras complexas: ...
        }
        this.__triangulos[i] = triang;
      }
    }

    return this.__triangulos;
  }

  //interseccao
  interseccao(obj)
  {
    // EXPLICACAO:
      // 1. Se algum vertice de obj estah dentro de algum dos triangulos dessa figura
          // ou
      // 2. Se alguma arestas de obj intersecta com alguma aresta de this

    // 1.
    for(let i = 0; i<obj.vertices.length; i++)
      if ((obj.vertices[i].y >= this.menorY && obj.vertices[i].y <= this.maiorY))
      // se vertice estah dentro do menor e maior Y do this
        if (this.pontoEstahDentroAlgumTriang(obj.vertices[i]))
        // verificar se esse ponto estah dentro de algum dos triangulos
          return true;

    // 2.
    for (let i=0; i<obj.arestas.length; i++)
      if (this.semirretaIntersectaAlgumaAresta(obj.arestas[i]))
      // verificar se a aresta atual de obj intersecta com alguma aresta do this
        return true;

    return false;
  }
  pontoEstahDentroAlgumTriang(p)
  {
    // verificar se esse ponto estah dentro de algum dos triangulos
    for (let i = 0; i<this._triangulos.length; i++)
      if (this.__triangulos[i].pontoEstahDentro(p))
        return true;
    return false;
  }
  semirretaIntersectaAlgumaAresta(semirreta)
  {
    // verificar se a semirreta intersecta com alguma aresta do this
    for (let i = 0; i<this.arestas.length; j++)
      if (semirreta.interseccao(this.arestas[j]))
        return true;
    return false;
  }

  //colocar pontos na ordem certa (primeiro o menor y e mais da esquerda, depois em sentido horario)
  colocarVerticesOrdemCorreta() //o(s) nulo(s) sera(ao) o(s) ultimo(s)
  //para entrar nesse metodo as variaveis {a,b,c,...} jah devem estar preenchidas
  {
    let vertices = this._organizarVertices(true);
    // colocar pontos na classe
    for (let i = 0; i<vertices.length; i++)
      this._mudarVertice(i, vertices[i]);
    this._mudouArestasTriang();
  }
  _organizarVertices(menorPrimeiro)
  // se menorPrimeiro, primeiro os mais de cima
  {
    if (menorPrimeiro == null)
      menorPrimeiro = true;

    // descobrir qual eh o vertice mais alto da esqueda (o menor)
    //e colocar os outros nesse vetor
    let infoOutrosVert = new Array(this.nLados-1); // vetor de {vert: , angulo: "valor"}
    let primeiroPonto = null; // vertice mais de cima da esquerda
    let soma = new Ponto(0,0); // soma dos pontos
    let qtdNaoNulos = 0;

    //vai definir se vai pegar o maior ou o menor
    let mult;
    let tipoAngulo;
    if (menorPrimeiro)
    {
      mult = 1;
      tipoAngulo = Angulo.MAIOR_180_CIMA;
    }else
    {
      mult = -1;
      tipoAngulo = Angulo.MAIOR_180_BAIXO;
    }
    for (let i = 0; i < this.vertices.length; i++)
    {
      if (primeiroPonto == null)
        primeiroPonto = this._vertices[i];
      else
      {
        if (this._vertices[i] != null && (primeiroPonto == null
          || this._vertices[i].compareTo(primeiroPonto)*mult < 0))
          //ps: pode ter vertices nulos
        {
          infoOutrosVert[i-1] = {vert: primeiroPonto, angulo: null};
          primeiroPonto = this._vertices[i];
        }else
          infoOutrosVert[i-1] = {vert: this._vertices[i], angulo: null};
      }

      if (this._vertices[i] != null)
      {
        soma = soma.mais(this._vertices[i]);
        qtdNaoNulos++;
      }
    }

    let pontoCentral = soma.dividido(qtdNaoNulos);
    // o ponto central vai estar dentro do poligno mesmo que alguns vertices nao tenham sido dados (sejam nulos)

    //aqui pra baixo primeiroPonto jah estah com o ponto que serah o this._a
    //e os outros pontos estao no vetor infoOutrosVert...
    // ps: todos os nulos estarao no vetor infoOutrosVert

    //EXPLICACAO: para ordenar os outros em sentido horario,
    // deve-se pegar o angulo (PrimeiroPonto-PontoCentral-VerticeAtual) de todos os
    // esses vertices e ordena-los de maneira crescente de acordo com ele

    //colocar os angulos no vetor
    for (let i = 0; i<infoOutrosVert.length; i++)
      if (infoOutrosVert[i].vert != null)
        infoOutrosVert[i].angulo = new Angulo(primeiroPonto, pontoCentral,
          infoOutrosVert[i].vert, tipoAngulo).valor;

    //ordenar de maneira crescente os angulos PrimeiroPonto-PontoCentral-VerticeAtual dos vertices
    this._ordenarOutrosVert(infoOutrosVert);

    let ret = new Array(infoOutrosVert.length+1);
    for (let i = 0; i<ret.length; i++)
      if (i == 0)
        ret[i] = primeiroPonto;
      else
        ret[i] = infoOutrosVert[i-1].vert;
    return ret;
  }
  _ordenarOutrosVert(infoOutrosVert)
  {
    //ordenar crescentemente e com os nulos por ultimo
    for (let lento = 0; lento < infoOutrosVert.length; lento++)
    {
      let oMenor = lento;
      for (let rapido = lento+1; rapido < infoOutrosVert.length; rapido++)
        if (infoOutrosVert[rapido].angulo != null && (infoOutrosVert[oMenor].angulo == null
          || infoOutrosVert[rapido].angulo < infoOutrosVert[oMenor].angulo))
        //os nulos por ultimo
           oMenor = rapido;

      if (oMenor != lento)
      {
        //trocar lento com oMenor
        let aux = infoOutrosVert[lento];
        infoOutrosVert[lento] = infoOutrosVert[oMenor];
        infoOutrosVert[oMenor] = aux;
      }
    }
  }
}
/*Quem der extends em FormaGeometricaComplexa tem que ter:
  -> get _triangulos()
ps: nao fiz com interface, pois nao faz muito sentido em javascript
*/

class Quadrilatero extends FormaGeometricaComplexa
{
  //PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
  constructor(a, b, c, d, corImg)
  {
    super(a, corImg);

    this._b = b;
    this._c = c;
    this._d = d;
  }

  //getters basicos
  get codForma()
  { return 5; }
  get nLados()
  { return 4; }

  draw()
  {
    if (this._ehCor)
    {
      //colocar cores
      this._colocarCores();
      //desenhar o quadrilatero
      quad(this._a.x, this._a.y,
           this._b.x, this._b.y,
           this._c.x, this._c.y,
           this._d.x, this._d.y);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }
}

class Paralelogramo extends Quadrilatero
{
  //PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
  constructor(a, b, c, d, corImg, colocarVerticesOrdemCorreta)
  {
    super(a, b, c, d, corImg);

    if (colocarVerticesOrdemCorreta)
      this.colocarVerticesOrdemCorreta();
      //os nulos serao os ultimos

    //verificar se sao pontos de um quadrilatero
    let pontoDCerto = new Ponto(c.x + b.x - a.x, c.y + b.y - a.y);
    if (this._d == null)
      this._d = pontoDCerto;
    else
    if (!pontoDCerto.equals(this._d))
      throw "Esses pontos não formam um paralelogramo!";
  }

  //getters basicos
  get codForma()
  { return 4; }
}

class Triangulo extends FormaGeometricaComplexa
{
  //PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
  constructor(a, b, c, corImg)
  {
    super(a, corImg);

    this._b = b;
    this._c = c;

    this._area = null;
  }

  //getters basicos
  get codForma()
  { return 3; }
  get nLados()
  { return 3; }

  //contrVertices: [0]: o mais baixo, [1] e [2] os proximos em sentido horario
  get contrVertices()
  {
    if (this._contrVertices == null)
      this._contrVertices = this._organizarVertices(false);
    return this._contrVertices;
  }

	pontoEstahDentro(p)
	{
		let areaTriangulo = this.area;

		let triang1 = new Triangulo(p, this._a, this._b);
		let triang2 = new Triangulo(p, this._b, this._c);
		let triang3 = new Triangulo(p, this._a, this._c);

    return triang1.area + triang2.area + triang3.area == areaTriangulo;
	}

	get area()
	{
		if (this._area == null)
			this._area = Math.abs((this._a.x*(this._b.y - this._c.y) + this._b.x*(this._c.y - this._a.y)
			+ this._c.x*(this._a.y - this._b.y))/2);
		return this._area;
	}

  draw()
  {
    if (this._ehCor)
    {
      //colocar cores
      this._colocarCores();
      //desenhar triangulo
      triangle(this._a.x, this._a.y,
        this._b.x, this._b.y,
        this._c.x, this._c.y);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }
}

//se for adicionar novas formas geometricas complexas,
// adicionar conteudo em: "// Para novas figuras complexas: ..."
