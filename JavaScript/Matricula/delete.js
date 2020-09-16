firebase.initializeApp({
    apiKey: 'AIzaSyAGJXiiSMXGBFJcqNMdXSmzmteuuU1KXAU',
    authDomain: 'proyectosoa2020bcolegio.firebaseio.com',
    projectId: 'proyectosoa2020bcolegio'
  });
  
  var db = firebase.firestore();

  

  function buscarcod(){
    var tablaBuscar = document.getElementById('tab-view');
    var codigo = parseInt(document.getElementById('codigo').value);

    var valuestate="";
    tablaBuscar.innerHTML = '';
    db.collection("Matricula").where("pkEstudiante", "==", codigo)
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
                <th><button class="btn btn-danger" onclick="eliminar('${doc.id}')"><i class="fas fa-trash-alt"></i></button></th>
            </tr>
        `;
        });
        if(querySnapshot.size == 0){
            swal({
                title: "No Se encontro Registro!",
                text: "No hay datos con este codigo!",
                icon: "info",
                button: "Ok!",
              });
        }
    })
    .catch(function(error) {
       
    });
}




function eliminar(id) {
    var alert = document.getElementById('alertad');
    swal({
        title: "Estas Seguro de eliminar?",
        text: "Si eliminas el registro no se podra recuperar!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            db.collection("Matricula").doc(id).delete().then(function() {
                    //console.log("Document successfully deleted!");
                }).catch(function(error) {
                    //console.error("Error removing document: ", error);
                });
          swal("Poof! Se ha eliminado el Registro!", {
            icon: "success",
          });
          buscarcod();

        } else {
          swal("Tranquilo nada se ha borrado!");
        }
      });
}