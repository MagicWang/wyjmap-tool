import { BaseDownload } from "./BaseDownload";
import { CoordTransform } from "../utils/CoordTransform";

export class BaiduDownload extends BaseDownload {
    constructor(parameters) {
        super(parameters);
        this.origin = [0, 0];
        this.resolutions = [262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];
        this.slUrls = [
            "http://online0.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online1.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online2.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online3.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online4.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online5.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online6.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online7.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online8.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}",
            "http://online9.map.bdimg.com/tile/?qt=tile&styles=pl&x={x}&y={y}&z={z}"
        ];
        this.yxUrls = [
            "http://shangetu0.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu1.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu2.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu3.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu4.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu5.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu6.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu7.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu8.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            "http://shangetu9.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46"
        ];
        this.yxLabelUrls = [
            "http://online0.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online1.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online2.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online3.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online4.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online5.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online6.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online7.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online8.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}",
            "http://online9.map.bdimg.com/tile/?qt=tile&styles=sl&x={x}&y={y}&z={z}"
        ];
    }
    calculateTile() {
        var lb = CoordTransform.wgs84tobd09mc([this.extent[0], this.extent[1]]);
        var rt = CoordTransform.wgs84tobd09mc([this.extent[2], this.extent[3]]);
        this.actualExtent = lb.concat(rt);
        this.tiles = [];
        for (let i = this.minZoom; i <= this.maxZoom; i++) {
            var resolution = this.resolutions[i];
            var minx = Math.floor((this.actualExtent[0] - this.origin[0]) / (resolution * this.tileSize));
            var miny = Math.floor((this.actualExtent[1] - this.origin[1]) / (resolution * this.tileSize));
            var maxx = Math.ceil((this.actualExtent[2] - this.origin[0]) / (resolution * this.tileSize));
            var maxy = Math.ceil((this.actualExtent[3] - this.origin[1]) / (resolution * this.tileSize));
            for (let x = minx; x < maxx; x++) {
                for (let y = miny; y < maxy; y++) {
                    this.tiles.push({
                        x: x,
                        y: y,
                        z: i
                    });
                }
            }
        }
    }
}