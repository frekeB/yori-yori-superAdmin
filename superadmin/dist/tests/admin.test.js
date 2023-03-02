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
describe('Testing Admins endpoint', () => {
    const newAdmin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'
    };
    let accessToken;
    let id;
    // afterAll( async ()=> {
    //     const response = await request(app).delete(`/admin/${id}`)
    //     console.log(response.statusCode)
    // })
    it('POST /admin ---> Register admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/admin').send(newAdmin);
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.name).toBe(newAdmin.name);
        expect(response.body.data.email).toBe(newAdmin.email);
        id = response.body.data._id;
    }));
    it('POST /admin/login ---> Login admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/admin/login').send({ email: newAdmin.email, password: newAdmin.password });
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        accessToken = response.body.data.accessToken;
    }));
    it('GET /admin ---> Get Admins', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/admin');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
    }));
    it('GET /admin/:id ---> Get One Admin', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(id);
        const response = yield (0, supertest_1.default)(app_1.default).get(`/admin/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toBe(newAdmin.name);
        expect(response.body.data.email).toBe(newAdmin.email);
    }));
    it('POST /admin ---> Try to duplicate admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/admin').send(newAdmin);
        expect(response.statusCode).toBe(409);
        expect(response.body.status).toBe('failed');
        expect(response.body.message).toContain(newAdmin.email);
    }));
    it('DELETE /admin/me ---> Delete an admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete('/admin/me').set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(204);
    }));
});
