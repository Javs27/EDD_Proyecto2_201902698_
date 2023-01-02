// Login
function login() {  
    var usuario = document.getElementById("exampleInputEmail1").value;
    var password = document.getElementById("exampleInputPassword1").value;
    var checked = document.getElementById("exampleCheck1").checked;
    if(checked){
        if(usuario == "EDD" && password == "12345678"){
            document.getElementById("divLogin").style.display = "none";
            document.getElementById("divCliente").style.display = "none";
            document.getElementById("divAdmin").style.display = "grid";
        }else{
            alert("Password incorrecta administrador");
        }
    }else{
        if(listaClientes.login(usuario,password)){
            document.getElementById("divLogin").style.display = "none";
            document.getElementById("divCliente").style.display = "grid";
            document.getElementById("divAdmin").style.display = "none";
            sesion = listaClientes.buscar(usuario,password);
        }else{
            alert("Password incorrecta cliente");
        }
    }
}

function cerrarSesion() {
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("exampleInputPassword1").value = "";
    document.getElementById("divLogin").style.display = "flex";
    document.getElementById("divAdmin").style.display = "none";
    document.getElementById("divCliente").style.display = "none";
}

function vistaUsuario(value) {
    if(value == "peliculas"){
        document.getElementById("divActores").style.display = "none";
        document.getElementById("divPelis").style.display = "block";
        document.getElementById("divCategorias").style.display = "none";
    }else if(value == "actores"){
        document.getElementById("divActores").style.display = "block";
        document.getElementById("divPelis").style.display = "none";
        document.getElementById("divCategorias").style.display = "none";
    }else if(value == "categorias"){
        document.getElementById("divActores").style.display = "none";
        document.getElementById("divPelis").style.display = "none";
        document.getElementById("divCategorias").style.display = "block";
    }
}
// Cargar archivos
function openFileSimple(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      var json = JSON.parse(text);
      json.forEach(function(cliente) {
        var nuevoCliente = new Cliente(cliente.dpi, cliente.nombre_completo, cliente.nombre_usuario, cliente.correo, cliente.contrasenia, cliente.telefono);
        listaClientes.agregarClientes(nuevoCliente)
    });
    };
    reader.readAsText(input.files[0]);
}

function openFileAVL(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      var json = JSON.parse(text);
      json.forEach(function(peli) {
        var nuevaPeli = new Pelicula(peli.id_pelicula, peli.nombre_pelicula, peli.descripcion, peli.puntuacion_star, peli.precion_Q, peli.paginas, peli.categoria);
        arbolavl.insertar(nuevaPeli)
    });
    arbolavl.inorden();
    };
    reader.readAsText(input.files[0]);
}

function openFileABB(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      var json = JSON.parse(text);
      json.forEach(function(actor) {
        var nuevoActor = new Actor(actor.dni, actor.nombre_actor, actor.correo, actor.descripcion);
        arbolabb.insertar(nuevoActor)
    });
    arbolabb.inorden();
    };
    reader.readAsText(input.files[0]);
}

function openFileHash(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      var json = JSON.parse(text);
      json.forEach(function(categoria) {
        var nuevaCategoria = new Categoria(categoria.id_categoria, categoria.company);
        tablaHash.insertar(nuevaCategoria)
    });
    tablaHash.recorrer();
    };
    reader.readAsText(input.files[0]);
}

//Lista simple
class NodoSimple {
    constructor(_PersonajeMK) {
        this.PersonajeMK = _PersonajeMK
        this.siguiente = null
    }
}

class Listasimple{
    constructor() {
        this.cabecera = null
    }
    agregarClientes(_objetoPersonaje) {
        var tempo = new NodoSimple(_objetoPersonaje)
        tempo.siguiente = this.cabecera
        this.cabecera = tempo
    }

    login(_nombre_usuario, _contrasenia){
        var temporal = this.cabecera
        while (temporal != null) {
            if(_nombre_usuario == temporal.PersonajeMK.nombre_usuario && _contrasenia == temporal.PersonajeMK.contrasenia){
                return true;
            }
            temporal.PersonajeMK.nombre_usuario
            temporal = temporal.siguiente         
        }
        return false;
    }

