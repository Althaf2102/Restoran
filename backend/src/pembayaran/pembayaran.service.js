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
exports.PembayaranService = void 0;
// src/pembayaran/pembayaran.service.ts
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var client_1 = require("@prisma/client");
var PembayaranService = /** @class */ (function () {
    function PembayaranService(prisma) {
        this.prisma = prisma;
    }
    // 1. PROSES BAYAR (Create Pembayaran)
    PembayaranService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var pesanan, totalHarga, kembalian;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pesanan.findUnique({
                            where: { id: dto.pesananId },
                            include: { pembayaran: true },
                        })];
                    case 1:
                        pesanan = _a.sent();
                        // Validasi: Apakah pesanan ada?
                        if (!pesanan) {
                            throw new common_1.NotFoundException("Pesanan dengan ID ".concat(dto.pesananId, " tidak ditemukan"));
                        }
                        // Validasi: Apakah pesanan sudah pernah dibayar?
                        if (pesanan.pembayaran) {
                            throw new common_1.BadRequestException('Pesanan ini sudah dibayar sebelumnya!');
                        }
                        // Validasi: Apakah pesanan sudah dibatalkan? (Disamakan menjadi UPPERCASE)
                        if (pesanan.status === client_1.StatusPesanan.dibatalkan) {
                            throw new common_1.BadRequestException('Pesanan yang sudah dibatalkan tidak bisa dibayar!');
                        }
                        totalHarga = Number(pesanan.totalHarga);
                        if (dto.totalBayar < totalHarga) {
                            throw new common_1.BadRequestException("Uang tidak cukup! Total tagihan adalah Rp ".concat(totalHarga.toLocaleString('id-ID'), ", sedangkan uang yang dimasukkan Rp ").concat(dto.totalBayar.toLocaleString('id-ID')));
                        }
                        kembalian = dto.totalBayar - totalHarga;
                        // Jalankan transaksi database (All or Nothing)
                        return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var pembayaranBaru;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.pembayaran.create({
                                                data: {
                                                    pesananId: dto.pesananId,
                                                    metode: dto.metode,
                                                    totalBayar: dto.totalBayar,
                                                    kembalian: kembalian,
                                                },
                                            })];
                                        case 1:
                                            pembayaranBaru = _a.sent();
                                            // b. Update status pesanan menjadi DIPROSES (Disamakan menjadi UPPERCASE)
                                            return [4 /*yield*/, tx.pesanan.update({
                                                    where: { id: dto.pesananId },
                                                    data: { status: client_1.StatusPesanan.diproses },
                                                })];
                                        case 2:
                                            // b. Update status pesanan menjadi DIPROSES (Disamakan menjadi UPPERCASE)
                                            _a.sent();
                                            return [2 /*return*/, pembayaranBaru];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    // 2. AMBIL SEMUA RIWAYAT PEMBAYARAN
    PembayaranService.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.pembayaran.findMany({
                        orderBy: { waktuBayar: 'desc' },
                        include: {
                            pesanan: true,
                        },
                    })];
            });
        });
    };
    // 3. AMBIL SATU DATA PEMBAYARAN BERDASARKAN ID
    PembayaranService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pembayaran;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pembayaran.findUnique({
                            where: { id: id },
                            include: { pesanan: true },
                        })];
                    case 1:
                        pembayaran = _a.sent();
                        if (!pembayaran) {
                            throw new common_1.NotFoundException("Data pembayaran dengan ID ".concat(id, " tidak ditemukan"));
                        }
                        return [2 /*return*/, pembayaran];
                }
            });
        });
    };
    // 4. UPDATE PEMBAYARAN
    PembayaranService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var pembayaranExist, kembalian, pesanan, totalHarga;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        pembayaranExist = _a.sent();
                        kembalian = Number(pembayaranExist.kembalian);
                        if (!dto.totalBayar) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.pesanan.findUnique({
                                where: { id: pembayaranExist.pesananId }
                            })];
                    case 2:
                        pesanan = _a.sent();
                        if (!pesanan) {
                            throw new common_1.NotFoundException('Pesanan terkait tidak ditemukan');
                        }
                        totalHarga = Number(pesanan.totalHarga);
                        if (dto.totalBayar < totalHarga) {
                            throw new common_1.BadRequestException('Total bayar yang baru kurang dari total harga pesanan!');
                        }
                        kembalian = dto.totalBayar - totalHarga;
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.prisma.pembayaran.update({
                            where: { id: id },
                            data: {
                                metode: dto.metode,
                                totalBayar: dto.totalBayar,
                                kembalian: kembalian
                            },
                        })];
                }
            });
        });
    };
    // 5. HAPUS PEMBAYARAN
    PembayaranService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pembayaran;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        pembayaran = _a.sent();
                        return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Hapus data pembayaran
                                        return [4 /*yield*/, tx.pembayaran.delete({ where: { id: id } })];
                                        case 1:
                                            // Hapus data pembayaran
                                            _a.sent();
                                            // Kembalikan status pesanan menjadi PENDING karena pembayarannya dihapus
                                            return [4 /*yield*/, tx.pesanan.update({
                                                    where: { id: pembayaran.pesananId },
                                                    data: { status: client_1.StatusPesanan.dibatalkan },
                                                })];
                                        case 2:
                                            // Kembalikan status pesanan menjadi PENDING karena pembayarannya dihapus
                                            _a.sent();
                                            return [2 /*return*/, { message: "Pembayaran dengan ID ".concat(id, " berhasil dihapus, status pesanan kembali PENDING") }];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    PembayaranService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], PembayaranService);
    return PembayaranService;
}());
exports.PembayaranService = PembayaranService;
