// ************************ RANKING DE POSICIONES *************************



"use strict";
// ****** Instancias iniciales de creación de la BDD: ******

const IDBRequest = indexedDB.open("pilotos",1); // Se hace una solicitud usando el objeto "indexedDB" con el método "open()" para crear una BDD indexada. Se guarda el resultado de ésta en la variable “IDBRequest”, pasándole como 1er argumento el nombre de la BDD ("pilotos"), la cual se abre o se crea si no existe, y como 2do se coloca el versionado.
// ***NOTA: la variable NO guarda la BDD ni tampoco es la BDD.***
IDBRequest.addEventListener("upgradeneeded",()=>{ // El evento “upgradeneeded” verifica si la BDD existe o no. Se dispara cuando se requiere una actualización de la BDD, cuando se crea por primera vez o cuando se incrementa la versión de la misma. Dentro de este evento, se definen cambios en la estructura de la BDD, como la creación de object stores.
    const db = IDBRequest.result; // El resultado de la solicitud es la BDD creada. Obtiene una referencia a la BDD abierta una vez que se completa la operación de apertura. Al almacenar esta referencia en la constante "db", se puede utilizar para realizar operaciones adicionales en la BDD, como crear object stores y definir índices.
    db.createObjectStore("alias",{ // Acá para la BDD creada, se crea un almacén de objetos llamado "alias".
        autoIncrement: true
    }); // Con "autoIncrement: true", a medida que se van creando registros este key va aumentando para que no hayan registros con keys repetidas. En lugar de “autoIncrement” se puede usar “keyPath: id” que se puede asociar con identificadores para cada ítem de piloto-vueltas.
});
IDBRequest.addEventListener("success",()=>{  // El evento “success” devuelve que todo salió correctamente, la BDD fue llamada y abierta con éxito.
    console.log("La base de datos ha sido abierta.");
});
IDBRequest.addEventListener("error",()=>{ // El evento “error” devuelve que hubo un error, la BDD fue llamada y no puedo abrirse.
    console.log("Error al abrir la base de datos.");
});



// ****** Declaración de las funciones para cada una de las operaciones CRUD: ******

const createPilot = pilot => {
    const db = IDBRequest.result; // Almacenar el resultado de la solicitud en la constante "db" para luego utilizarla para realizar operaciones adicionales en la BDD.
    const IDBTr = db.transaction("alias","readwrite"); // Para la BDD "pilotos" creada, se abre un método de transacción, en el que se le pasa como 1er argumento el nombre del almacén de datos donde se quiere trabajar y como 2do parámetro en qué modo se lo quiere hacer: "readwrite" o "readonly".
    const objStore = IDBTr.objectStore("alias"); // Para dicha transacción guardar lo del almacén de objetos "alias" en la constante "objStore".
    objStore.add(pilot); // Añadir a la constante que tiene almacenados los objetos el piloto ingresado que es pasado como argumento de la función.
    IDBTr.addEventListener("complete",()=>{ // Cuando se completen las tareas anteriores, mostrar este mensaje.
        console.log("Los datos del piloto han sido agregados correctamente."); // Muestra un mensaje de confirmación en consola.
    });
}; // Para probar, escribir en consola un array: createPilot(["piloto",vueltas])
const readPilots = () => {
    const db = IDBRequest.result; // Almacenar el resultado de la solicitud en la constante "db" para luego utilizarla para realizar operaciones adicionales en la BDD.
    const IDBTr = db.transaction("alias","readonly"); // Para la constante "db", crear una transacción en modo de solo lectura y lo guarda en la constante "IDBTr".
    const objStore = IDBTr.objectStore("alias"); // Para la constante "IDBTr", elegir el almacén de objetos "alias" para guardar el resultado de la transacción la constante "objStore".
    const cursor = objStore.openCursor(); // Se crea un cursor (NO el del mouse) para recorrer todos los elementos del almacén de objetos "objStore" y guardar el resultado en la constante "cursor".
    cursor.addEventListener("success",()=>{
        if (cursor.result) { // Si el cursor obtiene satisfactoriamente un resultado, significa que aún hay elementos por leer.
            console.log(cursor.result.value); // Mostrar el valor del cursor en la consola.
            cursor.result.continue(); // Continuar con la siguiente lectura.
        }
        else { // Si no hay más resultados, significa que todos los elementos han sido leídos.
            console.log("Todos los datos de pilotos han sido leídos correctamente."); // Mostrar mensaje en la consola.
        }
    });
} // Para probar, escribir en consola: readPilots()
const updatePilot = (key,pilot) => { // (Estaba "(key,value)")
    const db = IDBRequest.result; // Almacenar el resultado de la solicitud en la constante "db" para luego utilizarla para realizar operaciones adicionales en la BDD.
    const IDBTr = db.transaction("alias","readwrite"); // Para la BDD "pilotos" creada, se abre un método de transacción, en el que se le pasa como 1er argumento el nombre del almacén de datos donde se quiere trabajar y como 2do parámetro en qué modo se lo quiere hacer: "readwrite" o "readonly".
    const objStore = IDBTr.objectStore("alias"); // Para la constante "IDBTr", elegir el almacén de objetos "alias" para guardar el resultado de la transacción la constante "objStore".
    objStore.put(pilot,key); // Modificar o agregar determinado valor (1er argumento) en determinada clave (2do argumento). Si no existe la clave, crearla. (Estaba (value,key)) Se supone que al tener "autoIncrement: true" no hace falta colocar acá la key porque IndexedDB generará automáticamente una.
    IDBTr.addEventListener("complete",()=>{
        console.log("Los datos del piloto se han modificado correctamente.");
    })
} // Para probar, escribir en consola un array: updatePilot(key,[piloto,vueltas])
const deletePilot = key => {
    const db = IDBRequest.result; // Almacenar el resultado de la solicitud en la constante "db" para luego utilizarla para realizar operaciones adicionales en la BDD.
    const IDBTr = db.transaction("alias","readwrite"); // Para la BDD "pilotos" creada, se abre un método de transacción, en el que se le pasa como 1er argumento el nombre del almacén de datos donde se quiere trabajar y como 2do parámetro en qué modo se lo quiere hacer: "readwrite" o "readonly".
    const objStore = IDBTr.objectStore("alias"); // Para la constante "IDBTr", elegir el almacén de objetos "alias" para guardar el resultado de la transacción la constante "objStore".
    objStore.delete(key); // Eliminar un registro en el almacén de objetos, se le pasa como argumento la clave del registro que se desea eliminar.
    IDBTr.addEventListener("complete",()=>{
        console.log("Los datos del piloto se han eliminado correctamente.");
    })
} // Para probar, escribir en consola: deletePilot(key)