    buscar(_nombre_usuario, _contrasenia){
        var temporal = this.cabecera
        while (temporal != null) {
            if(_nombre_usuario == temporal.PersonajeMK.nombre_usuario && _contrasenia == temporal.PersonajeMK.contrasenia){
                return temporal.PersonajeMK;
            }
            temporal.PersonajeMK.nombre_usuario
            temporal = temporal.siguiente         
        }
        return false;
    }

    graficarlistaPersonajesMarioKart(){
        var codigodot = "digraph G{\nlabel=\" Clientes \";\nnode [shape=box];\n graph [rankdir = LR];";
        var temporal = this.cabecera
        var conexiones ="";
        var nodos ="";
        var numnodo= 0;
        while (temporal != null) {
            nodos+=  "N" + numnodo + "[label=\"" + temporal.PersonajeMK.nombre_usuario + "\" ];\n"
            if(temporal.siguiente != null){
                var auxnum = numnodo+1
                conexiones += "N" + numnodo + " -> N" + auxnum + ";\n"
            }
            temporal = temporal.siguiente
            numnodo++;            
        }
        codigodot += "//agregando nodos\n"
        codigodot += nodos+"\n"
        codigodot += "//agregando conexiones o flechas\n"
        codigodot += "{\n"+conexiones+"\n}\n}"
        d3.select("#lienzo").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigodot)
    }
}

class Cliente{
    constructor(_dpi,_nombre_completo,_nombre_usuario,_correo,_contrasenia,_telefono){
        this.dpi = _dpi
        this.nombre_completo = _nombre_completo
        this.nombre_usuario = _nombre_usuario
        this.correo = _correo
        this.contrasenia = _contrasenia
        this.telefono = _telefono
    }
}

function renderSimple() {  
    listaClientes.graficarlistaPersonajesMarioKart()    
}

//Arbol AVL
class NodoAVL{
    constructor(_valor){
        this.valor=_valor;
        this.izquierda = null;
        this.derecha = null;
        this.altura = 0;
    }
}

class AVL{
    constructor(){
        this.raiz = null;
    }
    //maximo
    MAXIMO(valor1,valor2){
        if(valor1>valor2) return valor1;
        return valor2;
    }
    //altura del arbol
    altura(nodo){
        if(nodo == null) return -1;
        return nodo.altura;
    }
    //insertar
    insertar(valor){
        this.raiz = this.add(valor,this.raiz)
    }

