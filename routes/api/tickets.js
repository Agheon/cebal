
import Joi from 'joi'
import cloudant from '../../config/db.js'
import moment from 'moment-timezone'
import configEnv from '../../config/env_status.js'
//import { validate, clean, format }  from 'rut.js'

let db = cloudant.db.use(configEnv.db)

export default [
{
    method: 'POST',
    path: '/api/studentTickets',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials;
            let rut = request.payload.rut;
            
            return new Promise(resolve => {
                db.find({
                    selector: {
                        _id: {
                            $gt: 0
                        },
                        type: 'boleta',
                        rutAlumno: rut,
                        place: credentials.place
                    }
                }, function (err, result) {
                    if (err) throw err;

                    if (result.docs[0]) {
                        resolve({ok: result.docs})
                    } else {
                        resolve({ err: 'No se han encontrado boletas' });
                    }
                });
            });
        },
        validate: {
            payload: Joi.object().keys({
                rut: Joi.string().required()
            })
        }
    }
}
]