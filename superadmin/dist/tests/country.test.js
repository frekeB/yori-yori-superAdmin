"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Testing country endpoints', () => {
    const newCountry = {
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
    };
    const secondCountry = Object.assign({}, newCountry);
    secondCountry.name = 'Ghana';
    secondCountry.coordinates = '9.0064761,4.1770';
    let adminToken;
    let countryId;
    let secondCountryId;
    const newAdmin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/admin').send(newAdmin);
        const login = yield (0, supertest_1.default)(app_1.default).post('/admin/login').send({ email: newAdmin.email, password: newAdmin.password });
        adminToken = login.body.data.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/admin/me').set('Authorization', `Bearer ${adminToken}`);
    }));
    it('POST /logistics/country ---> Try to create country without auth', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/logistics/country')
            .send(newCountry);
        expect(response.body.status).toBe('failed');
        expect(response.statusCode).toBe(401);
    }));
    it('POST /logistics/country ---> Create New Country', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/logistics/country')
            .send(newCountry)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        const secondResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/logistics/country')
            .send(secondCountry)
            .set('Authorization', `Bearer ${adminToken}`);
        console.log(response.body.data, secondResponse.body.data);
        countryId = response.body.data._id;
        secondCountryId = secondResponse.body.data._id;
    }));
    it('GET /logisitics/country ---> Get All Countries', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/logistics/country');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.status).toBe('success');
    }));
    it('GET /logisitics/country/name/:name ---> Get Country By Name', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/logistics/country/name/${newCountry.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toBe(newCountry.name.toLowerCase());
        expect(response.body.status).toBe('success');
    }));
    it('GET /logisitics/country/:id ---> Get Country By Id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/logistics/country/${countryId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toBe(newCountry.name.toLowerCase());
        expect(response.body.status).toBe('success');
    }));
    it('PATCH /logistics/country/:id ---> Update Country With Id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).patch(`/logistics/country/${countryId}`).send({ importDuty: 500 }).set('Authorization', `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.importDuty).toBe(500);
        expect(response.body.status).toBe('success');
    }));
    it('PATCH /logistics/country ---> Update All Countries', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).patch(`/logistics/country`).send({ minimumPrice: 500 }).set('Authorization', `Bearer ${adminToken}`);
        const minimumPrices = [];
        response.body.data.forEach((country) => {
            minimumPrices.push(country.minimumPrices);
        });
        expect(minimumPrices[0]).toBe(minimumPrices[1]);
        expect(response.body.data[0].minimumPrice).toBe(500);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
    }));
    it('DELETE /logistics/country/:id ---> Delete A Country', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/logistics/country/${countryId}`).set('Authorization', `Bearer ${adminToken}`);
        const secondResponse = yield (0, supertest_1.default)(app_1.default).delete(`/logistics/country/${secondCountryId}`).set('Authorization', `Bearer ${adminToken}`);
        // countryId = response.statusCode === 204 ? null : countryId
        // secondCountryId = secondResponse.statusCode === 204 ? null : secondCountryId
        expect(response.statusCode).toBe(204);
        expect(secondResponse.statusCode).toBe(204);
    }));
});
