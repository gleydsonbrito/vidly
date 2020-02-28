const { User } = require('../../../model/user');
const { Genre } = require('../../../model/genre');
const request = require('supertest');



describe('integration auth middleware', () => {
    let server;
    let token;
    let exec;

    exec = function () {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(async () => {
        server = await require('../../../index');
        await Genre.deleteMany({});
    });

    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    it('should return a 401 status when no token was provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401)
    });

    it('should return a 400 status when token is invalid', async () => {
        token = 'token';

        const res = await exec();

        expect(res.status).toBe(400);

    });

    it('should return a 200 status when token is valid', async () => {
        token = await new User().generateAuthToken();

        const res = await exec();

        expect(res.status).toBe(200);
    })
})