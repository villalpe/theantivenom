'use strict'

exports.isAdmin = (req, res, next) => {
	if(req.user.role != 'ROLE_ADMIN'){
		return res.status(200).send({message: 'No tienes permisos de Administrador'});
	}

	next();
};