    buscar(id){
        var tmp = this.raiz;
        while(true){
            if(tmp.valor.id_pelicula == id){
                return tmp.valor;
            }
            if(id < tmp.valor.id_pelicula){
                tmp = tmp.izquierda;
            }else{
                tmp = tmp.derecha;
            }
        }
    }
    //insertar recursivo
    add(valor, nodo){
        if(nodo == null) return new NodoAVL(valor);
        else{
            if(valor.id_pelicula < nodo.valor.id_pelicula){
                nodo.izquierda = this.add(valor, nodo.izquierda)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda) == -2){
                    //programar los casos 
                    //rsi
                    if(valor.id_pelicula < nodo.izquierda.valor.id_pelicula){
                        nodo = this.rotacionizquierda(nodo);
                    }//rdi}
                    else{
                        nodo = this.Rotaciondobleizquierda(nodo);
                    }
                    
                }
            }else if(valor.id_pelicula > nodo.valor.id_pelicula){
                nodo.derecha = this.add(valor, nodo.derecha);
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda)== 2){
                    //otros dos casos
                    //rotacion simple derecha
                    if(valor.id_pelicula > nodo.derecha.valor.id_pelicula){
                        nodo = this.rotacionderecha(nodo);
                    }else{
                        nodo = this.Rotaciondoblederecha(nodo);
                    }
                    //rotacion doble derecha
                }
            }else{
                nodo.valor = valor;
            }
        }
        nodo.altura = this.MAXIMO(this.altura(nodo.izquierda),this.altura(nodo.derecha))+1
        return nodo;
    }


    //rotacion simple izquierda
    rotacionizquierda(nodo){
        var aux = nodo.izquierda;
        nodo.izquierda = aux.derecha;
        aux.derecha = nodo;
        //calculo de nueva altura
        nodo.altura = this.MAXIMO(this.altura(nodo.izquierda),this.altura(nodo.derecha))+1;
        aux.altura = this.MAXIMO(this.altura(nodo.izquierda), nodo.altura)+1;
        return aux;
    }
    //rotacion simple derecha
    rotacionderecha(nodo){
        var aux = nodo.derecha;
        nodo.derecha = aux.izquierda;
        aux.izquierda = nodo;
        //calcular de nuevo altura
        nodo.altura = this.MAXIMO(this.altura(nodo.izquierda),this.altura(nodo.derecha))+1;
        aux.altura = this.MAXIMO(this.altura(nodo.derecha),nodo.altura)+1;
        return aux;
    }
    //rotacion dobles derecha
    Rotaciondoblederecha(nodo){
        nodo.derecho = this.rotacionizquierda(nodo.derecho);
        return this.rotacionderecha(nodo);
    }

    //rotaciones dobles
    Rotaciondobleizquierda(nodo){
        nodo.izquierda = this.rotacionderecha(nodo.izquierda);
        return this.rotacionizquierda(nodo);
    }
    //recorridos
    cambiarPuntuacion(idCambio,nuevaPuntuacion){
        this.pre_orden(this.raiz,idCambio,nuevaPuntuacion);
    }
    pre_orden(nodo,idCambio,nuevaPuntuacion){
        if(nodo!=null){
            if(idCambio == nodo.valor.id_pelicula){
                nodo.valor.puntuacion_star = nuevaPuntuacion;
                this.inorden();
                return false;
            }
            this.pre_orden(nodo.izquierda,idCambio,nuevaPuntuacion);
            this.pre_orden(nodo.derecha,idCambio,nuevaPuntuacion);
        }
    }
    //inorden
    inorden(des){
        var parent = document.getElementById("containerPelis");
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        this.in_orden(this.raiz,des);
    }
    in_orden(nodo,des){
        if(nodo!=null){
            if(des){
                this.in_orden(nodo.izquierda,des);
            }else{
                this.in_orden(nodo.izquierda);
            }
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerHTML = nodo.valor.nombre_pelicula;
            tr.append(td);
            var td1 = document.createElement("td");
            td1.innerHTML = nodo.valor.descripcion;
            tr.append(td1);
            var td2 = document.createElement("td");
            var info = document.createElement("button");
            info.innerHTML = "Info";
            info.className = "btn btn-info";
            info.type = "button";
            info.onclick = function(){
                document.getElementById("exampleModalLabelID").innerHTML = nodo.valor.id_pelicula;
                document.getElementById("exampleModalLabel").innerHTML = nodo.valor.nombre_pelicula;
                document.getElementById("exampleModalLabelDes").innerHTML = nodo.valor.descripcion;
                document.getElementById("exampleModalLabelPunt").innerHTML = "Puntuacion: " + nodo.valor.puntuacion_star;
                var comments = ""
                for(var i = 0; i < nodo.valor.comentarios.length; i++){
                    comments += `<div class="border border-3" style="margin: 10px;">
                  <div>
                    `+nodo.valor.comentarios[i].usuario+`
                  </div>
                  <div>
                    <p>`+nodo.valor.comentarios[i].comentario+`</p>   
                  </div>
                </div>
                <br>`;
                }
                console.log(comments);
                document.getElementById("container_comentarios").innerHTML = comments;
                document.getElementById("form_hacer_comentario").innerHTML = `<button class="btn btn-outline-secondary" type="button" onclick="Comentar(`+nodo.valor.id_pelicula+`)">Publicar</button>
                </div>
                <input type="text" class="form-control" placeholder="" aria-label="" id="txt_comentario" aria-describedby="basic-addon1">
              </div>`;
                return false;
            };
            info.dataset.toggle = "modal";
            info.dataset.target = "#exampleModal";
            td2.append(info);
            tr.append(td2);
            var td3 = document.createElement("td");
            var cart = document.createElement("button");
            cart.innerHTML = "Alquilar";
            cart.className = "btn btn-secondary";
            cart.onclick = function(){
                alert('Se alquilo la pelicula: ' + nodo.valor.nombre_pelicula);
                peliculas_alquiladas+=sesion.nombre_completo +" - "+ nodo.valor.nombre_pelicula +" ";
                return false;
            };
            cart.type = "button";
            td3.append(cart);
            tr.append(td3);
            var td4 = document.createElement("td");
            td4.innerHTML = "Q"+ nodo.valor.precion_Q;
            tr.append(td4);
            if(des){
                document.getElementById("containerPelis").prepend(tr);
            }else{
                document.getElementById("containerPelis").append(tr);
            }
            if(des){
                this.in_orden(nodo.derecha,des);
            }else{
                this.in_orden(nodo.derecha);
            }
        }
    }

    graficarAVL(){
        var codigodot = "digraph grafica{\n" +
        "rankdir=TB;\n" +
        "node [shape = record, style=filled, fillcolor=seashell2];\n";
        codigodot += this.getCodigoInterno(this.raiz);
        codigodot += "}\n";
        d3.select("#lienzo").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigodot)
    }

    getCodigoInterno(nodo) {
        var etiqueta;
        if(nodo.izquierda==null && nodo.derecha==null){
            etiqueta="nodo"+nodo.valor.id_pelicula+" [ label =\""+nodo.valor.id_pelicula+"\"];\n";
        }else{
            etiqueta="nodo"+nodo.valor.id_pelicula+" [ label =\"<C0>|"+nodo.valor.id_pelicula+"|<C1>\"];\n";
        }
        if(nodo.izquierda!=null){
            etiqueta=etiqueta + this.getCodigoInterno(nodo.izquierda) +
               "nodo"+nodo.valor.id_pelicula+":C0->nodo"+nodo.izquierda.valor.id_pelicula+"\n";
        }
        if(nodo.derecha!=null){
            etiqueta=etiqueta +  this.getCodigoInterno(nodo.derecha) +
               "nodo"+nodo.valor.id_pelicula+":C1->nodo"+nodo.derecha.valor.id_pelicula+"\n";                    
        }
        return etiqueta;
    }        
}

