const auth = require('../../../middleware/auth');
const { User } = require('../../../model/user');
const mongoose = require('mongoose');


describe('unit auth middleaware', () => {
    it('should populate req.user with the payload of a valid JWT', async () => {
        const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const token = await new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);
    });
});