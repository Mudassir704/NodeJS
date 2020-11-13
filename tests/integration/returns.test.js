const momet = require('moment');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');


describe('/api/resturns',() => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId , movieId });
    }

    beforeEach(async () => { 
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save(); 
    });
    afterEach(async() => { 
        await server.close(); 
        await rental.remove({});
    });

    it('should return 401 if cliwnt is not logged in',async () => {
        token = '';
        
        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('should return 400 if client is not send cutomerID in',async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if client is not send cutomerID in',async () => {
        movieId = '';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental is found for given cutomer/movie ID in',async () => {
        await Rental.remove({});
        
        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 400 if rental is processed',async () => {
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 200 if rental is valid',async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
    it('should set the Returned Date',async () => {
        await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = Math.abs(new Date() - rentalInDb.dateReturned);
        expect(diff).toBeLessThan(10 * 1000);
    });
    it('should return rentalFee ', async () => {
        rental.dateOut = momet().add(-7 , 'days');

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBeDefined();
    })
    it('should return rental', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        rentalInDb.dateReturned = new Date();
        await rentalInDb.save();

        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining([
                'dateOut', 'dateReturned' , 'rentalFee', 'customer','movie'
            ])
        );
    })
})