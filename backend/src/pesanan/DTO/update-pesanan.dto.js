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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePesananDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var create_pesanan_dto_1 = require("./create-pesanan.dto");
var client_1 = require("@prisma/client");
var updatePesananDto = /** @class */ (function () {
    function updatePesananDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], updatePesananDto.prototype, "kode_pesanan", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], updatePesananDto.prototype, "pelangganId", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], updatePesananDto.prototype, "nama_pelanggan", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
        __metadata("design:type", Number)
    ], updatePesananDto.prototype, "totalHarga", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], updatePesananDto.prototype, "catatan", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return create_pesanan_dto_1.DetailPesananDto; }),
        __metadata("design:type", Array)
    ], updatePesananDto.prototype, "detail", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(client_1.StatusPesanan),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], updatePesananDto.prototype, "status", void 0);
    return updatePesananDto;
}());
exports.updatePesananDto = updatePesananDto;
