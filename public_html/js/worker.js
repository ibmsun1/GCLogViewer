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

importScripts("gcViewerDB.js", "db.js");

self.addEventListener('message', function (e) {
    var array = e.data;
    getChartObject(array);
});

function getChartObject(array) {
    var propBag = {
        minHeap: 99999999,
        maxHeap: 0,
        minTimeStamp: 9999999999,
        maxTimeStamp: 0,
        series: [{
                name: 'Young Gen Used',
                colour: 'orange',
                data: []
            },
            {
                name: 'Young Gen Total',
                colour: 'blue',
                data: []
            },
            {
                name: 'Old Gen Used',
                colour: 'red',
                data: []
            },
            {
                name: 'Total Heap',
                colour: 'green',
                data: []
            }
        ]
    };
    array.forEach(function (value, index, array) {
        propBag.series[0].data.push({x: value.timeStamp - 1, y: isNaN(value.youngGenUsedPrior) ? 0 : value.youngGenUsedPrior});
        propBag.series[1].data.push({x: value.timeStamp - 1, y: isNaN(value.totalYoungGen) ? 0 : value.totalYoungGen});
        propBag.series[2].data.push({x: value.timeStamp - 1, y: isNaN(value.totalUsedPrior) ? 0 : value.totalUsedPrior});
        propBag.series[3].data.push({x: value.timeStamp - 1, y: isNaN(value.totalHeap) ? 0 : value.totalHeap});

        propBag.series[0].data.push({x: value.timeStamp, y: isNaN(value.youngGenUsedAfter) ? 0 : value.youngGenUsedAfter});
        propBag.series[1].data.push({x: value.timeStamp, y: isNaN(value.totalYoungGen) ? 0 : value.totalYoungGen});
        propBag.series[2].data.push({x: value.timeStamp, y: isNaN(value.totalUsedAfter) ? 0 : value.totalUsedAfter});
        propBag.series[3].data.push({x: value.timeStamp, y: isNaN(value.totalHeap) ? 0 : value.totalHeap});

        propBag.miny = value.totalHeap < propBag.minHeap ? value.totalHeap : propBag.minHeap;
        propBag.maxy = value.totalHeap > propBag.maxHeap ? value.totalHeap : propBag.maxHeap;
        propBag.minx = value.timeStamp < propBag.minTimeStamp ? value.timeStamp : propBag.minTimeStamp;
        propBag.maxx = value.timeStamp > propBag.maxTimeStamp ? value.timeStamp : propBag.maxTimeStamp;
    });
    console.log(propBag);
    this.postMessage(propBag);
}