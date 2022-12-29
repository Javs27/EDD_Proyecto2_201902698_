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
    //insertar recursivo
    add(valor, nodo){
        if(nodo == null) return new NodoAVL(valor);
        else{
            if(valor.nombre_pelicula < nodo.valor.nombre_pelicula){
                nodo.izquierda = this.add(valor, nodo.izquierda)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda) == -2){
                    //programar los casos 
                    //rsi
                    if(valor.nombre_pelicula < nodo.izquierda.valor.nombre_pelicula){
                        nodo = this.rotacionizquierda(nodo);
                    }//rdi}
                    else{
                        nodo = this.Rotaciondobleizquierda(nodo);
                    }
                    
                }
            }else if(valor.nombre_pelicula > nodo.valor.nombre_pelicula){
                nodo.derecha = this.add(valor, nodo.derecha);
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda)== 2){
                    //otros dos casos
                    //rotacion simple derecha
                    if(valor.nombre_pelicula > nodo.derecha.valor.nombre_pelicula){
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
        nodo.altura = this.MAXIMO(this.altura(nodo.derecha),this.altura(nodo.izquierda))+1;
        aux.altura = this.MAXIMO(this.altura(nodo.izquierda), nodo.altura)+1;
        return aux;
    }
    //rotacion simple derecha
    rotacionderecha(nodo){
        var aux = nodo.derecha;
        nodo.derecha = aux.izquierda;
        aux.izquierda = nodo;
        //calcular de nuevo altura
        nodo.altura = this.MAXIMO(this.altura(nodo.derecha),this.altura(nodo.izquierda))+1;
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
            etiqueta="nodo"+nodo.valor.id_pelicula+" [ label =\""+nodo.valor.nombre_pelicula+"\"];\n";
        }else{
            etiqueta="nodo"+nodo.valor.id_pelicula+" [ label =\"<C0>|"+nodo.valor.nombre_pelicula+"|<C1>\"];\n";
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

class Pelicula{
    constructor(_id_pelicula,_nombre_pelicula,_descripcion,_puntuacion_star,_precion_Q,_paginas,_categoria){
        this.id_pelicula = _id_pelicula
        this.nombre_pelicula = _nombre_pelicula
        this.descripcion = _descripcion
        this.puntuacion_star = _puntuacion_star
        this.precion_Q = _precion_Q
        this.paginas = _paginas
        this.categoria = _categoria
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
            etiqueta="nodo"+nodo.valor.dni+" [ label =\""+nodo.valor.nombre_actor+"\"];\n";
        }else{
            etiqueta="nodo"+nodo.valor.dni+" [ label =\"<C0>|"+nodo.valor.nombre_actor+"|<C1>\"];\n";
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

function renderHash() {
    tablaHash.graficarHash();
}

var listaClientes = new Listasimple();
var arbolavl = new AVL();
var arbolabb = new ABB();
var tablaHash = new TablaHash();