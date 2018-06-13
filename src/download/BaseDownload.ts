var MBTiles = require('@mapbox/mbtiles');
import { CoordTransform } from "../utils/CoordTransform";
import * as request from 'request';
import * as sharp from "sharp";
var fs = require('file-system');
import * as path from 'path';

export abstract class BaseDownload {
    constructor(parameters) {
        if (!parameters) return;
        this.name = parameters.name;
        this.mapType = parameters.mapType;
        this.extent = parameters.extent;
        this.minZoom = parameters.minZoom;
        this.maxZoom = parameters.maxZoom;
        this.path = path.join(__dirname, '../', parameters.path);
        this.tileSize = parameters.tileSize || 256;
        this.tileFormat = parameters.tileFormat || 'png';
        this.tiles = [];
    }
    protected headers?;//谷歌地图针对爬虫有访问限制，需要使用header模拟浏览器请求，否则会出现403
    protected name;
    protected mapType;
    protected extent;
    protected minZoom;
    protected maxZoom;
    protected path;
    protected origin;
    protected resolutions;
    protected tileSize;
    protected tileFormat;
    protected slUrls;
    protected slLabelUrls;
    protected yxUrls;
    protected yxLabelUrls;
    protected dxUrls;
    protected dxLabelUrls;
    protected tiles;
    protected actualExtent;//与坐标系对应的实际范围

    private mbtiles;
    private urls;
    private labelUrls;
    private complete = 0;//已完成个数
    private error = 0;//失败个数
    private downloading = 0;//下载中个数
    private maxRequest = 100;//同时最多有多少个请求
    private index = 0;//下载索引号
    private len = 0;//要下载切片个数
    private errorTile = [];//下载失败对象数组
    start() {
        if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
        this.mbtiles = new MBTiles(path.join(this.path, "file.mbtiles"), (err, mbtiles) => {
            if (err) {
                console.log(this.name, err);
                return;
            }
            mbtiles.startWriting((err) => {
                if (err) {
                    console.log(this.name, err);
                    return;
                }
                this.calculateTile();
                this.len = this.tiles.length;
                if (this.mapType.indexOf('SL') > 0) {
                    this.urls = this.slUrls;
                    this.labelUrls = this.slLabelUrls;
                } else if (this.mapType.indexOf('YX') > 0) {
                    this.urls = this.yxUrls;
                    this.labelUrls = this.yxLabelUrls;
                } else if (this.mapType.indexOf('DX') > 0) {
                    this.urls = this.dxUrls;
                    this.labelUrls = this.dxLabelUrls;
                }
                this.download().then(() => {
                    mbtiles.stopWriting((err) => {//mbtiles每100条分批写入数据库，执行结束时要调用一次stop，否则会丢失数据
                        err && console.log(this.name, err);
                    });
                });
            });
        });
    }
    protected abstract calculateTile();
    protected download(): Promise<void> {
        return new Promise((resolve, reject) => {
            while (this.downloading < this.maxRequest) {
                if (this.index >= this.len) break;
                const tile = this.tiles[this.index];
                var z = tile.z;
                var x = tile.x;
                var y = tile.y;
                this.downloading++;
                this.index++;
                this.downloadTile(z, x, y).then(flag => {
                    this.downloading--;
                    flag ? this.complete++ : this.error++;
                    console.log(this.name, "已完成: " + this.complete + "/" + this.len + " 失败: " + this.error);
                    if ((this.complete + this.error) >= this.len) {
                        var errorPath = path.join(this.path, "error.json");
                        if (this.error) {
                            console.log(this.errorTile);
                            fs.writeFile(errorPath, JSON.stringify(this.errorTile));
                        } else if (fs.existsSync(errorPath)) {
                            fs.unlinkSync(errorPath);
                        }
                        console.log(this.name, "下载完成");
                        resolve();
                    } else if (this.downloading <= 5) {
                        this.download().then(() => { resolve() });
                    }
                });
            }
        });
    }
    protected downloadTile(z, x, y): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var dir = path.join(this.path, z.toString(), x.toString());
            var file = path.join(dir, y + '.' + this.tileFormat);
            if (fs.existsSync(file)) {
                resolve(true);
                return;
            }
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            var index = (z + x + y) % this.urls.length;

            var url = this.formatUrl(this.urls[index], z, x, y);
            if (!this.labelUrls) {
                request(url, { encoding: null, headers: this.headers }, (error, response, body) => {
                    if (error || response.statusCode !== 200) {
                        this.errorTile.push({ z: z, x: x, y: y, error: error || response.statusMessage });
                        resolve(false);
                    } else {
                        this.mbtiles.putTile(z, x, y, body, (err) => {
                            err && console.log(this.name, err);
                            resolve(true);
                        });
                        fs.writeFile(file, body);
                    }
                });
                // request(url, { headers: this.headers }).on('response', (response) => {
                //     resolve(true);
                // }).on('error', (err) => {
                //     this.errorTile.push({ z: z, x: x, y: y, error: err });
                //     resolve(false);
                // }).pipe(fs.createWriteStream(file));
            } else {
                var labelUrl = this.formatUrl(this.labelUrls[index], z, x, y);
                //gm图像合并(被合并的图像只能是文件)
                // request(labelUrl).on('response', (response) => {
                //     request(url, { encoding: null }, (error, response, body) => {
                //         if (!error) {
                //             (<any>gm(body)).composite(file).write(file, (err) => {
                //                 err && console.log(err);
                //             });
                //         }
                //         resolve(true);
                //     });
                // }).on('error', (err) => {
                //     this.errorTile.push({ z: z, x: x, y: y, error: err });
                //     resolve(false);
                // }).pipe(fs.createWriteStream(file));

                //sharp图像合并(两个图像都可以是流)
                request(url, { encoding: null, headers: this.headers }, (error, response, body) => {
                    if (error || response.statusCode !== 200) {
                        this.errorTile.push({ z: z, x: x, y: y, error: error || response.statusMessage });
                        resolve(false);
                        return;
                    }
                    request(labelUrl, { encoding: null, headers: this.headers }, (error1, response1, body1) => {
                        var img = sharp(body);
                        if (!error1) {
                            img = img.overlayWith(body1);
                        }
                        img.jpeg().toBuffer((err, buffer) => {
                            this.mbtiles.putTile(z, x, y, buffer, (err) => {
                                err && console.log(this.name, err);
                                resolve(true);
                            });
                        }).toFile(file);
                    });
                });
            }
        });
    }
    protected formatUrl(url, z, x, y) {
        return url.replace("{z}", z).replace("{x}", x).replace("{y}", y);
    }
}