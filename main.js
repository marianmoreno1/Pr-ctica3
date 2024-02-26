let cuentaCorrectas = 0;
let categoriaSeleccionada;
let respuestaCorrecta;
let paises = [];


document.addEventListener('DOMContentLoaded', async () => {
    // Utilizando async/await para la petición fetch
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        paises = await response.json();
    } catch (error) {
        console.error("No se pudieron cargar los países", error);
    }

    document.getElementById('jugar').addEventListener('click', () => {
        if (paises.length > 0) {
            

            const indiceAleatorio = Math.floor(Math.random() * paises.length);
            const paisSeleccionado = paises[indiceAleatorio];
            categoriaSeleccionada = document.getElementById('categoria').value;
            let textoCategoria;
            let respuestaCorrecta;
            let opcionesIncorrectas = [];


            if (categoriaSeleccionada === 'capital') {
                textoCategoria = 'la capital';
                respuestaCorrecta = paisSeleccionado.capital;
            } else if (categoriaSeleccionada === 'bandera') {
                textoCategoria = 'la bandera';
                respuestaCorrecta = paisSeleccionado.flags.png;
            } else if (categoriaSeleccionada === 'idioma') {
                textoCategoria = 'el idioma';
                respuestaCorrecta = Object.values(paisSeleccionado.languages)[0];
            } else {
                textoCategoria = '[categoria]';
            }

            opcionesIncorrectas = generarOpcionesIncorrectas(paises, respuestaCorrecta, categoriaSeleccionada);


            mostrarOpciones(respuestaCorrecta, opcionesIncorrectas);
            // Hacer visible la sección de la pregunta si está oculta
            document.getElementById('texto-pregunta').innerText = `¿Cuál es ${textoCategoria} del país ${paisSeleccionado.name.common}?`;
            document.getElementById('pregunta').classList.remove('hidden');
            document.getElementById('cuenta').innerText = `Cuenta: ${cuentaCorrectas}`;
            document.getElementById('cuenta').classList.remove('hidden');

        } else {
            console.error("No se pudieron cargar los países");
        }
    });


    document.getElementById('reiniciar').addEventListener('click', () => {
        document.getElementById('pregunta').classList.add('hidden');
        document.getElementById('reiniciar').classList.add('hidden');
        document.getElementById('cuenta').classList.add('hidden');
        cuentaCorrectas = 0;
        document.getElementById("cuenta").innerText = `¿Cuenta ${cuentaCorrectas}`;;

    });
});


function mostrarOpciones(respuestaCorrecta, opcionesIncorrectas) {
    // Obtiene todos los contenedores de opciones existentes
    //let contenedoresOpciones = document.querySelectorAll('#opciones .opcion');
    const contenedorOpciones = document.getElementById('opciones');
    contenedorOpciones.innerHTML = ''; // Limpia todo el contenedor de opciones
    
    // Mezclar todas las opciones
    let todasLasOpciones = [respuestaCorrecta, ...opcionesIncorrectas];
    todasLasOpciones.sort(() => Math.random() - 0.5);

    todasLasOpciones.forEach(opcion => {
        const elementoOpcion = document.createElement('div');
        elementoOpcion.classList.add('opcion');

        if (opcion.includes("http")) {
            const img = document.createElement('img');
            img.src = opcion;
            img.alt = "Bandera";
            img.classList.add('flag-image');
            elementoOpcion.appendChild(img);
        } else {
            elementoOpcion.textContent = opcion;
        }

        // Añade el manejador de eventos directamente al nuevo elemento
        elementoOpcion.addEventListener('click', (event) => {
            verificarRespuesta(opcion, respuestaCorrecta, event);
        });

        contenedorOpciones.appendChild(elementoOpcion);
    });
}


const generarOpcionesIncorrectas = (paises, respuestaCorrecta, categoriaSeleccionada) => {
    let opcionesIncorrectas = [];
    let indicesElegidos = [paises.indexOf(respuestaCorrecta)]; // Asume que puedes identificar el índice del país correcto

    while (opcionesIncorrectas.length < 3) {
        let indiceAleatorio = Math.floor(Math.random() * paises.length);
        if (!indicesElegidos.includes(indiceAleatorio)) {
            let opcionIncorrecta = paises[indiceAleatorio];
            let valorIncorrecto;

            if (categoriaSeleccionada === 'capital') {
                valorIncorrecto = opcionIncorrecta.capital;
            } else if (categoriaSeleccionada === 'bandera') {
                valorIncorrecto = opcionIncorrecta.flags.png;
            } else if (categoriaSeleccionada === 'idioma') {
                valorIncorrecto = Object.values(opcionIncorrecta.languages)[0];
            }

            if (valorIncorrecto && !opcionesIncorrectas.includes(valorIncorrecto)) {
                opcionesIncorrectas.push(valorIncorrecto);
                indicesElegidos.push(indiceAleatorio);
            }
        }
    }

    return opcionesIncorrectas;
}


function verificarRespuesta(opcionSeleccionada, respuestaCorrecta, event) {
    const botonReiniciar = document.getElementById("reiniciar");
    let elementoSeleccionado = event.target;

    if (opcionSeleccionada == respuestaCorrecta) {
        alert('Correcto!');
        // Aquí podrías añadir lógica adicional para manejar una respuesta correcta
        botonReiniciar.classList.remove("hidden");
        elementoSeleccionado.classList.add('correct');
        cuentaCorrectas++;
        document.getElementById('cuenta').innerText = `Cuenta: ${cuentaCorrectas}`; // Actualiza el contador en la página
        
    } else {
        alert('Incorrecto. Intenta de nuevo.');
        // Aquí podrías añadir lógica adicional para manejar una respuesta incorrecta
        elementoSeleccionado.classList.add('incorrect');
    }

}