function Comentar(id){
    var pelicula = arbolavl.buscar(id);
    var comment = document.getElementById("txt_comentario").value;
    var n_comentario = new Comentario(sesion.nombre_completo,comment);
    pelicula.comentarios.push(n_comentario);
}
class Pelicula{
    constructor(_id_pelicula,_nombre_pelicula,_descripcion,_puntuacion_star,_precion_Q,_paginas,_categoria){
        this.id_pelicula = _id_pelicula
        this.nombre_pelicula = _nombre_pelicula
        this.descripcion = _descripcion
        this.puntuacion_star = _puntuacion_star
        this.precion_Q = _precion_Q
        this.paginas = _paginas
        this.categoria = _categoria
        this.comentarios = []
    }
}

class Comentario{
    constructor(usuario, comentario){
        this.usuario = usuario;
        this.comentario = comentario;
    }
}

function renderAVL() {
    arbolavl.graficarAVL();
}

function ordenPelis() {
    var x = document.getElementById("selectPelis").value;
    if(x == "Ascendente"){
        arbolavl.inorden();
    }else{
        arbolavl.inorden("des");
    }
}

function Alquilar() {
    alert("Pelicula alquilada");
    peliculas_alquiladas+=sesion.nombre_completo +" - "+ nodo.valor.nombre_pelicula +" ";
}

function cambiarPuntuacionPeli() {
    var idCambio = document.getElementById("exampleModalLabelID").innerHTML;
    var nuevaPuntuacion = document.getElementById("valueLabelPunt").value;
    arbolavl.cambiarPuntuacion(idCambio,nuevaPuntuacion);
    document.getElementById("valueLabelPunt").value = "";
    document.getElementById("exampleModalLabelPunt").innerHTML = "Puntuacion: " + nuevaPuntuacion;
    alert("Puntuacion cambiada");
}

//Arbol Binario
class NodoABB{
    constructor(_valor){
        this.valor=_valor;
        this.izquierda = null;
        this.derecha = null;
    }
}

class ABB{
    constructor(){
        this.raiz = null;
    }
    //metodo insertar
    insertar(_valor){
        this.raiz = this.add(_valor, this.raiz);
    }
    //metodo insertar recursivo
    add(_valor, nodo){
        if(nodo == null){
            return new NodoABB(_valor);
        }else{
            if(_valor.dni > nodo.valor.dni){
                nodo.derecha = this.add(_valor, nodo.derecha);
            }else{
                nodo.izquierda = this.add(_valor, nodo.izquierda);
            }
        }
        return nodo;
    }
    
