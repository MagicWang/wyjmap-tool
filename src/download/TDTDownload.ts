import { BaseDownload } from "./BaseDownload";
import { CoordTransform } from "../utils/CoordTransform";

export class TDTDownload extends BaseDownload {
    constructor(parameters) {
        super(parameters);
        var origin_c = [-180, 90];
        var resolutions_c = [1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625, 0.000010728836059570312, 0.000005364418029785156, 0.000002682209014892578, 0.000001341104507446289, 6.705522537231445e-7, 3.3527612686157227e-7, 1.6763806343078613e-7, 8.381903171539307e-8, 4.190951585769653e-8, 2.0954757928848267e-8, 1.0477378964424133e-8, 5.238689482212067e-9, 2.6193447411060333e-9, 1.3096723705530167e-9, 6.548361852765083e-10, 3.2741809263825417e-10, 1.6370904631912708e-10, 8.185452315956354e-11, 4.092726157978177e-11, 2.0463630789890885e-11, 1.0231815394945443e-11, 5.115907697472721e-12, 2.5579538487363607e-12, 1.2789769243681803e-12, 6.394884621840902e-13, 3.197442310920451e-13];
        var origin_w = [-20037508.342789244, 20037508.342789244];
        var resolutions_w = [156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974, 0.14929107086948487, 0.07464553543474244, 0.03732276771737122, 0.01866138385868561, 0.009330691929342804, 0.004665345964671402, 0.002332672982335701, 0.0011663364911678506, 0.0005831682455839253, 0.00029158412279196264, 0.00014579206139598132, 0.00007289603069799066, 0.00003644801534899533, 0.000018224007674497665, 0.000009112003837248832, 0.000004556001918624416, 0.000002278000959312208, 0.000001139000479656104, 5.69500239828052e-7, 2.84750119914026e-7, 1.42375059957013e-7, 7.11875299785065e-8, 3.559376498925325e-8];
        var vec_cUrls = [
            "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}"
        ];
        var cva_cUrls = [
            "http://t0.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}"
        ];
        var img_cUrls = [
            "http://t0.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}"
        ];
        var cia_cUrls = [
            "http://t0.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cia_c&L={z}&Y={y}&X={x}"
        ];
        var ter_cUrls = [
            "http://t0.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}"
        ];
        var cta_cUrls = [
            "http://t0.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cta_c&L={z}&Y={y}&X={x}"
        ];
        var vec_wUrls = [
            "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}"
        ];
        var cva_wUrls = [
            "http://t0.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cva_w&L={z}&Y={y}&X={x}"
        ];
        var img_wUrls = [
            "http://t0.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}"
        ];
        var cia_wUrls = [
            "http://t0.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}"
        ];
        var ter_wUrls = [
            "http://t0.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=ter_w&L={z}&Y={y}&X={x}"
        ];
        var cta_wUrls = [
            "http://t0.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t1.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t2.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t3.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t4.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t5.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t6.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}",
            "http://t7.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}"
        ];
        if (this.mapType.indexOf('mc') > 0) {
            this.origin = origin_w;
            this.resolutions = resolutions_w;
            this.slUrls = vec_wUrls;
            this.slLabelUrls = cva_wUrls;
            this.yxUrls = img_wUrls;
            this.yxLabelUrls = cia_wUrls;
            this.dxUrls = ter_wUrls;
            this.dxLabelUrls = cta_wUrls;
        } else {
            this.origin = origin_c;
            this.resolutions = resolutions_c;
            this.slUrls = vec_cUrls;
            this.slLabelUrls = cva_cUrls;
            this.yxUrls = img_cUrls;
            this.yxLabelUrls = cia_cUrls;
            this.dxUrls = ter_cUrls;
            this.dxLabelUrls = cta_cUrls;
        }
    }
    calculateTile() {
        if (this.mapType.indexOf('mc') > 0) {
            var lb = CoordTransform.wgs84tomercator([this.extent[0], this.extent[1]]);
            var rt = CoordTransform.wgs84tomercator([this.extent[2], this.extent[3]]);
            this.actualExtent = lb.concat(rt);
        } else {
            this.actualExtent = this.extent;
        }
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