import { BaseDownload } from "./BaseDownload";
import { GaodeDownload } from "./GaodeDownload";
import { BaiduDownload } from "./BaiduDownload";
import { GoogleDownload } from "./GoogleDownload";
import { TDTDownload } from "./TDTDownload";
import { QQDownload } from "./QQDownload";
import { OsmDownload } from "./OsmDownload";
import { CoordTransform } from "../utils/CoordTransform";
const districts = require('../districts.json');

export class DownloadTask {
    constructor(parameters) {
        if (!parameters) return;
        this.name = parameters.name;
        this.mapType = parameters.mapType;
        if (!parameters.extent || parameters.extent.length <= 0) {
            var d = districts.RECORDS;
            for (let i = 0; i < d.length; i++) {
                const element = d[i];
                if (element.adcode === parameters.adcode) {
                    var lb = CoordTransform.gcj02towgs84([element.minx, element.miny]);
                    var rt = CoordTransform.gcj02towgs84([element.maxx, element.maxy]);
                    parameters.extent = lb.concat(rt);
                    break;
                }
            }
        }
        switch (this.mapType) {
            case "baiduSL"://百度矢量
            case "baiduYX"://百度影像
                this.downloader = new BaiduDownload(parameters);
                break;
            case "googleSL"://谷歌矢量
            case "googleYX"://谷歌影像
                this.downloader = new GoogleDownload(parameters);
                break;
            case "tdtSL"://天地图矢量
            case "tdtYX"://天地图影像
            case "tdtDX"://天地图地形
            case "tdtmcSL"://天地图墨卡托矢量
            case "tdtmcYX"://天地图墨卡托影像
            case "tdtmcDX"://天地图墨卡托地形
                this.downloader = new TDTDownload(parameters);
                break;
            case "qqSL"://腾讯矢量
            case "qqYX"://腾讯影像
            case "qqDX"://腾讯地形
                this.downloader = new QQDownload(parameters);
                break;
            case "osmSL"://osm矢量
                this.downloader = new OsmDownload(parameters);
                break;
            case "gaodeSL"://高德矢量
            case "gaodeYX"://高德影像
            default:
                this.downloader = new GaodeDownload(parameters);
                break;
        }
    }
    private name;
    private mapType;
    private downloader: BaseDownload;
    start() {
        this.downloader.start();
    }
}