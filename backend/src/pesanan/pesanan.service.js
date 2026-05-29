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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PesananService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var PesananService = /** @class */ (function () {
    function PesananService(prisma) {
        this.prisma = prisma;
    }
    PesananService.prototype.generateKodePesanan = function () {
        var tanggal = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        var random = Math.floor(1000 + Math.random() * 9000);
        return "ORD-".concat(tanggal, "-").concat(random);
    };
    PesananService.prototype.create = function (dto, pelangganId) {
        return __awaiter(this, void 0, void 0, function () {
            var menuIds, menus, detailData, totalHarga, pesanan;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        menuIds = dto.items.map(function (item) { return item.menuId; });
                        return [4 /*yield*/, this.prisma.menu.findMany({
                                where: { id: { in: menuIds }, tersedia: true },
                            })];
                    case 1:
                        menus = _a.sent();
                        if (menus.length !== menuIds.length) {
                            throw new common_1.BadRequestException('Beberapa menu tidak ditemukan atau tidak tersedia');
                        }
                        detailData = dto.items.map(function (item) {
                            var menu = menus.find(function (m) { return m.id === item.menuId; });
                            if (!menu)
                                throw new common_1.BadRequestException("Menu ID ".concat(item.menuId, " tidak ditemukan"));
                            var harga_saat_ini = Number(menu.harga);
                            var subtotal = harga_saat_ini * item.jumlah;
                            return {
                                menuId: item.menuId,
                                jumlah: item.jumlah,
                                harga_saat_ini: harga_saat_ini,
                                subtotal: subtotal,
                            };
                        });
                        totalHarga = detailData.reduce(function (sum, d) { return sum + d.subtotal; }, 0);
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.pesanan.create({
                                            data: {
                                                kode_pesanan: this.generateKodePesanan(),
                                                nama_pelanggan: dto.namaPelanggan,
                                                catatan: dto.catatan,
                                                totalHarga: totalHarga,
                                                pelangganId: pelangganId !== null && pelangganId !== void 0 ? pelangganId : null,
                                                detail: {
                                                    create: detailData,
                                                },
                                            },
                                            include: {
                                                detail: {
                                                    include: { menu: true },
                                                },
                                            },
                                        })];
                                });
                            }); })];
                    case 2:
                        pesanan = _a.sent();
                        return [2 /*return*/, pesanan];
                }
            });
        });
    };
    PesananService.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.pesanan.findMany({
                        orderBy: { createdAt: 'desc' },
                        include: {
                            detail: {
                                include: { menu: true },
                            },
                        },
                    })];
            });
        });
    };
    PesananService.prototype.findByKode = function (kode) {
        return __awaiter(this, void 0, void 0, function () {
            var pesanan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pesanan.findUnique({
                            where: { kode_pesanan: kode },
                            include: {
                                detail: {
                                    include: { menu: true },
                                },
                            },
                        })];
                    case 1:
                        pesanan = _a.sent();
                        if (!pesanan)
                            throw new common_1.NotFoundException("Pesanan ".concat(kode, " tidak ditemukan"));
                        return [2 /*return*/, pesanan];
                }
            });
        });
    };
    PesananService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.pesanan.update({
                                where: { id: id },
                                data: { status: dto.status },
                            })];
                }
            });
        });
    };
    PesananService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pesanan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pesanan.findUnique({ where: { id: id } })];
                    case 1:
                        pesanan = _a.sent();
                        if (!pesanan)
                            throw new common_1.NotFoundException("Pesanan dengan ID ".concat(id, " tidak ditemukan"));
                        return [2 /*return*/, pesanan];
                }
            });
        });
    };
    PesananService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], PesananService);
    return PesananService;
}());
exports.PesananService = PesananService;
