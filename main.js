// ************************ RANKING DE POSICIONES *************************



"use strict";
// ****** Instancias iniciales de creación de la BDD: ******

const IDBRequest = indexedDB.open("pilotos",1); // Se hace una solicitud usando el objeto "indexedDB" con el método "open()" para crear una BDD indexada. Se guarda el resultado de ésta en la variable “IDBRequest”, pasándole como 1er argumento el nombre de la BDD ("pilotos"), la cual se abre o se crea si no existe, y como 2do se coloca el versionado.
// ***NOTA: la variable NO guarda la BDD ni tampoco es la BDD.***
IDBRequest.addEventListener("upgradeneeded",()=>{ // El evento “upgradeneeded” verifica si la BDD existe o no. Se dispara cuando se requiere una actualización de la BDD, cuando se crea por primera vez o cuando se incrementa la versión de la misma. Dentro de este evento, se definen cambios en la estructura de la BDD, como la creación de object stores.
    const db = IDBRequest.result; // El resultado de la solicitud es la BDD creada. Obtiene una referencia a la BDD abierta una vez que se completa la operación de apertura. Al almacenar esta referencia en la constante "db", se puede utilizar para realizar operaciones adicionales en la BDD, como crear object stores y definir índices.
    db.createObjectStore("alias",{ // Acá para la BDD creada, se crea un almacén de objetos llamado "alias".
        autoIncrement: true
    }); // A medida que se van creando registros este key va aumentando para que no hayan registros con keys repetidas. En lugar de “autoIncrement” se puede usar “keyPath” que asocia con nombres.
});
IDBRequest.addEventListener("success",()=>{  // El evento “success” devuelve que todo salió correctamente, la BDD fue llamada y abierta con éxito.
    console.log("La base de datos ha sido abierta.");
});
IDBRequest.addEventListener("error",()=>{ // El evento “error” devuelve que hubo un error, la BDD fue llamada y no puedo abrirse.
    console.log("Error al abrir la base de datos.");
});



// ****** Declaración de una función que abre transacciones: ******

const openTr = (mode,msg) => {
    const db = IDBRequest.result; // Referencia a la BDD para hacer operaciones.
    const IDBTr = db.transaction("alias",mode); // Para la BDD "pilotos" creada, se abre un método de transacción, en el que se le pasa como 1er argumento el nombre del almacén de datos donde se quiere trabajar y como 2do parámetro en qué modo se lo quiere hacer: "readwrite" o "readonly".
    const objStore = IDBTr.objectStore("alias"); // Para dicha transacción guardar lo del almacén de objetos "alias" en la constante "objStore".
    IDBTr.addEventListener("complete",()=>{ // Cuando se completen las tareas anteriores, mostrar este mensaje.
        console.log(msg); // Muestra un mensaje en genérico. Cada función le asigna uno distinto.
    });
    return objStore; // Devuelve la información guardada para luego usarla en algún otro lugar.
};



// ****** Declaración de una función para crear los bloques HTML: ******

const renderRow = pilot => {
    // Acá se crean los elementos HTML que se van a mostrar en la interfaz:
    const moduleItem = document.createElement("DIV");
    const pos = document.createElement("DIV");
    const itemPos = document.createElement("DIV");
    const pilotData = document.createElement("DIV");
    const alias = document.createElement("DIV");
    const laps = document.createElement("DIV");
    // Acá se añaden las clases para los estilos CSS a esos elementos:
    moduleItem.classList.add("module__item");
    pos.classList.add("position");
    itemPos.classList.add("item__position");
    pilotData.classList.add("pilot-data");
    alias.classList.add("alias");
    laps.classList.add("laps");

    moduleItem.appendChild(pos); // Coloca a "pos" como hijo de "moduleItem".
    moduleItem.appendChild(itemPos); // Coloca a "itemPos" como hijo de "moduleItem".
    itemPos.appendChild(pilotData); // Coloca a "pilotData" como hijo de "itemPos".
    pilotData.appendChild(alias); // Coloca a "alias" como hijo de "pilotData".
    pilotData.appendChild(laps); // Coloca a "laps" como hijo de "pilotData".
    
    alias.innerText = pilot.alias;
    laps.innerText = pilot.laps;
    pos.innerText = pilot.position;
    
    alias.setAttribute("contenteditable","true"); // Se le agrega al elemento del "alias" la posibilidad de edición.
    alias.setAttribute("spellcheck","false"); // Desactiva el autocorrector a "alias", para que no aparezca la línea ondulada roja al escribir cuanlquier cosa en los nombres.
    laps.setAttribute("contenteditable","true"); // Se le agrega al elemento del "laps" la posibilidad de edición.
    laps.setAttribute("spellcheck","false"); // Desactiva el autocorrector a "laps", para que no aparezca la línea ondulada roja al escribir cuanlquier cosa en los nombres.
    
    document.querySelector(".module").appendChild(moduleItem);
}



