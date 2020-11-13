const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/generes', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async() => { 
        server.close();
        await Genre.remove({});
        await User.remove({}); 
    });


    describe('GET /', () => {
        it('should return alll genres', async() => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);

            const res = await request(server).get('/api/generes');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })

    });

    describe('GET /:id', () => {
        it('should return a genre if valid',async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/generes/'+ genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
        it('should return a 404 if invalid Id',async () => {
            const res = await request(server).get('/api/generes/1');
            expect(res.status).toBe(404);
        });
        it('should return a 404 if given genre is not found',async () => {
            const id = mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get('/api/generes/'+ id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/generes')
                .set('x-auth-token',token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });


        it('should return 401 if user is not logged in', async () => {
            token = ''

            const res = await  exec();
             
            expect(res.status).toBe(401);

        });
        it('should return 400 if genre is less than 5 character', async () => {
            name = '1234'

            const res = await exec();
             
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is greater than 50 character', async () => {
            name = new Array(52).join('a');

            const res = await exec();
             
            expect(res.status).toBe(400);

        });
        it('should post genre if it is valid', async () => {
            await exec();
            
            const genre = await Genre.find({ name: 'genre1' });    

            expect(genre).not.toBeNull();

        });
        it('should return a genre if it is valid', async () => {
            const res = await exec();
             
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','genre1');     

        });
    });

    describe('PUT /:id', () => {
        let name;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/generes/'+id)
                .send({ name });
        }

        it('should return 400 if genre name is less than 5 character', async () => {
            name = '1234'

            const res = await exec();
            
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre name is greater than 50 character', async () => {
            name = new Array(52).join('a');

            const res = await exec();
            
            expect(res.status).toBe(400);
        });
        it('should return 200 if genre is valid', async () => {
            const genre = new Genre({ name: "genre" });
            await genre.save();
            id = genre._id
            name = 'updated genre';

            const res = await exec();
            
            expect(res.status).toBe(200);
        });
        it('should return 404 if genre id is invalid', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();
            
            expect(res.status).toBe(404);
        });

    });

    describe('DELETE /:id', () => {
        let token;
        let id;
        let isAdmin;
        let genre;

        const exec = async () => {
            return await request(server)
                .delete('/api/generes/'+ genre._id)
                .set('x-auth-token',token);
        }

        beforeEach(() => {
            genre = new Genre({
                _id:mongoose.Types.ObjectId().toHexString(),
                name: 'genre1'
            });
            const user = { 
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'mudassir',
                email: "mudaassirk6@gmail.com",
                password: "789986" ,
                 isAdmin 
            };
            token = new User(user).generateAuthToken();
        });
        
        it('should return 401 if user is not logged in', async () => {
            token = '';

            const res = await  exec();
             
            expect(res.status).toBe(401);

        });

        it('should return 403 if user is not admin',async () => {
            isAdmin = false;

            const res = await  exec();
             
            expect(res.status).toBe(403);
        });
        // it('should return 200 if user is valid and admin',async () => {
        //     isAdmin = true;

        //     const res = await  exec();
             
        //     expect(res.status).toBe(200);
        // });
    });
})