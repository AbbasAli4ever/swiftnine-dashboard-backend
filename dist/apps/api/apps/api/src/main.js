"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("../../../libs/common/src");
const app_module_1 = require("./app.module");
const cors_config_1 = require("./config/cors.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors((0, cors_config_1.buildCorsOptions)(process.env));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new common_1.GlobalExceptionFilter());
    app.useGlobalPipes(new nestjs_zod_1.ZodValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FocusHub API')
        .setDescription('FocusHub - Central place for productivity')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env['PORT'] ?? 3000);
}
bootstrap().catch((err) => {
    console.error('Bootstrap error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map