import request from 'supertest'
import app from '../app'
import axios from 'axios'


describe('Tests all dispatcher endpoints', () => {
    const dispatcher = {
        user: "630cf7c7da676619804b3893",
        franchise: "63094779798b8e9e27c4d483",
        vehicleType: "electric bike",
        distanceRange: "short"
    }

    let dispatcherId: string

    const newAdmin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'        
    }

    let accessToken: string

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

    

    it('POST /logistics/dispatcher ---> Creates new dispatcher', async () => {
        const response = await request(app)
            .post('/logistics/dispatcher')
            .send(dispatcher)
            .set("Authorization", `Bearer ${accessToken}`)
        
        console.log(response.body, "RES BODY")
        dispatcherId = response.body.data._id
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("success")
    })

    it('PATCH /logistics/dispatcher/:id ---> Updates dispatcher', async () => {
        const response = await request(app)
            .patch(`/logistics/dispatcher/${dispatcherId}`)
            .send({vehicleType: "truck", distanceRange: "long"})
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.vehicleType).toBe("truck")
        expect(response.body.data.distanceRange).toBe("long")
    })

    it('PATCH /logistics/dispatcher/:id/activate ---> Activates Dispatcher', async () => {
        const response = await request(app)
            .patch(`/logistics/dispatcher/${dispatcherId}/activate`)
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.status).toBe("active")        
    })

    it('PATCH /logistics/dispatcher/:id/deactivate ---> Deactivates Dispatcher', async () => {
        const response = await request(app)
            .patch(`/logistics/dispatcher/${dispatcherId}/deactivate`)
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.status).toBe("inactive")        
    })
})

