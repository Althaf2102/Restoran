"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
// src/menu/menu.controller.ts
var common_1 = require("@nestjs/common");
var menu_service_1 = require("./menu.service");
var create_menu_dto_1 = require("./DTO/create-menu.dto");
var update_menu_dto_1 = require("./DTO/update-menu.dto");
var client_1 = require("@prisma/client");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var role_guard_1 = require("../auth/guards/role.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var client_2 = require("@prisma/client");
var swagger_1 = require("@nestjs/swagger");
var common_2 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var MenuController = /** @class */ (function () {
    function MenuController(menuService) {
        this.menuService = menuService;
    }
    MenuController.prototype.findAll = function (kategori) {
        return this.menuService.findAll(kategori);
    };
    MenuController.prototype.findOne = function (id) {
        return this.menuService.findOne(id);
    };
    MenuController.prototype.create = function (dto, file) {
        dto.foto = file === null || file === void 0 ? void 0 : file.filename;
        return this.menuService.create(dto);
    };
    MenuController.prototype.update = function (id, dto, file) {
        if (file)
            dto.foto = file.filename;
        return this.menuService.update(id, dto);
    };
    MenuController.prototype.remove = function (id) {
        return this.menuService.remove(id);
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)('kategori')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], MenuController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], MenuController.prototype, "findOne", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)(client_2.Role.admin),
        (0, common_1.Post)() // ← pastikan ini ada
        ,
        (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_2.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_menu_dto_1.createMenudto, Object]),
        __metadata("design:returntype", void 0)
    ], MenuController.prototype, "create", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)(client_2.Role.admin),
        (0, common_1.Patch)(':id'),
        (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')) // ← tambahkan ini
        ,
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_2.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, update_menu_dto_1.updateMenudto, Object]),
        __metadata("design:returntype", void 0)
    ], MenuController.prototype, "update", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)(client_2.Role.admin),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], MenuController.prototype, "remove", null);
    MenuController = __decorate([
        (0, swagger_1.ApiTags)('menu'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.Controller)('menu'),
        __metadata("design:paramtypes", [menu_service_1.MenuService])
    ], MenuController);
    return MenuController;
}());
exports.MenuController = MenuController;