    //preorden
    preorden(){
        this.pre_orden(this.raiz);
    }

    pre_orden(nodo){
        if(nodo!=null){
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerHTML = nodo.valor.dni;
            tr.append(td);
            var td1 = document.createElement("td");
            td1.innerHTML = nodo.valor.nombre_actor;
            tr.append(td1);
            var td2 = document.createElement("td");
            td2.innerHTML = nodo.valor.descripcion;
            tr.append(td2);
            document.getElementById("containerActores").append(tr);
            this.pre_orden(nodo.izquierda);
            this.pre_orden(nodo.derecha);
        }
    }
    //inorden
    inorden(){
        this.in_orden(this.raiz);
    }
    
    in_orden(nodo){
        if(nodo!=null){
            this.in_orden(nodo.izquierda);
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerHTML = nodo.valor.dni;
            tr.append(td);
            var td1 = document.createElement("td");
            td1.innerHTML = nodo.valor.nombre_actor;
            tr.append(td1);
            var td2 = document.createElement("td");
            td2.innerHTML = nodo.valor.descripcion;
            tr.append(td2);
            document.getElementById("containerActores").append(tr);
            this.in_orden(nodo.derecha);
        }
    }

    //postorden
    posorden(){
        this.pos_orden(this.raiz);
    }
    
    pos_orden(nodo){
        if(nodo!=null){
            this.pos_orden(nodo.izquierda);
            this.pos_orden(nodo.derecha);
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerHTML = nodo.valor.dni;
            tr.append(td);
            var td1 = document.createElement("td");
            td1.innerHTML = nodo.valor.nombre_actor;
            tr.append(td1);
            var td2 = document.createElement("td");
            td2.innerHTML = nodo.valor.descripcion;
            tr.append(td2);
            document.getElementById("containerActores").append(tr);         
        }
    }

    graficarABB(){
        var codigodot = "digraph grafica{\n" +
        "rankdir=TB;\n" +
        "node [shape = record, style=filled, fillcolor=seashell2];\n";
        codigodot += this.getCodigoInterno(this.raiz);
        codigodot += "}\n";
        d3.select("#lienzo").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigodot)
    }

    getCodigoInterno(nodo) {
        var etiqueta;
        if(nodo.izquierda==null && nodo.derecha==null){
            etiqueta="nodo"+nodo.valor.dni+" [ label =\""+nodo.valor.dni+"\"];\n";
        }else{
            etiqueta="nodo"+nodo.valor.dni+" [ label =\"<C0>|"+nodo.valor.dni+"|<C1>\"];\n";
        }
        if(nodo.izquierda!=null){
            etiqueta=etiqueta + this.getCodigoInterno(nodo.izquierda) +
               "nodo"+nodo.valor.dni+":C0->nodo"+nodo.izquierda.valor.dni+"\n";
        }
        if(nodo.derecha!=null){
            etiqueta=etiqueta +  this.getCodigoInterno(nodo.derecha) +
               "nodo"+nodo.valor.dni+":C1->nodo"+nodo.derecha.valor.dni+"\n";                    
        }
        return etiqueta;
    } 
}

class Actor{
    constructor(_dni,_nombre_actor,_correo,_descripcion){
        this.dni = _dni
        this.nombre_actor = _nombre_actor
        this.correo = _correo
        this.descripcion = _descripcion
    }
}

function renderABB() {
    arbolabb.graficarABB();
}

function ordenActores() {
    var x = document.getElementById("selectActores").value;
    var parent = document.getElementById("containerActores");
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
    if(x == "inorden"){
        arbolabb.inorden();
    }else if(x == "posorden"){
        arbolabb.posorden();
    }else if(x == "preorden"){
        arbolabb.preorden();
    }
}

// Tabla hash
class TablaHash{
    constructor(){
        this.content = [];
        this.content.length = 20;
    }

    insertar(value){
        var key = value.id_categoria % this.content.length;
        this.add(key, value);
    }

