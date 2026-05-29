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
exports.CreatePesananDto = exports.DetailPesananDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var DetailPesananDto = /** @class */ (function () {
    function DetailPesananDto() {
    }
    __decorate([
        (0, class_validator_1.IsInt)(),
        __metadata("design:type", Number)
    ], DetailPesananDto.prototype, "menuId", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        __metadata("design:type", Number)
    ], DetailPesananDto.prototype, "jumlah", void 0);
    return DetailPesananDto;
}());
exports.DetailPesananDto = DetailPesananDto;
var CreatePesananDto = /** @class */ (function () {
    function CreatePesananDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], CreatePesananDto.prototype, "namaPelanggan", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], CreatePesananDto.prototype, "catatan", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return DetailPesananDto; }) // ← ini penting agar items ter-transform
        ,
        __metadata("design:type", Array)
    ], CreatePesananDto.prototype, "items", void 0);
    return CreatePesananDto;
}());
exports.CreatePesananDto = CreatePesananDto;
