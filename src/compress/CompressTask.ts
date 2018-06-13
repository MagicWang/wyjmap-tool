var MBTiles = require('@mapbox/mbtiles');
var zlib = require('zlib');
var fs = require('file-system');
import * as path from 'path';

export class CompressTask {
    constructor(parameters) {
        if (!parameters) return;
        this.name = parameters.name;
        this.path = path.join(__dirname, '../', parameters.path);
    }
    private name;
    private path;
    private mbtiles;
    public start() {

        this.mbtiles = new MBTiles(path.join(this.path, "file.mbtiles"), (err, mbtiles) => {
            if (err) {
                console.log(this.name, err);
                return;
            }
            console.log(this.name, '开始压缩');
            mbtiles.startWriting((err) => {
                if (err) {
                    console.log(this.name, err);
                    return;
                }
                var complete = 0;
                fs.recurseSync(this.path, ['**/*.png'], (filepath, relative, filename) => {
                    var arr = relative.split(path.sep);
                    var z = parseInt(arr[0]);
                    var x = parseInt(arr[1]);
                    var y = parseInt(arr[2]);
                    var buffer = fs.readFileSync(filepath);
                    mbtiles.putTile(z, x, y, buffer, (err) => {
                        if (err) {
                            console.log(this.name, err);
                            return;
                        }
                        console.log(this.name, '已压缩:' + ++complete);
                    });
                });
                mbtiles.stopWriting((err) => {
                    if (err) {
                        console.log(this.name, err);
                        return;
                    }
                    console.log(this.name, '压缩完成');
                });
            });
        });
    }
}