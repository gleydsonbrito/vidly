const { User } = require('../../../model/user')
const request = require('supertest');
const { Genre } = require('../../../model/genre');
const mongoose = require('mongoose');
let server;

describe('api/genres', () => {
    beforeEach(async () => {
        server = require('../../../index');
        await Genre.deleteMany({});

    });

    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    describe('/ POST', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(async () => {
            token = await new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 400 error if the user is not logged in', async () => {
            const res = await request(server).post('/api/genres');

            expect(res.status).toBe(401);
        });

        it('should return 400 error if the genre have less than 5 characters', async () => {
            name = '1234'

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 error if the genre have more than 50 characters', async () => {
            name = new Array(52).join('a')

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre when the input Íis correct', async () => {
            await exec();

            const genre = await Genre.findOne({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre when input is correct', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name')
        });
    });

    describe('GET /', () => {
        it('should return 400 status when database is empty', async () => {
            const res = await request(server)
                .get('/api/genres');

            expect(res.status).toBe(400);
        })

        it('should return all the genres', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
                .get('/api/genres');

            // console.log(res.body)
            // console.log(res.text)

            expect(res.body.length).toBe(1);
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        });
    });

    describe('/ GET/:id', () => {
        it('Should return an especific genre when id is valid', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id)

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should send 404 error when id is not valid', async () => {
            const res = await request(server).get('/api/genres/1')

            expect(res.status).toBe(404);
        });

        it('should throw 400 error when genre ai not exist', async () => {
            const res = await request(server).get('/api/genres/' + new mongoose.Types.ObjectId())

            expect(res.status).toBe(400);
        });
    });

    describe('PUT /:id ', () => {
        let token;
        let id;
        let name;

        const exec = () => {
            return request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .query({ id: id })
                .send({ name });
        }
        it('should return 401 when user is no logged in', async () => {
            const genre = new Genre({
                name: 'genre1'
            })
            await genre.save();

            token = '';
            id = genre._id;
            name = 'genre2';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 when invalid id is invalid', async () => {
            token = await new User().generateAuthToken();
            id = '';
            name = 'genre1';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 when id is NOT passed', async () => {
            token = await new User().generateAuthToken();
            name = 'genre1';

            const res = await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name });;

            expect(res.status).toBe(404);
        });

        it('should return 400 when a genre is invalid', async () => {
            token = await new User().generateAuthToken();
            id = mongoose.Types.ObjectId().toHexString();
            name = 'a';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return the genre edited', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save()

            token = await new User().generateAuthToken();
            id = genre._id;
            name = 'genre2';

            const res = await exec();

            expect(res.body).toHaveProperty('name', 'genre2');
        });
    });

    describe(' DELETE /:id', () => {
        let token;
        let id;

        const exec = () => {
            return request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .query({ id: id })
        }

        it('should return a object sent to be deleted', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save()

            const user = new User( {
                _id: new mongoose.Types.ObjectId().toHexString(),
                isAdmin: true
            })

            token = await new User(user).generateAuthToken();
            id = genre._id;

            const res = await exec();

            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })



});