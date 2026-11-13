const textoUsuario = document.getElementById("textoUsuario");
const botonConvertir = document.getElementById("btnConvertir");
const avatarContenedor = document.getElementById("avatar-contenedor");

const senasDisponibles = {
    hola: {
        nombre: "Hola"
    },

    gracias: {
        nombre: "Gracias"
    },

    adios: {
        nombre: "Adiós"
    }

};

botonConvertir.addEventListener("click", function() {

    const textoIngresado = textoUsuario.value.trim().toLowerCase();

    if (textoIngresado === ""){
        avatarContenedor.innerHTML = "<p>Escribe una palabra o frase primero: </p>";
        return;
    }

    const senaDisponible = senasDisponibles[textoIngresado];
    if (senaDisponible) {

        if(textoIngresado === "hola") {

            avatarContenedor.innerHTML = `
                <p>Seña encontrada: </p>
                <img src="../img/avatar-hola.png" alt="Avatar realizando la seña Hola">
                <h2>${senaDisponible.nombre}</h2>
            `;
        }

    }else{

        avatarContenedor.innerHTML = `
           <p>Por ahora no tenemos una seña para:</p>
           <h2>${textoIngresado}</h2>
        `;
    }

});
