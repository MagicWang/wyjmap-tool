import { BaseDownload } from "./BaseDownload";
import { CoordTransform } from "../utils/CoordTransform";

export class GaodeDownload extends BaseDownload {
    constructor(parameters) {
        super(parameters);
        this.origin = [-20037508.342789244, 20037508.342789244];
        this.resolutions = [156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974, 0.14929107086948487, 0.07464553543474244, 0.03732276771737122, 0.01866138385868561, 0.009330691929342804, 0.004665345964671402, 0.002332672982335701, 0.0011663364911678506, 0.0005831682455839253, 0.00029158412279196264, 0.00014579206139598132, 0.00007289603069799066, 0.00003644801534899533, 0.000018224007674497665, 0.000009112003837248832, 0.000004556001918624416, 0.000002278000959312208, 0.000001139000479656104, 5.69500239828052e-7, 2.84750119914026e-7, 1.42375059957013e-7, 7.11875299785065e-8, 3.559376498925325e-8];
        this.slUrls = [
            "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&Z={z}&Y={y}&X={x}"
        ];
        this.yxUrls = [
            "http://webst01.is.autonavi.com/appmaptile?size=1&scale=1&style=6&Z={z}&Y={y}&X={x}",
            "http://webst02.is.autonavi.com/appmaptile?size=1&scale=1&style=6&Z={z}&Y={y}&X={x}",
            "http://webst03.is.autonavi.com/appmaptile?size=1&scale=1&style=6&Z={z}&Y={y}&X={x}",
            "http://webst04.is.autonavi.com/appmaptile?size=1&scale=1&style=6&Z={z}&Y={y}&X={x}"
        ];
        this.yxLabelUrls = [
            "http://webst01.is.autonavi.com/appmaptile?size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webst02.is.autonavi.com/appmaptile?size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webst03.is.autonavi.com/appmaptile?size=1&scale=1&style=8&Z={z}&Y={y}&X={x}",
            "http://webst04.is.autonavi.com/appmaptile?size=1&scale=1&style=8&Z={z}&Y={y}&X={x}"
        ];
    }
    calculateTile() {
        var lb = CoordTransform.wgs84togcj02mc([this.extent[0], this.extent[1]]);
        var rt = CoordTransform.wgs84togcj02mc([this.extent[2], this.extent[3]]);
        this.actualExtent = lb.concat(rt);
        this.tiles = [];
        for (let i = this.minZoom; i <= this.maxZoom; i++) {
            var resolution = this.resolutions[i];
            var minx = Math.floor((this.actualExtent[0] - this.origin[0]) / (resolution * this.tileSize));
            var miny = Math.ceil(-(this.actualExtent[1] - this.origin[1]) / (resolution * this.tileSize));
            var maxx = Math.ceil((this.actualExtent[2] - this.origin[0]) / (resolution * this.tileSize));
            var maxy = Math.floor(-(this.actualExtent[3] - this.origin[1]) / (resolution * this.tileSize));
            for (let x = minx; x < maxx; x++) {
                for (let y = maxy; y < miny; y++) {
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