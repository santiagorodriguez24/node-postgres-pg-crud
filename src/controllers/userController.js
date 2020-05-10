'use strict'
const { Pool } = require('pg');
const config = require('../config/config');
const queryFunctions = require('../utils/queryFunctions')

const pool = new Pool(config.db);
// Config Object Example:
// const config = {
//     db: {
//         host: 'localhost',
//         user: 'postgres',
//         password: 'mypassword',
//         database: 'databasename',
//         port: '5432',
//         max: 1000, // max number of clients in the pool
//         idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
//     }
// }

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});


const getUsers = async (req, res, next) => {

    let client = {};

    try {
        client = await pool.connect();

        let response = await client.query('SELECT * FROM users ORDER BY id ASC');

        res.status(200).json({
            ok: true,
            users: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        let err = {
            error: error,
            message: 'Can not get users.'
        };

        next(err)
    } finally {
        client.release();
    }

};


const getUserById = async (req, res, next) => {
    const id = parseInt(req.params.id);

    let client = {};

    try {
        client = await pool.connect();

        let response = await client.query('SELECT * FROM users WHERE id = $1', [id]);

        if (response.rowCount > 0) {
            res.json({
                ok: true,
                user: response.rows[0]
            });
        } else {
            res.status(404).json({
                ok: false,
                error: 'The user was not found.'
            });
        }
    }
    catch (error) {
        let err = {
            error: error,
            message: 'Can not get user.'
        };

        next(err)
    }
    finally {
        client.release();
    }

};


const createUser = async (req, res, next) => {
    const { name, email } = req.body;

    let client = {};

    try {
        client = await pool.connect();

        let response = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email]);

        let newUser = {
            id: response.rows[0].id,
            name,
            email
        }

        res.status(201).json({
            ok: true,
            message: 'User Added successfully.',
            user: newUser
        });

    }
    catch (error) {
        let err = {
            error: error,
            message: 'Can not create user.'
        };

        next(err)
    }
    finally {
        client.release();
    }

};


const updateUser = async (req, res, next) => {
    const id = parseInt(req.params.id);

    let queryObject = queryFunctions.getFieldsAndValues(id, req.body, false);

    let client = {};

    try {
        client = await pool.connect();

        let response = await client.query(`UPDATE users \SET ${queryObject.fields} WHERE id = $1 RETURNING *`, queryObject.values);

        res.json({
            ok: true,
            message: `User ${id} Updated Successfully.`,
            updatedUser: response.rows[0]
        });

    }
    catch (error) {
        let err = {
            error: error,
            message: 'Can not update user.'
        };

        next(err)
    }
    finally {
        client.release();
    }

};


const deleteUser = async (req, res, next) => {
    const id = parseInt(req.params.id);

    let client = {};

    try {
        client = await pool.connect();

        let response = await client.query('DELETE FROM users where id = $1 RETURNING *', [id]);

        console.log('Response: ', response);

        res.json({
            ok: true,
            message: `User ${id} deleted Successfully.`,
            deletedUser: response.rows[0]
        });
    }
    catch (error) {
        let err = {
            error: error,
            message: 'Can not delete user.'
        };

        next(err)
    }
    finally {
        client.release();
    }

};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};