const mongoose = require('mongoose');
const validate  = require('../../../middleware/validateObjectId');

describe('validateObjectId middleware', () => {
    it('should call next function when object id is valid', () => {
        const req = {
            params:{
                id: new mongoose.Types.ObjectId().toHexString()
            }
        }
        const res = {}
        const next = jest.fn();
        
        validate(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    })
})