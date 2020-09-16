// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyAGJXiiSMXGBFJcqNMdXSmzmteuuU1KXAU',
    authDomain: 'proyectosoa2020bcolegio.firebaseio.com',
    projectId: 'proyectosoa2020bcolegio'
  });
  
  var db = firebase.firestore();




function buscardoc(){
    var tablaBuscar = document.getElementById('tab-view');
    var documento = parseInt(document.getElementById('codigoEst').value);
    var alert = document.getElementById('alertabus');
    var valuestate="";
    tablaBuscar.innerHTML = '';
    db.collection("Matricula").where("pkEstudiante", "==", documento)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if(doc.data().estado == 0){
                valuestate = "Matriculado";
            }else if(doc.data().estado == 1){
                valuestate = "Cursando";
            }else if(doc.data().estado == 2){
                valuestate = "Reprobado";
            }else if(doc.data().estado == 3){
                valuestate = "Aprobado";
            }
            tablaBuscar.innerHTML +=  `
            <tr>
                <th>${doc.id}</th>
                <th>${doc.data().pkEstudiante}</th>
                <th>${doc.data().pkMateria}</th>
                <th>${doc.data().notaDefinitiva}</th>
                <th>${doc.data().fechaInscripcion}</th>
                <th>${doc.data().fechaFinal}</th>
                <th>${doc.data().fechaInicio}</th>
                <th>${valuestate}</th>
            </tr>
        `;
        });
        
    })
    .catch(function(error) {
       
    });
}

function buscarestate(){
    var tablaBuscar = document.getElementById('tab-view');
    var estado = parseInt(document.getElementById('estado').value);
    var alert = document.getElementById('alertabus');
    var valuestate="";
    tablaBuscar.innerHTML = '';
    db.collection("Matricula").where("estado", "==", estado)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if(doc.data().estado == 0){
                valuestate = "Matriculado";
            }else if(doc.data().estado == 1){
                valuestate = "Cursando";
            }else if(doc.data().estado == 2){
                valuestate = "Reprobado";
            }else if(doc.data().estado == 3){
                valuestate = "Aprobado";
            }
            tablaBuscar.innerHTML +=  `
            <tr>
                <th>${doc.id}</th>
                <th>${doc.data().pkEstudiante}</th>
                <th>${doc.data().pkMateria}</th>
                <th>${doc.data().notaDefinitiva}</th>
                <th>${doc.data().fechaInscripcion}</th>
                <th>${doc.data().fechaFinal}</th>
                <th>${doc.data().fechaInicio}</th>
                <th>${valuestate}</th>
            </tr>
        `;
        });
        
    })
    .catch(function(error) {
       
    });
}