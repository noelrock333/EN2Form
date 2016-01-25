var express = require('express');
var router = express.Router();
var extend = require('util')._extend;
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form/expediente', { title: 'Express' });
});


/*POST Form*/
router.post('/save', function(req, res, next){
	var db = req.app.get('db');
	console.log(req.body.piezas_dentales);
	var expediente = {
		id_paciente: 		req.body.id_paciente,
		anestecia_previa: 	req.body.anestecia_previa || false,
		fecha_expediente: 	req.body.fecha_expediente ? moment(req.body.fecha_expediente, 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		id_referencia: 		req.body.id_referencia || null,
		edad_paciente: 		req.body.edad_paciente || null,
		piezas_dentales: 	req.body.piezas_dentales ? req.body.piezas_dentales.split(',') : null,
		ids_alergias: 		req.body.alergias || null,
		otra_alergia: 		req.body.otra_alergia || null,
		enfermedad_dolores: req.body.enfermedad_dolores || null, 
		ultimos_medicamentos: req.body.ultimos_medicamentos || null,
		
		ids_problemas: 					req.body.problemas || null,
		ids_antecedentes_del_diente: 	req.body.antecendentes_diente || null,
		otro_antecedentes_del_diente: 	req.body.otro_antecedente || null,
		ids_examen_clinico: 			req.body.examen_clinico || null,
		ids_pulpa: 						req.body.pulpa || null,
		ids_palpitacion_periapcial: 	req.body.palpacion_periapical || null,
		ids_conducto_radicular_rx: 		req.body.conducto_radicular || null,
		ids_zona_periapcial_rx: 		req.body.zona_periapical || null,
		ids_diagnostico_pulpar: 		req.body.diagnostico_pulpar || null,
		ids_diagnostico_periapcial_presuncion: req.body.diagnostico_periapical_presuncion || null,
		ids_interencion_indicada: 		req.body.intereccion_indicada || null,
		
		control_de_tratamiento: req.body.control_de_tratamiento || null,
		pronostico: 			req.body.pronostico || false,
		nota_evolucion: 		req.body.nota_evolucion || null
	};

	db.ma_endodoncia.insert(expediente, function(err, data){
		if(err) return res.send(err);
		res.send(data);
	});
});

router.post('/nuevo_paciente', function(req, res, next){
	var db = req.app.get('db');
	req.body.fecha_nacimiento = dateFormat(req.body.fecha_nacimiento) == "00-00-0000" ? null: dateFormat(req.body.fecha_nacimiento);
	req.body.nombre_completo = `${req.body.nombre} ${req.body.apellido_paterno} ${req.body.apellido_materno}`.trim();
	db.ca_pacientes.insert(req.body, function(err, data){
		if(err) return res.send(err);
		res.json(data);
	});
});

router.post('/nuevo_colega', function(req, res, next){
	var db = req.app.get('db');
	req.body.nombre 			= req.body.nombre || null;
	req.body.apellido_paterno 	= req.body.apellido_paterno || null;
	req.body.nombre_completo 	= `${req.body.nombre} ${req.body.apellido_paterno} ${req.body.apellido_materno}`.trim();
	db.ca_colegas.insert(req.body, function(err, data){
		if(err) return res.send(err);
		res.json(data);
	});
});


router.post('/colegas', function(req, res, next) {
	var db = req.app.get('db');
	db.run("SELECT * FROM ca_colegas WHERE lower(nombre_completo) LIKE '%"+req.body.query+"%'", function(err, data){
		if(err) return res.send(err);
		res.json(data);
	});
});

router.post('/pacientes', function(req, res, next) {
	var db = req.app.get('db');
	db.run("SELECT * FROM ca_pacientes WHERE lower(nombre_completo) LIKE '%"+req.body.query+"%'", function(err, data){
		if(err) return res.send(err);
		res.json(data);
	});
});

router.get('/index/ejemplo', function(req, res, next) {
  res.render('form/ejemplo', { title: 'Formulario Ejemplo' });
});

router.post('/index/save-form', function(req, res, next) {
	var db = req.app.get('db');
	db.ma_endodoncia.insert(req.body, function(err, data){
		if(err) return res.send(err);
		res.send(data);
	});
});

module.exports = router;

function dateFormat(fecha){
	if(fecha){
		var date = fecha.split('/');
		return date[2]+'-'+date[0]+'-'+date[1];
	}
	else{
		return "00-00-0000";
	}
}