    add(key, value){
        //Insertar
        if(this.content[key] == undefined){
            this.content[key] = value;
        }else{
            var temp = [];
            if(this.content[key].length){
                this.content[key].forEach(element => {
                    temp.push(element);
                });
            }else{
                temp.push(this.content[key]);
            }
            temp.push(value);
            this.content[key] = temp;
        }
        //Aumentar tamano
        var cont = 0;
        this.content.forEach(element => {
            if(element){
                cont++;
            }
            if(cont >= (this.content.length*0.75)){
                //Rehashing
                var temporal = this.content;
                var nuevoTam = this.content.length + 5;
                this.content = [];
                this.content.length = nuevoTam;
                temporal.forEach(element => {
                    if(element.length){
                        element.forEach(element2 => {
                            this.insertar(element2);
                        });
                    }else{
                        this.insertar(element);
                    }
                });
                return false;
            }
        });
    }

    recorrer(){
        this.content.forEach(element => {
            if(element.length){
                element.forEach(element2 => {
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    td.innerHTML = element2.id_categoria;
                    tr.append(td);
                    var td1 = document.createElement("td");
                    td1.innerHTML = element2.company;
                    tr.append(td1);
                    document.getElementById("containerCategoria").append(tr);
                });
            }else{
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.innerHTML = element.id_categoria;
                tr.append(td);
                var td1 = document.createElement("td");
                td1.innerHTML = element.company;
                tr.append(td1);
                document.getElementById("containerCategoria").append(tr);
            }
        });
    }

    graficarHash(){
        var codigodot = "digraph G {\n" +
        "nodesep=.05;\n" +
        "rankdir=LR;\n" +
        "node [shape=record,width=.1,height=.1];\n"+
        "node0 [label = \"";
        for (let index = 0; index < this.content.length-1; index++) {
            codigodot += "<f"+index+"> "+(index+1)+" |";
        }
        codigodot += this.content.length + "\",height=2.5];\n";
        var cont = 0;
        for (let index = 0; index < this.content.length; index++) {
            const element = this.content[index];
            if (element) {
                cont++;
                if(element.length){
                    for (let index2 = 0; index2 < element.length; index2++) {
                        const element2 = element[index2];
                        if (index2==0) {
                            codigodot += "node"+cont+" [label = \"{<n> " + element2.id_categoria + " |<p> }\"];\n";
                            codigodot += "node0:f"+index+" -> node"+cont+":n;\n";
                            cont++;
                        }else{
                            codigodot += "node"+cont+" [label = \"{<n> " + element2.id_categoria + " |<p> }\"];\n";
                            codigodot += "node"+(cont-1)+":p -> node"+cont+":n;\n";
                            cont++;
                        }
                    }
                }else{
                    codigodot += "node"+cont+" [label = \"{<n> " + element.id_categoria + " |<p> }\"];\n";
                    codigodot += "node0:f"+index+" -> node"+cont+":n;\n";
                }
            }
        }
        codigodot += "}\n";
        d3.select("#lienzo").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigodot)
    }

}

class Categoria{
    constructor(_id_categoria,_company){
        this.id_categoria = _id_categoria
        this.company = _company
    }
}

function renderMerkel(){
    blockchain.render_merkel();
}

class Block{
    constructor(timestamp,data,nonce,prev_hash,merkle_r,hash){
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.prev_hash = prev_hash;
        this.merkle_r = merkle_r;
        this.hash = hash;
    }
}

class Merkel{
    constructor(){
        this.merkel_r = null;
        this.datablocks = [];
        this.blockchain = [];
        this.indice = 0;
    }

    generar_bloque(data){
        var prev_hash;

        var date_ob = new Date(Date.now());
        var seconds = ("0" + date_ob.getSeconds()).slice(-2);
        var minutes = ("0" + date_ob.getMinutes()).slice(-2);
        var hours = ("0" + date_ob.getHours()).slice(-2);
        var year = date_ob.getFullYear();
        var date = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        
        var timestamp = year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds;

        if(this.datablocks.length == 0){
            prev_hash = "00";
        }else{
            prev_hash = this.datablocks[this.datablocks.length-1].hash;
        }
        if(this.indice < this.blockchain.length){
            this.blockchain[this.indice] = data;
        }else{
            this.blockchain.push(data);
        }

        this.crear_merkel_r();

        var merkle_r = this.merkel_r.data;
        var nonce = 0;
        var hash = "";

        while(!hash.startsWith("00")){  
            hash = sha256((this.indice)+timestamp+prev_hash+merkle_r+nonce);
            nonce += 1;
        } 

        var n_bloque = new Block(timestamp,data,nonce,prev_hash,merkle_r,hash);
        this.datablocks.push(n_bloque);
        this.indice += 1;
    }

