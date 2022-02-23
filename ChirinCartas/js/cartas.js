/******************************/
/***PARAMETROS PARA EL JUEGO*****/
var oJuego = new Object(); //instanciamos un nuevo objeto
oJuego.extension = ".png"; //extensiÃ³n para TODAS las imagenes
oJuego.ruta = "img/"; //directorio dÃ³nde seguardan las imagenes
oJuego.pulsada = new Array(0, 0); //array para guardar las parejas de cartas al pulsar
oJuego.intentos = 0; //contador de intentos
oJuego.aciertos = 0; //contador de aciertos
let barra_informativa = document.getElementById("mensaje");
const aImagenes = new Array(); //array para guardar las imagenes
var enPausa = false; //pause para esperar a pulsar la segunda carta
/********************************/

/************FUNCIONES***********/
//FunciÃ³n para cargar todas las imagenes. Le damos un tamaÃ±o de 100x100
//Guardamos cada imagen dentro del array para guardar las imagenes
function cargarImagenes() {
    for (i = 0; i < MAXIMO_FICHAS; i++) {
        aImagenes[i] = new Image(100, 100);
        aImagenes[i].src = oJuego.ruta + i + oJuego.extension;
        aImagenes[i].alt = i;
    }

}

/*********************************/

//functiÃ³n para pintar en la pÃ¡gina el tablero
//por defecto se muestra en todas la celdas la imagen llamada cruz.png
//se guardan todos los elementos de la tabla dentro de la variable salida
//que se muestra al final de la funciÃ³n.
function mostrarTablero() {

    //mostramos los contadores
    $("#movimientos").html(oJuego.intentos);
    $("#aciertos").html(oJuego.aciertos);


    var salida = "";

    for (i = 0; i < MAXIMO_FICHAS; i++) {
        salida +=
            '<div class="col-6 col-md-4 col-lg-3 mt-2"><div class="card-body"><img class="cartaza" style="width:140px;height:180px;margin:auto;border:2px solid white;border-radius:15px;" id="' + i + '" src="' + oJuego.ruta + "cruz" + oJuego.extension + '" ></div></div>';
    }

    $("#tablero").html(salida);
    $(".cartaza").mousedown(mostrar);
    $(".cartaza").mouseup(comprobar);
}

function mostrarTableroPista() {
    oJuego.aciertos = 0;
    var salida = "";

    for (i = 0; i < MAXIMO_FICHAS; i++) {
        salida +=
            '<div id="prueba" class="col-6 col-md-4 col-lg-3 mt-2"><div class="card-body"><img  style="width:140px;height:180px;margin:auto;border:2px solid white;border-radius:15px;"  src="' + aImagenes[oJuego.cartas[i]].src + '" ></div></div>';
    }

    $("#tablero").html(salida);
    setTimeout(mostrarTablero, 4000);
    $('#btnMostrar').hide();
    $('#barra').css('width', 1 + '%');
    $("#barra").html("0%");
}

/*********************************/

//functiÃ³n para empezar y establecer los parÃ¡metros antes de mostrar el tablero
function empezarJuego() {
    var nUno, nDos, nTemp;
    oJuego.pulsada = new Array(-1, -1); //iniciamos en -1 para solo poder usar las posiciones 1 y 0
    oJuego.intentos = 0;
    oJuego.aciertos = 0;

    // ordenar array ()
    oJuego.cartas = new Array(MAXIMO_FICHAS)
    for (i = 0; i < MAXIMO_FICHAS; i++) {
        oJuego.cartas[i] = i;
    }

    // desordenar el array()
    i = 100;
    while (i--) {
        nUno = azar(); //aleatorio para separar las parejas
        nDos = azar(); //aleatorio para separar la pareja de la anterior
        if (nDos != nUno) { //establecemos el orden
            nTemp = oJuego.cartas[nUno]
            oJuego.cartas[nUno] = oJuego.cartas[nDos]
            oJuego.cartas[nDos] = nTemp;
        }
    }

    mostrarTablero(); //mostramos el tablero gracias a la funciÃ³n mostrarTablero
}

