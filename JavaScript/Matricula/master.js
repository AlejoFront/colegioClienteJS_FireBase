firebase.initializeApp({
    apiKey: 'AIzaSyAGJXiiSMXGBFJcqNMdXSmzmteuuU1KXAU',
    authDomain: 'proyectosoa2020bcolegio.firebaseio.com',
    projectId: 'proyectosoa2020bcolegio'
  });
  
  var db = firebase.firestore();
  var  date = new Date();
  var fechaactual = date.getFullYear() + "-" + date.getMonth()+ "-" + date.getDay();



  function buscardoc(){
    var tablaBuscar = document.getElementById('tb-est');
    var documento = parseInt(document.getElementById('pkest').value);
    tablaBuscar.innerHTML = '';
    db.collection("Estudiante").where("documento", "==", documento)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            tablaBuscar.innerHTML +=  `
            <tr>
                <th>${doc.data().nombres}</th>
                <th>${doc.data().apellidos}</th>
                <th>${doc.data().correo}</th>
                <th>${doc.data().telefono}</th>
            </tr>
        `;
        });
        
    })
    .catch(function(error) {
       
    });
  }


var cantmat = 0;
var idma= 1;
function buscargrado(){
    var tablaBuscar = document.getElementById('tb-materia');
    var grado = parseInt(document.getElementById('grado').value);
    var btnmatricular = document.getElementById('btnsave');
    btnmatricular.disabled = false;
    tablaBuscar.innerHTML = '';
    db.collection("Materia").where("grado", "==", grado)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            tablaBuscar.innerHTML +=  `
            <tr>
                <th style="display:none;"><input type="checkbox" class="chk" id="${idma++}" value="${doc.data().codigo}">
                </th>
                <th>${doc.data().codigo}</th>
                <th>${doc.data().nombre}</th>
                <th>${doc.data().intensidad_horaria}</th>
            </tr>
        `;
        });
        cantmat = querySnapshot.size;

        
    })
    .catch(function(error) {
        
    });
}




function guardar() {

    var pkEstudiante = parseInt(document.getElementById('pkest').value);
    //var pkMateria = parseInt(document.getElementById('pkmateria').value);
    var fechaInicio = document.getElementById('fechInicio').value;
    var fechFinal = document.getElementById('fechFinal').value;
    var definitiva = 0.0;
    var estado = 0;
    var materia;
    var alert = document.getElementById('alertas');
    var validate = true;

    for(var i=1;i<=cantmat;i++){
        var id = i;
        materia = parseInt(document.getElementById(id).value);
        db.collection("Matricula").add({
            estado: estado,
            fechaFinal: fechFinal,
            fechaInicio: fechaInicio,
            fechaInscripcion: fechaactual,
            notaDefinitiva: definitiva,
            pkEstudiante: pkEstudiante,
            pkMateria: materia
    
        }).then(function(docRef) {
            //console.log("Document written with ID: ", docRef.id);
    
            document.getElementById('pkest').value = '';
            document.getElementById('grado').value = '';
            document.getElementById('fechInicio').value = '';
            document.getElementById('fechFinal').value = '';

    
    
        }).catch(function(error) {
            console.error("Error updating document: ", error);
            alert.innerHTML += `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Lo siento!</strong> No se pudo matricular.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `;
        });
        
    }

    if(validate == true){
        alert.innerHTML += `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Correcto!</strong> Estudiante Matriculado.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `;
    }

  }







// Metodo mostrar

var tabla = document.getElementById('tab-view');
var valuestate="";
db.collection("Matricula").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data().documento}`);
        if(doc.data().estado == 0){
            valuestate = "Matriculado";
        }else if(doc.data().estado == 1){
            valuestate = "Cursando";
        }else if(doc.data().estado == 2){
            valuestate = "Reprobado";
        }else if(doc.data().estado == 3){
            valuestate = "Aprobado";
        }
        tabla.innerHTML +=  `
            <tr>
                 
                 <th>${doc.data().pkEstudiante}</th>
                 <th>${doc.data().pkMateria}</th>
                 <th>${doc.data().notaDefinitiva}</th>
                 <th>${doc.data().fechaInscripcion}</th>
                 <th>${doc.data().fechaFinal}</th>
                 <th>${doc.data().fechaInicio}</th>
                 <th>${valuestate}</th>         
                 <th><button class="btn btn-danger" onclick="eliminar('${doc.id}')"><i class="fas fa-trash-alt"></i></button></th>
                 <th>
                    <button class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" 
                    onclick="editar('${doc.id}','${doc.data().pkEstudiante}',
                    '${doc.data().pkMateria}','${doc.data().notaDefinitiva}',
                    '${doc.data().fechaInscripcion}',
                    '${doc.data().fechaFinal}','${doc.data().fechaInicio}',
                    '${doc.data().estado}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </th>
            </tr>
        `;
        
    });
    //console.log(querySnapshot.size); 

});



function eliminar(id) {
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
        } else {
          swal("Tranquilo nada se ha borrado!");
        }
      });
}

function editar(id, pkEstudiante,pkMateria,notaDefinitiva,fechaInscripcion, fechaFinal,fechaInicio,estado) {
    document.getElementById('editpkest').value = pkEstudiante;
    document.getElementById('editpkmateria').value = pkMateria;
    document.getElementById('editfechInicio').value = fechaInicio;
    document.getElementById('editfechFinal').value = fechaFinal;
    document.getElementById('editNotadef').value = notaDefinitiva;
    document.getElementById('editestado').value = estado;
    var botonupdate = document.getElementById('btnupdate');

    botonupdate.onclick = function(){
        var washingtonRef = db.collection("Matricula").doc(id);
        var codest = parseInt(document.getElementById('editpkest').value);
        var codmat = parseInt(document.getElementById('editpkmateria').value);
        var fechini = document.getElementById('editfechInicio').value;
        var fechfin = document.getElementById('editfechFinal').value;
        var fechins = fechaInscripcion;
        var notdef = parseFloat(document.getElementById('editNotadef').value);
        var estate = parseInt(document.getElementById('editestado').value);
        var alert = document.getElementById('alertau');
        swal({
            title: "Estas Seguro de Actualizar el registro?",
            text: "Debes estar seguro Actualizar el registro!",
            icon: "info",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                return washingtonRef.update({
                    estado: estate,
                    fechaFinal: fechfin,
                    fechaInicio: fechini,
                    fechaInscripcion: fechins,
                    notaDefinitiva: notdef,
                    pkEstudiante: codest,
                    pkMateria: codmat
                })
                .then(function() {
                    document.getElementById('editpkest').value = '';
                    document.getElementById('editpkmateria').value = '';
                    document.getElementById('editfechInicio').value = '';
                    document.getElementById('editfechFinal').value = '';
                    document.getElementById('editNotadef').value = '';
                    document.getElementById('editestado').value = '';
        
                    alert.innerHTML += `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Correcto!</strong> Matricula Actualizada.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
        
                })
                .catch(function(error) {
                    alert.innerHTML += `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Lo siento!</strong> La Matricula No se Actualizo.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                });
              swal("Poof! Se ha eliminado el Registro!", {
                icon: "success",
              });
            } else {
              swal("Tranquilo nada se ha Actualizado!");
            }
          });
    }





}