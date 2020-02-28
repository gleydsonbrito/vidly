const admin = require('../../../middleware/admin');

describe('isAdmin middleware', () => {
    it('should call next function when a user is a admin', () => {
        const req = {
            user: {
                isAdmin: true
            }
        }
        const res = {};
        const next = jest.fn();

        admin(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    })
})