function reestablecer() {
    oJuego.pulsada = new Array(-1, -1); //iniciamos en -1 para solo poder usar las posiciones 1 y 0
    oJuego.aciertos = 0;

    mostrarTablero();//modo fácil
}

function reestablecerDificil() {
    oJuego.pulsada = new Array(-1, -1); //iniciamos en -1 para solo poder usar las posiciones 1 y 0
    oJuego.aciertos = 0;

    oJuego.cartas = new Array(MAXIMO_FICHAS)
    for (i = 0; i < MAXIMO_FICHAS; i++) {
        oJuego.cartas[i] = i;
    }

    // desordenar el array()
    i = 100;
    while (i--) {
        nUno = azar(); //aleatorio para separar las parejas
        nDos = azar(); //aleatorio para separar la pareja de la anterior
        if (nDos != nUno) { //establecemos el orden
            nTemp = oJuego.cartas[nUno]
            oJuego.cartas[nUno] = oJuego.cartas[nDos]
            oJuego.cartas[nDos] = nTemp;
        }
    }

    mostrarTablero();//modo fácil
}

/*********************************/

// funciones varias para el juego
function azar() {
    return Math.floor(Math.random() * MAXIMO_FICHAS);
}

/*********************************/

//función para comprobar si se han pulsado una o dos cartas
function soloImpar(n) {
    return (n % 2 == 0 ? n : n - 1);
}

/*********************************/

//función para mostrar cada una de las imagenes
function mostrar(e) {
    let nFicha = e.target.id;
    if (!enPausa) {
        //buscamos la imagen en el array
        if (document.images[nFicha].src.indexOf(oJuego.ruta + "cruz" + oJuego.extension) != -1) {
            document.images[nFicha].src = aImagenes[oJuego.cartas[nFicha]].src;

            if (oJuego.pulsada[0] == -1) {
                oJuego.pulsada[0] = nFicha;

                var cambiar = new Audio('audio/cambiar.mp3');
                $(e.target).fadeOut(1);
                $(e.target).fadeIn(700);



                cambiar.play();
            }
            else {
                oJuego.pulsada[1] = nFicha;
                $(e.target).fadeOut(1);
                $(e.target).fadeIn(700);
            }
        } else {
            //en caso de que se pulse una imagen ya girada	
            alert("¡¡Exclusiva!!. Tienes que seleccionar otra carta ... !!");
        }
    }
}

/*********************************/

//función para volver a dar la vuelta a las cartas

/*********************************/

