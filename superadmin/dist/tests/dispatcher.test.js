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
describe('Tests all dispatcher endpoints', () => {
    const dispatcher = {
        user: "630cf7c7da676619804b3893",
        franchise: "63094779798b8e9e27c4d483",
        vehicleType: "electric bike",
        distanceRange: "short"
    };
    let dispatcherId;
    const newAdmin = {
        name: 'Test Admin',
        email: 'testmail@gmail.com',
        password: 'testpassword'
    };
    let accessToken;
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
    it('POST /logistics/dispatcher ---> Creates new dispatcher', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/logistics/dispatcher')
            .send(dispatcher)
            .set("Authorization", `Bearer ${accessToken}`);
        console.log(response.body, "RES BODY");
        dispatcherId = response.body.data._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
    }));
    it('PATCH /logistics/dispatcher/:id ---> Updates dispatcher', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/dispatcher/${dispatcherId}`)
            .send({ vehicleType: "truck", distanceRange: "long" })
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.vehicleType).toBe("truck");
        expect(response.body.data.distanceRange).toBe("long");
    }));
    it('PATCH /logistics/dispatcher/:id/activate ---> Activates Dispatcher', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/dispatcher/${dispatcherId}/activate`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.status).toBe("active");
    }));
    it('PATCH /logistics/dispatcher/:id/deactivate ---> Deactivates Dispatcher', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/logistics/dispatcher/${dispatcherId}/deactivate`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.status).toBe("inactive");
    }));
});