    crear_merkel_r(){
        var exp = 1;
        while(Math.pow(2, exp) < this.blockchain.length){
            exp += 1;
        }
        for(var i = this.blockchain.length; i< Math.pow(2,exp);i++){
            this.blockchain.push("1");
        }
        this.fill_tree(exp);
        this.llenar_hash(this.merkel_r,0);
    }

    fill_tree(exp){
        var raiz = new NodoABB(0);
        this._fill_tree(raiz,exp);
        this.merkel_r = raiz;
    }

    _fill_tree(nodo,e){
        if(e > 0){
            nodo.izq = new NodoABB(0);
            nodo.der = new NodoABB(0);
            this._fill_tree(nodo.izq,e-1);
            this._fill_tree(nodo.der,e-1);
        }
    }

    llenar_hash(nodo,indice){
        if(nodo.izq == null && nodo.der == null){
            nodo.data = sha256(this.blockchain[indice]);
            indice += 1;
            return indice;
        }

        indice = this.llenar_hash(nodo.izq,indice);
        indice = this.llenar_hash(nodo.der,indice);
        nodo.data = sha256(nodo.izq.data+nodo.der.data);
        return indice;
    }

    render_merkel(){
        var codigo_dot = "digraph G{\nlabel=\" Arbol de Merkle \";\n node [shape=record];\n";
        var tmp = this.merkel_r;
        var nodos = "";

        let res = this.generar_grafo(tmp,0,0,nodos);
        codigo_dot += res.dot;
        codigo_dot += "}";

        d3.select("#lienzo").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigo_dot);
    }

    generar_grafo(nodo,padre,actual,dot){
        if(nodo == null){
            return {dot, actual};
        }

        actual += 1;

        dot += "N_"+actual+"[label = \""+nodo.data+"\"];\n";
        
        if(padre != 0){
            dot += "N_"+padre+" -> N_"+actual+";\n";
        }

        let res = this.generar_grafo(nodo.izq,actual,actual,"");
        dot += res.dot;
        let max = res.actual;
        
        let res2 = this.generar_grafo(nodo.der,actual,max,"");
        dot += res2.dot;
        actual = res2.actual;

        return { dot, actual };       
    }


    generar_html(){
        var cont = "";
        for(var i = 0; i<this.datablocks.length;i++){
            cont += `<div class="border border-3" style="margin: 10px;">
                  <div>
                    Bloque: `+i+`
                  </div>
                  <div>
                    <p>Fecha: `+this.datablocks[i].timestamp+`</p>
                    <p>Hash: `+this.datablocks[i].hash+`</p>
                    <p>Nonce: `+this.datablocks[i].nonce+`</p>
                    <p>Hash anterior: `+this.datablocks[i].prev_hash+`</p>
                    <p>Raiz de Merkle: `+this.datablocks[i].merkle_r+`</p>
                    <p>Transacciones: `+this.datablocks[i].data+`</p>   
                  </div>
                </div>`;
        }
        document.getElementById("divBlockchain").innerHTML = cont;
    }
}

function renderHash() {
    tablaHash.graficarHash();
}

function generate_block(){
    blockchain.generar_bloque(peliculas_alquiladas);
    peliculas_alquiladas = "";
    blockchain.generar_html();
}

function cambiar_periodo(){
    var tiempo = document.getElementById("segundos_blockchain").value;
    clearInterval(generacion_de_bloque);
    tiempo_intervalo = tiempo*1000;
    generacion_de_bloque = setInterval(generate_block,tiempo_intervalo);
}

(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }})();

var listaClientes = new Listasimple();
var arbolavl = new AVL();
var arbolabb = new ABB();
var tablaHash = new TablaHash();
var blockchain = new Merkel();
var peliculas_alquiladas = "";
var sesion = null;
var generacion_de_bloque = setInterval(generate_block,300_000);