function comprobar(e) {
    var url = new URL(e.target.src);
    console.log(url.toString());
    if (url.pathname == "/img/14.png") {
        oJuego.intentos++;
        dificultad = $('input[name=dificultad]:checked').val();
        if (dificultad == "medio") {
            reestablecer();
            barraInformativaTexto("message_bomb");
            var bomba = new Audio('audio/bomba.mp3');
            bomba.play();
            $('#barra').css('width', 1 + '%');
            $("#barra").html("0%");
        } else if (dificultad == "dificil") {
            reestablecerDificil();
            barraInformativaTexto("message_bomb");
            var bomba = new Audio('audio/bomba.mp3');
            bomba.play();
            $('#barra').css('width', 1 + '%');
            $("#barra").html("0%");
        }
    }
    $("#mensaje").html("");
    // comprobar dos teclas	
    if (enPausa || oJuego.pulsada[1] == -1) {
        return;
    }



    if (soloImpar(oJuego.cartas[oJuego.pulsada[0]]) != soloImpar(oJuego.cartas[oJuego.pulsada[1]])) {
        oJuego.intentos++; //aÃ±adimos uno al contador
        var error = new Audio('audio/error.mp3');
        barraInformativaTexto("message_mistake");

        error.play();
    }

    //en caso de acertar 
    if (soloImpar(oJuego.cartas[oJuego.pulsada[0]]) == soloImpar(oJuego.cartas[oJuego.pulsada[1]])) {

        ////////////////Si las cartas coinciden les aplicamos el estilo de la clase cartasAcertadas
        document.images[oJuego.pulsada[0]].className = "cartasAcertadas";
        document.images[oJuego.pulsada[1]].className = "cartasAcertadas";

        ////////Mostramos el mensaje de acierto/////////////////////////
        barraInformativaTexto("message_success");
        oJuego.aciertos++; //añadimos uno al contador aciertos
        dificultad = $('input[name=dificultad]:checked').val();
        if(dificultad=="facil"){
            if (oJuego.aciertos == 1) {
                $("#barra").html("16,5%");
                $('#barra').css('width', 17 + '%');
            } else if (oJuego.aciertos == 2) {
                $("#barra").html("33%");
                $('#barra').css('width', 34 + '%');
            } else if (oJuego.aciertos == 3) {
                $("#barra").html("50%");
                $('#barra').css('width', 51 + '%');
            } else if (oJuego.aciertos == 4) {
                $("#barra").html("68%");
                $('#barra').css('width', 68 + '%');
            } else if (oJuego.aciertos == 5) {
                $("#barra").html("85%");
                $('#barra').css('width', 85 + '%');
            } else if (oJuego.aciertos == 6) {
                $("#barra").html("100%");
                $('#barra').css('width', 100 + '%');
            }
        }else if(dificultad == "medio" || dificultad == "dificil"){
            if (oJuego.aciertos == 1) {
                $("#barra").html("14,5%");
                $('#barra').css('width', 14 + '%');
            } else if (oJuego.aciertos == 2) {
                $("#barra").html("29%");
                $('#barra').css('width', 29 + '%');
            } else if (oJuego.aciertos == 3) {
                $("#barra").html("43,5%");
                $('#barra').css('width', 43 + '%');
            } else if (oJuego.aciertos == 4) {
                $("#barra").html("58%");
                $('#barra').css('width', 57 + '%');
            } else if (oJuego.aciertos == 5) {
                $("#barra").html("72,5%");
                $('#barra').css('width', 71 + '%');
            } else if (oJuego.aciertos == 6) {
                $("#barra").html("87%");
                $('#barra').css('width', 86 + '%');
            } else if (oJuego.aciertos == 7) {
                $("#barra").html("100%");
                $('#barra').css('width', 100 + '%');
            }

        }
        

        var victoria = new Audio('audio/victoria.mp3');

        victoria.play();
        dificultad = $('input[name=dificultad]:checked').val();
        if (dificultad == "facil") {
            if (oJuego.aciertos * 2 == 12) {
                barraInformativaTexto("message_victory");
                alert("Qué noshe hijo, que noshe ... y solo has fallado" + oJuego.intentos + " veces\nComo premio has conseguido un puesto de becario!!!");
                ///////Guardamos en localStorage los intentos y el nombre del mejor jugador
                comprobarRanking();
                location.reload();
            }
            oJuego.pulsada[0] = -1;
            oJuego.pulsada[1] = -1;
        } else {
            if (oJuego.aciertos * 2 == 14) {
                //mensaje de final de juego
                barraInformativaTexto("message_victory");
                alert("Qué noshe hijo, que noshe ... y solo has fallado" + oJuego.intentos + " veces\nComo premio has conseguido un puesto de becario!!!");
                ///////Guardamos en localStorage los intentos y el nombre del mejor jugador
                comprobarRanking();
                location.reload();
            }
            oJuego.pulsada[0] = -1;
            oJuego.pulsada[1] = -1;
        }




    } else {
        enPausa = true; //activamos pause
        //barraInformativaTexto("message_mistake");//En caso de fallar muestra este mensaje
        setTimeout(quitarPausa, 1000); //establecemos el pause en 1 segundo para darse la vuelta las imagenes cuando no coincidan
    }

    //mostramos los contadores
    $("#movimientos").html(oJuego.intentos);
    $("#aciertos").html(oJuego.aciertos);
}

function quitarPausa() {
    enPausa = false;
    document.images[oJuego.pulsada[0]].src = "img/cruz.png";
    document.images[oJuego.pulsada[1]].src = "img/cruz.png";

    // volver las teclas 
    oJuego.pulsada[0] = -1;
    oJuego.pulsada[1] = -1;
}


/*********************************/
function cambiarTextoIdioma(e) {
    // Guarda en el web storage el idioma
    localStorage.setItem("idioma", e.target.textContent);
    loadLanguage();
}

