/**
 * 坐标转换工具类(百度、火星、Wgs84)
 */
export class CoordTransform {
    /**
     *
     */
    constructor() {

    }
    //定义一些常量
    private static x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    private static PI = 3.1415926535897932384626;
    private static a = 6378245.0;
    private static ee = 0.00669342162296594323;
    /**
    * 百度墨卡托 (BD-09) 转 WGS84
    * @param coord:[number, number]
    * @returns [number, number]
    */
    static bd09mctowgs84(coord: [number, number]): [number, number] {
        var bd = this.convertMC2LL(coord[0], coord[1]);
        return this.bd09towgs84(bd);
    }

    /**
    * WGS84 转 百度墨卡托 (BD-09)
    * @param coord:[number, number]
    * @returns [number, number]
    */
    static wgs84tobd09mc(coord: [number, number]): [number, number] {
        var bd = this.wgs84tobd09(coord);
        return this.convertLL2MC(bd[0], bd[1]);
    }
    /**
    * GCJ02墨卡托 转 WGS84
    * @param coord:[number, number]
    * @returns [number, number]
    */
    static gcj02mctowgs84(coord: [number, number]): [number, number] {
        var gcj = this.mercatortowgs84(coord);
        return this.gcj02towgs84(gcj);
    }

    /**
    * WGS84 转 GCJ02墨卡托
    * @param coord:[number, number]
    * @returns [number, number]
    */
    static wgs84togcj02mc(coord: [number, number]): [number, number] {
        var gcj = this.wgs84togcj02(coord);
        return this.wgs84tomercator(gcj);
    }
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    static bd09togcj02(coord: [number, number]): [number, number] {
        var bd_lon = coord[0];
        var bd_lat = coord[1];
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static gcj02tobd09(coord: [number, number]): [number, number] {
        var lng = coord[0];
        var lat = coord[1];
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }
    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static wgs84togcj02(coord: [number, number]): [number, number] {
        var lng = coord[0];
        var lat = coord[1];
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [mglng, mglat]
        }
    };
    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static gcj02towgs84(coord: [number, number]): [number, number] {
        var lng = coord[0];
        var lat = coord[1];
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        }
    };
    /**
     * WGS84 与 WebMercator 的转换
     * @param lon
     * @param lat
     * @returns {*[]}
     */
    static wgs84tomercator(coord: [number, number]): [number, number] {
        var lng = coord[0];
        var lat = coord[1];
        var x = lng * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        return [x, y];
    }
    /**
     * WebMercator 与 WGS84 的转换
     * @param lon
     * @param lat
     * @returns {*[]}
     */
    static mercatortowgs84(coord: [number, number]): [number, number] {
        var lng = coord[0];
        var lat = coord[1];
        var x = lng / 20037508.34 * 180;
        var y = lat / 20037508.34 * 180;
        y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
        return [x, y];
    }
    /**
     * 百度坐标系 (BD-09) 与 WGS84 的转换
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    static bd09towgs84(coord: [number, number]): [number, number] {
        var gcj = this.bd09togcj02(coord);
        return this.gcj02towgs84(gcj);
    }

    /**
     * WGS84 与百度坐标系 (BD-09) 的转换
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    private static wgs84tobd09(coord: [number, number]): [number, number] {
        var gcj = this.wgs84togcj02(coord);
        return this.gcj02tobd09(gcj);
    }

    private static transformlat(lng: number, lat: number) {
        var lat = +lat;
        var lng = +lng;
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
        return ret
    };

    private static transformlng(lng: number, lat: number) {
        var lat = +lat;
        var lng = +lng;
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    private static out_of_china(lng: number, lat: number) {
        var lat = +lat;
        var lng = +lng;
        // 纬度3.86~53.55,经度73.66~135.05 
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }

    private static EARTHRADIUS = 6370996.81;
    private static MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
    private static LLBAND = [75, 60, 45, 30, 15, 0];
    private static MC2LL = [[1.410526172116255e-8, 898305509648872e-20, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -.03801003308653, 17337981.2], [-7.435856389565537e-9, 8983055097726239e-21, -.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86], [-3.030883460898826e-8, 898305509983578e-20, .30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, .32710905363475, 6856817.37], [-1.981981304930552e-8, 8983055099779535e-21, .03278182852591, 40.31678527705744, .65659298677277, -4.44255534477492, .85341911805263, .12923347998204, -.04625736007561, 4482777.06], [3.09191371068437e-9, 8983055096812155e-21, 6995724062e-14, 23.10934304144901, -.00023663490511, -.6321817810242, -.00663494467273, .03430082397953, -.00466043876332, 2555164.4], [2.890871144776878e-9, 8983055095805407e-21, -3.068298e-8, 7.47137025468032, -353937994e-14, -.02145144861037, -1234426596e-14, .00010322952773, -323890364e-14, 826088.5]];
    private static LL2MC = [[-.0015702102444, 111320.7020616939, 0x60e374c3105a3, -0x24bb4115e2e164, 0x5cc55543bb0ae8, -0x7ce070193f3784, 0x5e7ca61ddf8150, -0x261a578d8b24d0, 0x665d60f3742ca, 82.5], [.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5], [.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5], [.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-.0003218135878613132, 111320.7020701615, .00369383431289, 823725.6402795718, .46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, .37238884252424, 7.45]];
    /**
     * 百度墨卡托坐标转经纬度坐标
     * @param x
     * @param y
     * @return
     */
    private static convertMC2LL(x: number, y: number): [number, number] {
        var cF = null;
        x = Math.abs(x);
        y = Math.abs(y);
        for (var cE = 0; cE < this.MCBAND.length; cE++) {
            if (y >= this.MCBAND[cE]) {
                cF = this.MC2LL[cE];
                break;
            }
        }
        return this.converter(x, y, cF);
    }
    /**
     * 百度经纬度坐标转墨卡托坐标
     * @param lng
     * @param lat
     * @return
     */
    private static convertLL2MC(lng: number, lat: number): [number, number] {
        var cE = null;
        lng = this.getLoop(lng, -180, 180);
        lat = this.getRange(lat, -74, 74);
        for (var i = 0; i < this.LLBAND.length; i++) {
            if (lat >= this.LLBAND[i]) {
                cE = this.LL2MC[i];
                break;
            }
        }
        if (cE != null) {
            for (var i = this.LLBAND.length - 1; i >= 0; i--) {
                if (lat <= -this.LLBAND[i]) {
                    cE = this.LL2MC[i];
                    break;
                }
            }
        }
        return this.converter(lng, lat, cE);
    }
    private static converter(x: number, y: number, cE: number[]): [number, number] {
        var xTemp = cE[0] + cE[1] * Math.abs(x);
        var cC = Math.abs(y) / cE[9];
        var yTemp = cE[2] + cE[3] * cC + cE[4] * cC * cC + cE[5] * cC * cC * cC + cE[6] * cC * cC * cC * cC + cE[7] * cC * cC * cC * cC * cC + cE[8] * cC * cC * cC * cC * cC * cC;
        xTemp *= (x < 0 ? -1 : 1);
        yTemp *= (y < 0 ? -1 : 1);
        return [xTemp, yTemp];
    }
    private static getLoop(lng: number, min: number, max: number): number {
        while (lng > max) {
            lng -= max - min;
        }
        while (lng < min) {
            lng += max - min;
        }
        return lng;
    }
    private static getRange(lat: number, min: number, max: number): number {
        if (min != null) {
            lat = Math.max(lat, min);
        }
        if (max != null) {
            lat = Math.min(lat, max);
        }
        return lat;
    }
}