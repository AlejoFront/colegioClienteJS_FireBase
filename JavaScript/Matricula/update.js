firebase.initializeApp({
    apiKey: 'AIzaSyAGJXiiSMXGBFJcqNMdXSmzmteuuU1KXAU',
    authDomain: 'proyectosoa2020bcolegio.firebaseio.com',
    projectId: 'proyectosoa2020bcolegio'
});

var db = firebase.firestore();


function buscarcod() {
    var tablaBuscar = document.getElementById('tab-view');
    var codigo = parseInt(document.getElementById('codigo').value);

    var valuestate = "";
    tablaBuscar.innerHTML = '';
    db.collection("Matricula").where("pkEstudiante", "==", codigo)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots


                var documentoEst = parseInt(doc.data().pkEstudiante);
                var codigomateria = parseInt(doc.data().pkMateria);

                db.collection("Estudiante").where("documento", "==", documentoEst)
                    .get()
                    .then(function (querySnapshotEst) {
                        querySnapshotEst.forEach(function (est) {
                            nombreEst = est.data().nombres + " " + est.data().apellidos;

                        });

                        db.collection("Materia").where("codigo", "==", codigomateria)
                            .get()
                            .then(function (querySnapshotMate) {
                                querySnapshotMate.forEach(function (mat) {
                                    nomMat = mat.data().nombre;

                                });
                                if (doc.data().estado == 0) {
                                    valuestate = "Matriculado";
                                } else if (doc.data().estado == 1) {
                                    valuestate = "Cursando";
                                } else if (doc.data().estado == 2) {
                                    valuestate = "Reprobado";
                                } else if (doc.data().estado == 3) {
                                    valuestate = "Aprobado";
                                }
                        tablaBuscar.innerHTML += `
                            <tr>
                
                                <th>${nombreEst}</th>
                                <th>${nomMat}</th>
                                <th>${doc.data().notaDefinitiva}</th>
                                <th>${doc.data().fechaInscripcion}</th>
                                <th>${doc.data().fechaFinal}</th>
                                <th>${doc.data().fechaInicio}</th>
                                <th>${valuestate}</th>
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
                            }).catch(function (error) {

                            });

                    }).catch(function (error) {

                    });


            });
            if (querySnapshot.size == 0) {
                swal({
                    title: "No Se encontro Registro!",
                    text: "No hay datos con este codigo!",
                    icon: "info",
                    button: "Ok!",
                });
            }
        })
        .catch(function (error) {

        });
}

function editar(id, pkEstudiante, pkMateria, notaDefinitiva, fechaInscripcion, fechaFinal, fechaInicio, estado) {
    document.getElementById('editpkest').value = pkEstudiante;
    document.getElementById('editpkmateria').value = pkMateria;
    document.getElementById('editfechInicio').value = fechaInicio;
    document.getElementById('editfechFinal').value = fechaFinal;
    document.getElementById('editNotadef').value = notaDefinitiva;
    document.getElementById('editestado').value = estado;
    var botonupdate = document.getElementById('btnupdate');

    botonupdate.onclick = function () {
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
                        .then(function () {
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
                            buscarcod();
                        })
                        .catch(function (error) {
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