import request from 'supertest'
import app from '../app'
import {Admin} from '../interfaces'

describe('Test Franchise endpoints on admin', () => {
    const newAdmin: Admin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'        
    }

    let accessToken: string

    const newFranchise = {
        country: 'Test country',
        location: 'Test location',
        coordinates: '6.5062965,3.305856',
        email: 'testmail@test.com',
        password: 'password',
        phoneNumber: '+2349017676448'
    }

    let franchiseId: string

    beforeAll(async () => {
        await request(app).post('/admin').send(newAdmin)
        const response = await request(app)
            .post('/admin/login')
            .send({email: newAdmin.email, password: newAdmin.password})

        accessToken = response.body.data.accessToken
    })

    afterAll(async () => {
        await request(app).delete('/admin/me').set('Authorization', `Bearer ${accessToken}`)
    })

    it('POST /logistics/franchise ---> Create a new franchise', async () => {
        const response = await request(app)
            .post('/logistics/franchise')
            .send(newFranchise)
            .set("Authorization", `Bearer ${accessToken}`)

        
        // console.log("RESPONSE", response)
        franchiseId = response.body.data._id
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("success")
    })

    it('PATCH /logistics/franchise/:id ---> Should update franchise', async () => {
        const response = await request(app)
            .patch(`/logistics/franchise/${franchiseId}`)
            .send({country: "Ghana"})
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.country).toBe("Ghana")
    })

    it('PATCH /logistics/franchise/:id/deactivate ---> Should deactivate franchise', async () => {
        const response = await request(app)
            .patch(`/logistics/franchise/${franchiseId}/deactivate`)
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.active).toBe(false)
    })

    it('PATCH /logistics/franchise/:id/activate ---> Should reactivate franchise', async () => {
        const response = await request(app)
        .patch(`/logistics/franchise/${franchiseId}/activate`)
        .set("Authorization", `Bearer ${accessToken}`)

        // console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.active).toBe(true)
    })

    it('DELETE /logistics/franchise/:id ---> Should delete franchise', async () => {
        const response = await request(app)
            .delete(`/logistics/franchise/${franchiseId}`)
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(204)
    })
})