// ************************ RANKING DE POSICIONES *************************



// ****** Instancias iniciales de creación de la BDD: ******

const IDBRequest = indexedDB.open("pilotos",1);
IDBRequest.addEventListener("upgradeneeded",()=>{
    const db = IDBRequest.result;
    db.createObjectStore("nombres",{
        autoIncrement: true
    })
});
IDBRequest.addEventListener("success",()=>{
    console.log("La base de datos ha sido abierta.");
});
IDBRequest.addEventListener("error",()=>{
    console.log("Error al abrir la base de datos.");
});
