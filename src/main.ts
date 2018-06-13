import { DownloadTask } from "./download/DownloadTask";
import { CompressTask } from "./compress/CompressTask";
const config = require('./config.json');

for (let i = 0; i < config.downloadTasks.length; i++) {
  const element = config.downloadTasks[i];
  let downloadTask = new DownloadTask(element);
  downloadTask.start();
}

for (let i = 0; i < config.compressTasks.length; i++) {
  const element = config.compressTasks[i];
  let compressTask = new CompressTask(element);
  compressTask.start();
}
