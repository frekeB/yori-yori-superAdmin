import request from 'supertest'
import app from '../app'
import {Admin} from '../interfaces'


describe('Testing Admins endpoint', () => {
    const newAdmin: Admin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'        
    }

    let accessToken: string
    let id: string

    // afterAll( async ()=> {
    //     const response = await request(app).delete(`/admin/${id}`)
    //     console.log(response.statusCode)
    // })

    it('POST /admin ---> Register admin', async () => {
        const response = await request(app).post('/admin').send(newAdmin)
        expect (response.statusCode).toBe(201)
        expect (response.body.status).toBe('success')
        expect (response.body.data.name).toBe(newAdmin.name)
        expect (response.body.data.email).toBe(newAdmin.email)
        id = response.body.data._id
    })

    it ('POST /admin/login ---> Login admin', async () => {
        const response = await request(app).post('/admin/login').send({email: newAdmin.email, password: newAdmin.password})
        expect(response.statusCode).toBe(200)
        expect (response.body.status).toBe('success')
        accessToken = response.body.data.accessToken
    })

    it ('GET /admin ---> Get Admins', async () => {
        const response = await request(app).get('/admin')
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe('success')
    })

    it ('GET /admin/:id ---> Get One Admin', async () => {
        console.log(id)
        const response = await request(app).get(`/admin/${id}`)
        expect(response.statusCode).toBe(200)
        expect (response.body.data.name).toBe(newAdmin.name)
        expect(response.body.data.email).toBe(newAdmin.email)
    })

    it('POST /admin ---> Try to duplicate admin', async () => {
        const response = await request(app).post('/admin').send(newAdmin)
        expect(response.statusCode).toBe(409)
        expect (response.body.status).toBe('failed')
        expect (response.body.message).toContain(newAdmin.email)
    })

    it ('DELETE /admin/me ---> Delete an admin', async () => {
        const response = await request(app).delete('/admin/me').set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(204)
    })
})

