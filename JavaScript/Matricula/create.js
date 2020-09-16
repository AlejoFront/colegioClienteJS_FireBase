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
  var documento = parseInt(document.getElementById('codEst').value);
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
  var btnmatricular = document.getElementById('btmatricular');
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








// Metodo Guardar
  var materia;//1,materia2,materia3,materia4,materia5,materia6,materia7,materia8,materia9,materia10 = 0;
  
  function save() {
      var documentoestudiante = parseInt(document.getElementById('codEst').value);
      var fechini = document.getElementById('fechInicio').value;
      var fechfin = document.getElementById('fechFinal').value;
      var materia;
      var alert = document.getElementById('alertas');
      var validate = true;
      for(var i=1;i<=cantmat;i++){
        
        var id = i;
        materia = parseInt(document.getElementById(id).value);
        db.collection("Matricula").add({
            estado: 0,
            fechaFinal: fechfin,
            fechaInicio: fechini,
            fechaInscripcion: fechaactual,
            notaDefinitiva: 0.0,
            pkEstudiante: documentoestudiante,
            pkMateria: materia
        
        })
          .then(function(docRef) {

        })
        .catch(function(error) {
         
        });

        var state = validate;
      }
      console.log(state);
      if(state == true){

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