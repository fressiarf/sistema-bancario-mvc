const { Usuario, Rol } = require('../models');
const bcrypt = require('bcryptjs');

const usuarioController = {

  miPerfil: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
      });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const rolSolicitante = await req.usuario.getRol();
      const nombreRolSolicitante = rolSolicitante.nombre.toLowerCase();
      const rolIdSolicitante = rolSolicitante.id;

      let whereCondition = {};

      if (rolIdSolicitante === 5 || nombreRolSolicitante === 'superadministrador') {

      } else if (nombreRolSolicitante.includes('admin')) {

        const rolesPermitidos = await Rol.findAll({
          where: { nombre: ['Empleado', 'empleado', 'Cliente', 'cliente'] }
        });
        whereCondition.rol_id = rolesPermitidos.map(r => r.id);
      } else if (nombreRolSolicitante.includes('empleado')) {

        const rolCliente = await Rol.findOne({
          where: { nombre: ['Cliente', 'cliente'] }
        });
        whereCondition.rol_id = rolCliente ? rolCliente.id : -1;
      } else {

        whereCondition.id = req.usuario.id;
      }

      const usuarios = await Usuario.findAll({
        where: whereCondition,
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre', 'id'] }]
      });
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
      });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { contrasenia, ...userData } = req.body;

      const rolSolicitante = await req.usuario.getRol();
      const nombreRolSolicitante = rolSolicitante.nombre.toLowerCase();

      if (nombreRolSolicitante !== 'superadministrador' && rolSolicitante.id !== 5) {
        const rolesExistentes = await Rol.findAll();
        const rolDestino = rolesExistentes.find(r => r.id === userData.rol_id);
        const nombreRolDestino = rolDestino?.nombre.toLowerCase() || '';

        if (nombreRolSolicitante.includes('admin')) {
          if (nombreRolDestino.includes('admin') || nombreRolDestino === 'superadministrador') {
            return res.status(403).json({
              message: 'Un Administrador no tiene permisos para crear usuarios de nivel administrativo.'
            });
          }
        }

        if (nombreRolSolicitante.includes('empleado')) {
          const rolCliente = rolesExistentes.find(r => r.nombre.toLowerCase().includes('cliente'));

          if (userData.rol_id && userData.rol_id != rolCliente.id) {
            return res.status(403).json({
              message: 'Como empleado, solo tienes permitido crear usuarios con el rol de Cliente.'
            });
          }
          userData.rol_id = rolCliente.id;
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasenia, salt);

      const usuario = await Usuario.create({
        ...userData,
        contrasenia_hash: hashedPassword
      });

      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { contrasenia, ...userData } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (contrasenia) {
        const salt = await bcrypt.genSalt(10);
        userData.contrasenia_hash = await bcrypt.hash(contrasenia, salt);
      }

      await usuario.update(userData);
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      await usuario.destroy();
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
};

module.exports = usuarioController;
