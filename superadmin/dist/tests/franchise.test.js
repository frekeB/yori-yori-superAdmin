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
describe('Test Franchise endpoints on admin', () => {
    const newAdmin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'
    };
    let accessToken;
    const newFranchise = {
        country: 'Test country',
        location: 'Test location',
        coordinates: '6.5062965,3.305856',
        email: 'testmail@test.com',
        password: 'password',
        phoneNumber: '+2349017676448'
    };
    let franchiseId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/admin').send(newAdmin);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/login')
            .send({ email: newAdmin.email, password: newAdmin.password });
        accessToken = response.body.data.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/admin/me').set('Authorization', `Bearer ${accessToken}`);
    }));
    it('POST /logistics/franchise ---> Create a new franchise', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/logistics/franchise')
            .send(newFranchise)
            .set("Authorization", `Bearer ${accessToken}`);
        // console.log("RESPONSE", response)
        franchiseId = response.body.data._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
    }));
    it('PATCH /logistics/franchise/:id ---> Should update franchise', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/franchise/${franchiseId}`)
            .send({ country: "Ghana" })
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.country).toBe("Ghana");
    }));
    it('PATCH /logistics/franchise/:id/deactivate ---> Should deactivate franchise', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/franchise/${franchiseId}/deactivate`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.active).toBe(false);
    }));
    it('PATCH /logistics/franchise/:id/activate ---> Should reactivate franchise', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/franchise/${franchiseId}/activate`)
            .set("Authorization", `Bearer ${accessToken}`);
        // console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.data.active).toBe(true);
    }));
    it('DELETE /logistics/franchise/:id ---> Should delete franchise', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/logistics/franchise/${franchiseId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(204);
    }));
});