function btnEmpezar() {
    const nombre = $('#nomUsu').val();
    let dificultad = "";
    dificultad = $('input[name=dificultad]:checked').val();
    if (dificultad == "facil") {
        oJuego.columnas = 4;
        oJuego.filas = 3;
    } else if (dificultad == "medio" || dificultad == "dificil") {
        oJuego.columnas = 5;
        oJuego.filas = 3;
    }
    $('#nombre').html(nombre);


    MAXIMO_FICHAS = oJuego.filas * oJuego.columnas; //el mÃ¡ximo de fichas para el tablero
    cargarImagenes();
    empezarJuego();
    bienvenida();
    mostrarTablero();

    ////////////////////////Introducimos el mejor jugador al ranking///////////////////////////////
    cargarRanking();

    //////////////////////Cargamos el lenguaje///////////////////////////////////
    loadLanguage();

    ////////////////////Añadimos los listener//////////////////////////////////////
    $("#esp").click(cambiarTextoIdioma);
    $("#ing").click(cambiarTextoIdioma);
    if (dificultad == "facil") {
        $('#btnMostrar').show();
    }
    $("#btnMostrar").click(mostrarTableroPista);

}
//Evento que al cargarse la ventana carga las funciones cargarImagenes, empezarJuego y cargar el reloj
window.onload = function () {
    $("#btnEmpezar").click(btnEmpezar);
    loadLanguage();
    $('#btnMostrar').hide();


    ////////////////////Añadimos los listener//////////////////////////////////////
    $("#esp").click(cambiarTextoIdioma);
    $("#ing").click(cambiarTextoIdioma);
}

function cargarRanking() {
    // Carga la lista de mejores jugadores guardado en localStorage
    let rankingJugadores = getRanking();

    let celdas = "";

    // Por cada jugador de la lista crea una fila para la tabla
    rankingJugadores.forEach(jugador => {
        celdas += `
                <tr>
                    <td class="table-warning">${jugador.nombre}</td>
                    <td class="table-success"><i class="fa-solid fa-check"></i>     ${jugador.puntos}</td>
                </tr>
            `
    });

    // Carga la tabla
    $("#jugadores").html(celdas);
}

function comparadorPorPuntos(a, b) {
    if (a.puntos < b.puntos) {
        return -1;
    }

    if (a.puntos > b.puntos) {
        return 1;
    }

    return 0;
}

function getRanking() {
    // Si el ranking no existe, crea uno predeterminado
    if (localStorage.getItem("ArrayRanking") == null) {
        let arrayRanking = [{
                "nombre": "Jugador 1",
                "puntos": 10
            },
            {
                "nombre": "Jugador 2",
                "puntos": 20
            },
            {
                "nombre": "Jugador 3",
                "puntos": 40
            },
            {
                "nombre": "Jugador 4",
                "puntos": 60
            },
            {
                "nombre": "Jugador 5",
                "puntos": 80
            },
        ]

        // Guarda este array de objetos en localStorage
        localStorage.setItem("ArrayRanking", JSON.stringify(arrayRanking));
    }

    return JSON.parse(localStorage.getItem("ArrayRanking"));
}

function comprobarRanking() {
    let rankingJugadores = getRanking();

    // Añade nuestra puntuación y nombre a la lista
    rankingJugadores.push({
        "nombre": $('#nomUsu').val(),
        "puntos": oJuego.intentos
    })

    // Ordenamos la lista de jugadores según sus puntos
    rankingJugadores.sort(comparadorPorPuntos);

    // Si la lista supera los 5 elementos, removemos el último
    if (rankingJugadores.length == 6) {
        rankingJugadores.pop();
    }

    // Guarda este array de objetos en localStorage
    localStorage.setItem("ArrayRanking", JSON.stringify(rankingJugadores));

    // Vuelve a cargar el ranking
    cargarRanking();
}

/***************************************/
//Función de bienvenida
function bienvenida() {
    alert("Bienvenid@ a las ChirinCartas\nBusca las parejas de los tertulianos del Chiringuito\n y gánate un puesto de becario.\n¡Pero qué locura es esta!\nDificultad: " + $('input[name=dificultad]:checked').val());
}