const renderTable = pilots =>{
    // Leer la BDD entera
    // Guardar en un array
    document.querySelector(".module").innerHTML = "";
    // ordenar por cantidad de vueltas de mayor a menor y tomar los primeros 10 del array
    pilots = pilots.sort((a,b)=>{return b.laps - a.laps}).slice(0,10);
    // Arriba estoy reemplazando esto: 
    // pilots = pilots.sort((a,b)=>{
    //     return b.laps - a.laps;
    // });
    // // tomar los primeros 10 del array
    // pilots = pilots.slice(0,10);
    // ejecutar el for con cada fila y pintarla en pantalla.
    pilots.forEach((pilot,index)=>{
        pilot.position = index + 1; // +1 porque empieza en 0.
        renderRow(pilot);
    });
}



// ****** Declaración de la función para el botón "Agregar" piloto: ******

document.querySelector(".add").addEventListener("click",event=>{
    const alias = document.querySelector(".input-alias").value; // El valor que tenga el elemento "input-alias" se asigna a la variable "alias".
    const laps = parseInt(document.querySelector(".input-laps").value); // El valor que tenga el elemento "input-laps" se asigna a la variable "laps".
    if (alias.length > 0 &&
        alias.length <= 20 &&
        laps > 0 &&
        laps <= 20) {
        if (alias != undefined && laps != undefined) {
            createPilot({alias,laps}); // Es lo mismo que poner: {alias: alias,laps: laps}
        }
    } else {
        alert("Por favor, ingrese un nombre de piloto válido y una cantidad de vueltas válida.");
    }
});


// ****** Declaración de las funciones para cada una de las operaciones CRUD: ******

const createPilot = pilot => {
    const IDBData = openTr("readwrite","Los datos del piloto se han agregado correctamente."); // En la información guardada del almacén de objetos, almacenar el retorno de la función "openTr" (transacción abierta en el object store "alias"), a la que se le pasan como parámetros el modo y un mensaje.
    IDBData.add(pilot); // Añadir a la constante que tiene almacenados los objetos el piloto ingresado que es pasado como argumento de la función.
}; // Para probar, escribir en consola un array: createPilot(["piloto",vueltas])

const readPilots = () => {
    const IDBData = openTr("readonly","Los datos de los pilotos se han leído correctamente."); // En la información guardada del almacén de objetos, almacenar el retorno de la función "openTr" (transacción abierta en el object store "alias"), a la que se le pasan como parámetros el modo y un mensaje.
    const cursor = IDBData.openCursor(); // Se crea un cursor (NO el del mouse) para recorrer todos los elementos del almacén de objetos "objStore" y guardar el resultado en la constante "cursor".
    let pilots = [];
    cursor.addEventListener("success",()=>{ // El evento "success" se dispara cuando la operación de lectura del cursor se completa exitosamente.
        if (cursor.result) { // Representa el registro actual que el cursor está apuntando. Si existe (cursor.result no es null ni undefined), significa que hay un registro válido en el cursor, obtiene satisfactoriamente resultados, hay elementos por leer.
            console.log(cursor.result.value); // Mostrar en la consola directamente lo que está en "value" en la BDD, cada valor por el que recorre el cursor lector. 
            pilots.push(cursor.result.value);
            cursor.result.continue(); // Continuar con la siguiente lectura. Después de procesar el registro actual, se llama a "cursor.result.continue()". Esto mueve el cursor al siguiente registro en el almacén de objetos y dispara el evento "success" nuevamente para el siguiente registro. El proceso se repite hasta que no haya más registros disponibles.
        }
        else { // Si "cursor.result" no existe, significa que el cursor ha alcanzado el final del almacén de objetos y no hay más registros para leer. Si no hay más resultados, significa que todos los elementos han sido leídos.
            console.log(`Se encontraron ${pilots.length} pilotos registrados.`); // Mostrar mensaje en la consola.
            renderTable(pilots);
        }
    });
} // Para probar, escribir en consola: readPilots()

const updatePilot = (key,pilot) => {
    const IDBData = openTr("readwrite","Los datos del piloto se han actualizado correctamente."); // En la información guardada del almacén de objetos, almacenar el retorno de la función "openTr" (transacción abierta en el object store "alias"), a la que se le pasan como parámetros el modo y un mensaje.
    IDBData.put(pilot,key); // Modificar un registro en el almacén de objetos, se le pasa como 1er argumento la clave del registro que se desea modificar y como 2do argumento el nuevo valor. Acá en el código se coloca 2do y 1ro, pero cuando se usa es 1ro y 2do, ya que así funciona el método "put()", un poco al revés.
} // Para probar, escribir en consola un array: updatePilot(key,["alias",laps]) <-- Al ejecutarlo se hace así y no al revés como en el seteo en el código.

const deletePilot = key => {
    const IDBData = openTr("readwrite","Los datos del piloto se han eliminado correctamente."); // En la información guardada del almacén de objetos, almacenar el retorno de la función "openTr" (transacción abierta en el object store "alias"), a la que se le pasan como parámetros el modo y un mensaje.
    IDBData.delete(key); // Eliminar un registro en el almacén de objetos, se le pasa como argumento la clave del registro que se desea eliminar.
} // Para probar, escribir en consola: deletePilot(key)


