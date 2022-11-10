const server = require('../../index');
const request = require('supertest');
const Genres = require('../../models/genre')
const { User } = require('../../models/user');

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index')})
    afterEach( async () => { 
    server.close(),
    await Genres.remove();
    })

    describe('GET /', () => {
      it('should return genres of songs', async () => {
     const res = await request(server).get('/api/genres')

     await Genres.collection.insertMany([{name: 'genres1'}, {name: 'genres2'}])

     expect(res.status).toBe(200)
     expect(res.body.length).toBe(2)
     expect(res.body.some (g => g.name === 'genres1')).toBeTruthy()
     expect(res.body.some (g => g.name === 'genres2')).toBeTruthy()
   })
  })
})

describe('/api/genre', () => {

    describe('GET /:id', () => {
        it('should return a single genre', async ()=> {
        const genre = await new Genres({name: 'genre1'})
            genre.save();

            const res = await request(server).get('/api/genres/' + genre._id)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return a 404 if there is an error', async ()=> {
        
                const res = await request(server).get('/api/genres/1')
    
                expect(res.status).toBe(404)
            })
    })
    
    describe('POST /', () => {
     it('should return 401 if client is not logged in', async() => {
        const res = await (await request(server)
        .post('/api/genres'))
        .send({name: 'genre1'})

        expect(res.status).toBe(401)
     })

     
   
    })
    describe('POST /', () => {
        it('should return 400 if genre is less than 5 charaters', async() => {
           const token = await User().generateAuthToken()
           const res = await (await request(server)

           .post('/api/genres'))
           .set('x-auth-token', token)
           .send({name: '1234'})
   
           expect(res.status).toBe(400)
        })

       })
       describe('POST /', () => {
        it('should return 400 if genre is more than 50 charaters', async() => {
           const token = await User().generateAuthToken()
           const name = new Array(52).join('a')

           const res = await request(server)
           .post('/api/genres')
           .set('x-auth-token', token)
           .send({name: name})
   
           expect(res.status).toBe(400)
        })

       })

       describe('POST /', () => {
        it('should save the genre into the database', async() => {
           const token = await User().generateAuthToken()
       
           const res = await  request(server)
           .post('/api/genres')
           .set('x-auth-token', token)
           .send({name: 'genre1'})
   
           const genre = await Genres.save({name: 'genre1'})
           expect(genre).not.toBeNull();
           expect(res.body).toHaveProperty({name: 'genre1'})
        })

       })

       describe('POST /', () => {
        it('should returns the valid genres', async() => {
           const token = await User().generateAuthToken()
       
           const res = await  request(server)
           .post('/api/genres')
           .set('x-auth-token', token)
           .send({name: 'genre1'})
   
           expect(res.body).toHaveProperty('_id');
           expect(res.body).toHaveProperty({name: 'genre1'})
        })

       })
})