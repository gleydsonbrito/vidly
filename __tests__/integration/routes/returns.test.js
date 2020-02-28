const { Movie } = require('../../../model/movie');
const { User } = require('../../../model/user');
const request = require('supertest');
const mongoose = require('mongoose'); 
const { Rental } = require('../../../model/rental'); 
let server;

describe('/api/returns', () => {
    let customerId;
    let movieId;
    let genreId;
    let rental;
    let token;
    let movie;

    const executionRequest = function(){
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({
           movieId,
           customerId
        });
    }

    beforeEach( async () => {
        token = await new User().generateAuthToken();

        customerId= new mongoose.Types.ObjectId().toHexString();
        movieId= new mongoose.Types.ObjectId().toHexString();
        genreId= new mongoose.Types.ObjectId().toHexString();

        server = require('../../../index');

        movie = new Movie({
            _id: movieId,
            title: 'Mad Max',
            genre: {
                _id: genreId,
                name: 'Action'
            },
            numberInStock:1,

            dailyRentalRate:2
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Jose Jose',
                phone: 12345678
            },
            movie
        });
        await rental.save();
    })

    afterEach( async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    }) 
    
    it('rental object should not be null', async () => {
        const result = await Rental.findOne(rental._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client no logged in, without authorization', async ()=> {
        token = '';

        const res = await executionRequest();

        expect(res.status).toBe(401);
    });

    it('should return 400 if theres no customer id', async ()=> {
        customerId = '';
        
        const res = await executionRequest();

        expect(res.status).toBe(400);
    });

    it('should return 400 if theres no movie id', async ()=> {
        movieId = '';
        
        const res = await executionRequest();

        expect(res.status).toBe(400);
    });

    it('should return 404 if theres no rental for given movieId and customerId', async ()=> {
        customerId = mongoose.Types.ObjectId().toHexString()
        
        const res = await executionRequest();

        expect(res.status).toBe(404);      
    });

    it('should return 400 if rental already exist', async ()=> {
        rental.returnDate = new Date();
        await rental.save();
        
        const res = await executionRequest();

        expect(res.status).toBe(400);   
    });

    it('should return a valid rental for given movieId and customerId', async ()=> {
        const res = await executionRequest();

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('customer');
        expect(res.body).toHaveProperty('movie.dailyRentalRate');
        expect(res.body).toHaveProperty('dateOut');
        expect(res.body).toHaveProperty('returnDate');
        expect(res.body).toHaveProperty('rentalFee');
        expect(res.body).toHaveProperty('movie.numberInStock');
    });
});