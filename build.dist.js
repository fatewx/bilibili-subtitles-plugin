// ==UserScript==
// @name         bilibili外挂字幕 哔哩哔哩外挂字幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  哔哩哔哩外挂字幕
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/373379-subtitle-utils-module/code/subtitle%20utils%20module.js?version=637875
// ==/UserScript==
(function() {
    'use strict';
    let body = document.getElementsByTagName('body')[0];
    console.log(body);
    body.innerHTML = '<button id="open-file">Open a file</button>' + body.innerHTML; // 插入添加文件的
    window.currentTime = 0
    $("button").click(function() {

        let videoSubtitle = document.getElementById('viewbox_report')
        videoSubtitle.innerHTML = '<h1 class="video-title"><span class="tit tr-fix" id="custom-subtitle-1">【字幕】</span></h1><h1 class="video-title"><span class="tit tr-fix" id="custom-subtitle-2"> </span></h1>' + videoSubtitle.innerHTML
        let fileInput = document.createElement("input")
        fileInput.type = 'file'
        fileInput.style.display = 'none'
        fileInput.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                document.body.removeChild(fileInput)
                console.log(contents)

                var targetNode = document.getElementsByClassName('bilibili-player-video-time-now')[0]

                var config = {
                    attributes: true,
                    childList: true,
                    subtree: true
                };

                var callback = function(mutationsList, observer) {
                        //console.log(observer.subtitles)
                        let strTime = targetNode.innerHTML
                        if (strTime.length <= 5) {
                            strTime = "00:" + strTime + ",000"
                        } else {
                            strTime = strTime + ",000"
                        }
                        console.log(strTime)
                        let time = window.Subtitle.toMS(strTime);
                        if (time == window.currentTime){
                            return;
                        }
                        window.currentTime = time
                        console.log(time);


                        let custom_subtitle_1 = document.getElementById('custom-subtitle-1');
                        let binarySearch = function(target, arr) {
                            var start = 0;
                            var end = arr.length - 1;

                            while (start <= end) {
                                var mid = parseInt(start + (end - start) / 2);
                                if (target >= arr[mid].start && target <=arr[mid].end) {
                                    return mid;
                                } else if (target > arr[mid].end) {
                                    start = mid + 1;
                                } else {
                                    end = mid - 1;
                                }
                            }
                            return -1;
                        }

                        let subtitles = observer.subtitles;
                        var pos = binarySearch(time, subtitles)
                        if (pos == -1) return;
                        console.log(subtitles[pos].text);
                        custom_subtitle_1.innerHTML = "【字幕】" + subtitles[pos].text;
                        window.subtitleCount += 1
                };

                var observer = new MutationObserver(callback);

                // 将字幕转换为对象数组
                try {
                    observer.subtitles = window.Subtitle.parse(contents)
                } catch (e) {
                    alert("字幕解析出现问题");
                }
                observer.observe(targetNode, config);
            }
            reader.readAsText(file)
        }
        document.body.appendChild(fileInput)
        var eventMouse = document.createEvent("MouseEvents")
        eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        fileInput.dispatchEvent(eventMouse)
    })


    // Your code here...
})();
