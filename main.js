// Variables

const btn = document.querySelector("#btn");
const nombre = document.querySelector("#nombre");
const email = document.querySelector("#correo");
const pass = document.querySelector("#pass");
const form = document.querySelector("#form");
const div = document.querySelector(".db")

const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// magia
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", iniciarApp)

    nombre.addEventListener("blur", validarForm);
    email.addEventListener("blur", validarForm);
    pass.addEventListener("blur", validarForm);

    form.addEventListener("submit", enviarEmail);
}



// Funciones
function iniciarApp() {
    btn.disabled = true;
    btn.classList.add("cursor-not-allowed", "opacity-50")
}

function validarForm(e) {
    if (e.target.value.length > 0) {

        // elimina los errores
        const error = document.querySelector("p.error");
        if (error) {
            error.remove();
        }



        e.target.classList.remove("border", "border-red-500");
        e.target.classList.add("border", "border-green-500");



    } else {
        e.target.classList.remove("border", "border-green-500");
        e.target.classList.add("border", "border-red-500");

        mostrarError("Todos los campos son obligatorios");
    }

    if (e.target.type === "email") {
        if (er.test(e.target.value)) {
            const error = document.querySelector("p.error");
            if (error) {
                error.remove();
            }

            e.target.classList.remove("border", "border-red-500");
            e.target.classList.add("border", "border-green-500");

        } else {
            e.target.classList.remove("border", "border-green-500");
            e.target.classList.add("border", "border-red-500");
            mostrarError("Email no válido");
        }

    }

    if (nombre.value !== "" && er.test(email.value) && pass.value !== "") {
        btn.disabled = false;
        btn.classList.remove("cursor-not-allowed", "opacity-50")
        btn.classList.add("cursor-pointer", "hover:bg-purple-700")
    } else {
        btn.classList.remove("cursor-pointer", "hover:bg-purple-700")
        btn.disabled = true;
        btn.classList.add("cursor-not-allowed", "opacity-50")

    }

}






function mostrarError(mensaje) {
    const mError = document.createElement("P");
    mError.textContent = mensaje;
    mError.classList.add("border", "border-red-500", "text-red-500", "p-3", "mt-2", "text-center", "error")

    const errores = document.querySelectorAll(".error")
    if (errores.length === 0) {
        form.appendChild(mError);
    }


}


function enviarEmail(e) {
    e.preventDefault();


    // Mostrar el spinner
    const spinner = document.querySelector("#spinner-2");
    spinner.style.display = "flex";


    // Se oculta desp de 3 seconds

    setTimeout(() => {
        spinner.style.display = "none"

        // Mensaje q dice q esta perfect

        const parrafo = document.createElement("P")
        parrafo.textContent = "El formulario se envio correctamente"
        parrafo.classList.add("text-center", "my-10", "p-2", "bg-green-500", "text-white", "font-bold", "uppercase")

        // Insertar el parrafo antes del spinner
        form.insertBefore(parrafo, spinner);

        setTimeout(() => {
            parrafo.remove();

            resetearForm();
        }, 5000)

    }, 3000)
}

function resetearForm() {
    form.reset();

    iniciarApp();
}

// DB

const indexedDB = window.indexedDB;

if (indexedDB) {
    let db;
    const peticion = indexedDB.open("Form", 1);

    // Al ir todo bien
    peticion.onsuccess = () => {
        db = peticion.result;
        console.log("Abierto", db)
        readData()
    }

    // Al actualizar
    peticion.onupgradeneeded = () => {
        db = peticion.result;
        console.log("Creado!", db)
        const objectStore = db.createObjectStore("Form", {
            autoIncrement: true
        })
    }
    // Si hubo un error
    peticion.onerror = () => {
        console.log("Hubo un error")
    }

    // Añadimos los datos al objectStore
    const addData = (data) => {
        const transaction = db.transaction(["Form"], "readwrite")
        const objectStore = transaction.objectStore("Form")
        const peticion = objectStore.add(data)
        readData()
    }

    // Leemos los datos y los imprimos en el HTML
    const readData = () => {
        const transaction = db.transaction(["Form"], "readwrite");
        const objectStore = transaction.objectStore("Form");
        const peticion = objectStore.openCursor();
        const fragment = document.createDocumentFragment()

        peticion.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                
                
                const nombre = document.createElement("p");
                nombre.innerHTML = `<br> Nombre:   ${cursor.value.nombre} ` 
                fragment.appendChild(nombre)
                const email = document.createElement("p");
                email.innerHTML = `Email:   ${cursor.value.email} ` 
                fragment.appendChild(email)
                const pass = document.createElement("p");
                pass.innerHTML = `Contraseña:   ${cursor.value.pass} `
                fragment.appendChild(pass)
             
                
              
               
                cursor.continue()
                
               
            } else{
                div.textContent = ''
                div.appendChild(fragment)
                
             
            }
        }
    }



    // Cuando el demos enviar, quiero que me muestres los datos
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = {
            nombre: e.target.nombre.value,
            email: e.target.email.value,
            pass: e.target.pass.value
        }
        // Llamamos la funcion addData para que pase el parametro de data 
        addData(data)
    })
}


