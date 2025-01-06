"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalApiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const validateRequest_1 = require("../../middleware/validateRequest");
const myAnimeLive_controller_1 = require("../myAnime/myAnimeLive.controller");
const externalApi_controller_1 = require("./externalApi.controller");
const externalApi_validation_zod_1 = require("./externalApi.validation.zod");
const router = express_1.default.Router();
router.post('/', myAnimeLive_controller_1.myAnimeLiveController);
router.post('/save', (0, auth_1.auth)('admin', 'normal', 'superAdmin'), (0, validateRequest_1.validateRequest)(externalApi_validation_zod_1.saveExternalApiDataSchema), externalApi_controller_1.externalApiController.saveExternalApi);
router.get('/my-data', (0, auth_1.auth)('admin', 'normal', 'superAdmin'), externalApi_controller_1.externalApiController.getUserExternalApiData);
router.post('/my-data/single', (0, auth_1.auth)('admin', 'normal', 'superAdmin'), externalApi_controller_1.externalApiController.getSingleExternalApiData);
router.post('/delete-previous-ep', (0, auth_1.auth)('admin', 'normal', 'superAdmin'), externalApi_controller_1.externalApiController.deletePreviousEpisode);
exports.externalApiRoutes = router;
