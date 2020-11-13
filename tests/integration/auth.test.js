const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const { use } = require('express/lib/router');

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async() => { 
        await server.close();
        await Genre.remove({}); 
    });

    let token;

    const exec = async () => {
        return await request(server)
            .post('/api/generes')
            .set('x-auth-token',token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided',async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('should return 400 if token is wrong',async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 200 if token is provided',async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});

describe('auth route', () => {
    let user;
    let token;
    let email;

    const exec = async () => {
        return await request(server)
            .post('/api/auth')
            .send({ email });
    }
    beforeEach(async() => {
        server = require('../../index'); 
        user = new User({
            _id: mongoose.Types.ObjectId(),
            name: 'Mudassir',
            email: 'mudas56@gma.cpl',
            password: '6789756'
        });
        await user.save();
    });
    afterEach(async() => { 
        await server.close();
        await user.remove({});
    });
    it('should return 400 error if email is invalid', async () => {
        email = user.email;

        const res = await exec();

        expect(res.status).toBe(400);
    });
})