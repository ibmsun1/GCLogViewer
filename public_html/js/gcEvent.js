/* 
 * Copyright 2014 mark.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

app.factory("GCEvent", function () {

    function FileData(fileName, md5Sum, host, date) {
        this.fileName = fileName;
        this.md5Sum = md5Sum;
        this.host = host;
        this.date = date;
    }

    function GCEvent(dateStamp, timeStamp,
            youngGenUsedPrior, youngGenUsedAfter, totalYoungGen,
            totalUsedPrior, totalUsedAfter, totalHeap, time, fileKey) {
        this.timeStamp = parseFloat(timeStamp);
        if (dateStamp !== null) {
            this.dateStamp = Date.parse(dateStamp);
        }
        this.youngGenUsedPrior = parseInt(youngGenUsedPrior);
        this.youngGenUsedAfter = parseInt(youngGenUsedAfter);
        this.totalYoungGen = parseInt(totalYoungGen);
        this.totalUsedPrior = parseInt(totalUsedPrior);
        this.totalUsedAfter = parseInt(totalUsedAfter);
        this.totalHeap = parseInt(totalHeap);
        this.time = parseFloat(time);
        this.fileKey = fileKey;
    }

    var getFileData = function (file, md5sum, host, date) {
        var fileObj = new FileData(file, md5sum, host, date);
        return fileObj;
    };

    //Refactor Me
    var parseLogEntry = function (line, filekey, nogcDetails) {
        var regex;
        var data;
        if (nogcDetails) {
            regex = /(?:(?:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*)(?:\+\d*:\s))?(\d+\.\d+):\s)?.*?(?: (?:(\d+)K->(\d+)K\((\d+)K\)(?:,\s(\d*\.\d*) secs)?)\]) ?/;
            var matches = line.match(regex);
            if (!matches) {
                return;
            }
            var dateStamp = matches[1];
            var timeStamp = matches[2];
            var youngGenUsedPrior = 0;
            var youngGenUsedAfter = 0;
            var totalYoungGen = 0;
            var youngTime = 0;
            var totalUsedPrior = matches[3];
            var totalUsedAfter = matches[4];
            var totalHeap = matches[5];
            var time = matches[6];
            data = new GCEvent(dateStamp, timeStamp,
                    youngGenUsedPrior, youngGenUsedAfter, totalYoungGen,
                    totalUsedPrior, totalUsedAfter, totalHeap, time, filekey);

        } else {
            regex = /(?:(?:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*)(?:\+\d*:\s))?(\d+\.\d+):\s)?.*?(?: (?:(\d+)K->(\d+)K\((\d+)K\)(?:,\s(\d*\.\d*) secs)?)\]) ?(?:\s(\d+)K->(\d+)K\((\d+)K\))(?:,\s(\d*\.\d*) secs\])?/;
            var matches = line.match(regex);
            if (!matches) {
                return;
            }
            //console.log(matches);
            var dateStamp = matches[1];
            var timeStamp = matches[2];
            var youngGenUsedPrior = matches[3];
            var youngGenUsedAfter = matches[4];
            var totalYoungGen = matches[5];
            var youngTime = matches[6];
            var totalUsedPrior = matches[7];
            var totalUsedAfter = matches[8];
            var totalHeap = matches[9];
            var time = matches[10];
            data = new GCEvent(dateStamp, timeStamp,
                    youngGenUsedPrior, youngGenUsedAfter, totalYoungGen,
                    totalUsedPrior, totalUsedAfter, totalHeap, time, filekey);
        }
        return data;
    };

    return {
        parseLogEntry: parseLogEntry,
        getFileData: getFileData
    };

});