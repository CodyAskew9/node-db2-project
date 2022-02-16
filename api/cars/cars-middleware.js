onst Cars = require('./cars-model')
const vinValidator = require('vin-validator');
const db = require('../../data/db-config')

const checkCarId = async (req, res, next) => {
  try {
    const id = req.params.id
    const car = await Cars.getById(id)
    !car ? next({ status: 404, message: `Car with id ${id} is not found` }) 
    : next()
  } catch (err) {
    next(err)
  }
}

const checkCarPayload = (req, res, next) => {
  const vin = req.body.vin
  const make = req.body.make
  const model = req.body.model
  const mileage = req.body.mileage
  !vin ? next({ status: 400, message: `vin is missing`}) :
  !make ? next({ status: 400, message: `make is missing`}) :
  !model ? next({ status: 400, message: `model is missing`}) :
  !mileage ? next({ status: 400, message: `mileage is missing`}) :
  next()
}

const checkVinNumberValid = (req, res, next) => {
  const vin = req.body.vin
  const isValidVin = vinValidator.validate(vin);
  !isValidVin ? next({ status: 400, message: `vin ${vin} is invalid`}) : next()
}

const checkVinNumberUnique = async (req, res, next) => {
  const vin = req.body.vin
  const uniqueVin = await db('cars').where('vin', vin).first()
  uniqueVin ? next({ status: 400, message: `vin ${vin} already exists`}) : next()
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}