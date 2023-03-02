// import request from 'supertest'
// import app from '../app'
// import {Settings, Admin} from '../interfaces'

// describe('Testing settings endpoints', () => {
//     const settings: Settings = {
//         dayStart: 9,
//         dayEnd: 10
//     }

//     const newAdmin: Admin = {
//         name: 'Test Admin',
//         email: 'testmail@gmail.com',
//         password: 'testpassword'        
//     }

//     let adminToken: string

//     beforeAll(async () => {
//         await request(app).post('/admin').send(newAdmin)
//         const response = await request(app).post('/admin/login').send({email: newAdmin.email, password: newAdmin.password})
//         adminToken = response.body.data.accessToken
//     })

//     afterAll(async () => {
//         await request(app).delete('/admin/me').set('Authorization', `Bearer ${adminToken}`)
//     })

//     it('POST /settings ---> Creates new settings without auth', async () => {
//         const response = await request(app).post('/settings').send(settings)
//         expect(response.statusCode).toBe(401)
//         expect(response.body.status).toBe('failed')
//     })

//     it('GET /settings ---> Tries to get settings', async () => {
//         const response = await request(app).get('/settings')
//         expect(response.statusCode).toBe(404)
//         expect(response.body.status).toBe('failed')
//         // expect(response.body.data.length).toBe(1)
//     })

//     it('POST /settings ---> Creates new settings', async () => {
//         const response = await request(app).post('/settings').send(settings).set('Authorization', `Bearer ${adminToken}`)
//         expect(response.statusCode).toBe(201)
//         expect(response.body.status).toBe('success')
//         expect(response.body.data.dayStart).toBe(settings.dayStart)
//         expect(response.body.data.dayEnd).toBe(settings.dayEnd)
//     })

//     it('POST /settings ---> Create new setting after setting already exists', async () => {
//         const response = await request(app).post('/settings').send(settings).set('Authorization', `Bearer ${adminToken}`)
//         expect(response.statusCode).toBe(409)
//         expect(response.body.status).toBe('failed')
//     })

//     it('PATCH /settings ---> Updates settings', async () => {
//         const newDayStart = 6
//         const response = await request(app).patch('/settings').send({dayStart: newDayStart}).set('Authorization', `Bearer ${adminToken}`)
//         expect(response.statusCode).toBe(200)
//         expect(response.body.status).toBe('success')
//         expect(response.body.data.dayStart).toBe(newDayStart)
//     })

//     it('GET /settings ---> Gets settings', async () => {
//         const response = await request(app).get('/settings')
//         expect(response.statusCode).toBe(200)
//         expect(response.body.status).toBe('success')
//     })
// })
