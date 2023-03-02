import request from 'supertest'
import app from '../app'
import {Country, Admin} from '../interfaces'

describe('Testing country endpoints', () => {
    const newCountry: Country = {
        name: 'Nigeria',
        coordinates: '9.0064761,4.1770353',
        // shippingFee: 1500,
        // importDuty: 300,
        // pricePerKmSmall: 50,
        // pricePerKmMedium: 100,
        // pricePerKmLarge: 150,
        longDistance: 15,
        maximumDistance: 100,
        yorisDeliveryCut: 0.35,
        franchiseDeliveryCut: 0.35,
        dispatcherDeliveryCut: 0.3,
        localDeliveries: true,
        internationalDeliveries: true,
        minimumPrice: 150,
        currency: "NGN"
    }

    const secondCountry: Country = {
        ...newCountry
    }

    secondCountry.name = 'Ghana'
    secondCountry.coordinates = '9.0064761,4.1770'

    let adminToken: string
    let countryId: string | null
    let secondCountryId: string | null

    const newAdmin: Admin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'        
    }


    beforeAll(async () => {
        await request(app).post('/admin').send(newAdmin)
        const login = await request(app).post('/admin/login').send({email: newAdmin.email, password: newAdmin.password})
        adminToken = login.body.data.accessToken
    })

    afterAll(async () => {
        await request(app).delete('/admin/me').set('Authorization', `Bearer ${adminToken}`)
    })

    it('POST /logistics/country ---> Try to create country without auth', async () => {
        const response = await request(app)
            .post('/logistics/country')
            .send(newCountry)
        expect(response.body.status).toBe('failed')
        expect(response.statusCode).toBe(401)
    })

    it('POST /logistics/country ---> Create New Country', async () => {
        const response = await request(app)
            .post('/logistics/country')
            .send(newCountry)
            .set('Authorization', `Bearer ${adminToken}`)
        
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe('success')
        
        const secondResponse = await request(app)
            .post('/logistics/country')
            .send(secondCountry)
            .set('Authorization', `Bearer ${adminToken}`)

        console.log(response.body.data, secondResponse.body.data)      
        countryId = response.body.data._id
        secondCountryId = secondResponse.body.data._id
    })

    it('GET /logisitics/country ---> Get All Countries', async () => {
        const response = await request(app).get('/logistics/country')
        expect(response.statusCode).toBe(200)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.status).toBe('success')
    })

    it('GET /logisitics/country/name/:name ---> Get Country By Name', async () => {
        const response = await request(app).get(`/logistics/country/name/${newCountry.name}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.name).toBe(newCountry.name.toLowerCase())
        expect(response.body.status).toBe('success')
    })

    it('GET /logisitics/country/:id ---> Get Country By Id', async () => {
        const response = await request(app).get(`/logistics/country/${countryId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.name).toBe(newCountry.name.toLowerCase())
        expect(response.body.status).toBe('success')
    })

    it('PATCH /logistics/country/:id ---> Update Country With Id', async () => {
        const response = await request(app).patch(`/logistics/country/${countryId}`).send({importDuty: 500}).set('Authorization', `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.importDuty).toBe(500)
        expect(response.body.status).toBe('success')
    })

    it('PATCH /logistics/country ---> Update All Countries', async () => {
        const response = await request(app).patch(`/logistics/country`).send({minimumPrice: 500}).set('Authorization', `Bearer ${adminToken}`)
        const minimumPrices: number[] = []

        response.body.data.forEach((country: any)=> {
            minimumPrices.push(country.minimumPrices)
        })

        expect(minimumPrices[0]).toBe(minimumPrices[1])
        expect(response.body.data[0].minimumPrice).toBe(500)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe('success')
    })

    it('DELETE /logistics/country/:id ---> Delete A Country', async () => {
        const response = await request(app).delete(`/logistics/country/${countryId}`).set('Authorization', `Bearer ${adminToken}`)
        const secondResponse = await request(app).delete(`/logistics/country/${secondCountryId}`).set('Authorization', `Bearer ${adminToken}`)

        // countryId = response.statusCode === 204 ? null : countryId
        // secondCountryId = secondResponse.statusCode === 204 ? null : secondCountryId

        expect(response.statusCode).toBe(204)
        expect(secondResponse.statusCode).toBe(204)
    })
})
