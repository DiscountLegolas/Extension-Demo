// JavaScript source code

var comments = new Array();
var slider = document.getElementById("lkcnt");
var output = document.getElementById("demo");
var http = new XMLHttpRequest();
output.innerHTML = slider.value;
slider.oninput = function () {
    output.innerHTML = this.value;
}
var keywords = document.getElementById("keywords");
document.getElementById("redirect").addEventListener("click", function (ev) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var taburl = tabs[0].url + '';
        if (taburl.includes("https://www.youtube.com/watch?")) {
            var query = taburl.replace("https://www.youtube.com/watch?", "");
            document.getElementById("a").innerHTML = "";
            var url = "https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyCJFYiaxChWFerCMUYo5cn4Xlf0cdk9YRM&textFormat=plainText&part=snippet&videoId=" + query.substring(2, 13) + "&maxResults=100";
            http.open("GET", url, true);
            http.onload = () => {
                var resp = JSON.parse(http.response);
                var arr = keywords.value.split(",");
                for (var i = 0; i < resp.items.length; i++) {
                    var commentthread = resp.items[i];
                    var topcomment = commentthread.snippet.topLevelComment.snippet;
                    if (topcomment.likeCount >= slider.value) {
                        for (var j = 0; j < arr.length; j++) {
                            var keyword = arr[j];
                            if (topcomment.textDisplay.toLowerCase().includes(keyword.toLowerCase())) {
                                comments.push(topcomment.textDisplay.toString())   
                                break;
                            }
                        }
                    }
                }
            };
            http.send(null);
            for (var i = 0; i < comments.length; i++) {
                var li = document.createElement("li");
                li.textContent = comments[i];
                document.getElementById("a").appendChild(li);
            }
            /*
            var btn = document.createElement("BUTTON")
            var t = document.createTextNode("CLICK ME");
            btn.appendChild(t);
            //Appending to DOM 
            document.body.appendChild(btn);
            */
        }
        // use `url` here inside the callback because it's asynchronous!
    });
})
function getnextpage(url, nextpagetoken) {
    var newurl = url + "&pagetoken=" + nextpagetoken;
    http.open("GET", newurl, true);
    http.onload = () => {
        var resp = JSON.parse(http.response);
        var arr = keywords.value.split(",");
        for (var i = 0; i < resp.items.length; i++) {
            var commentthread = resp.items[i];
            var topcomment = commentthread.snippet.topLevelComment.snippet;
            if (topcomment.likeCount >= slider.value) {
                for (var j = 0; j < arr.length; j++) {
                    var keyword = arr[j];
                    if (topcomment.textDisplay.toLowerCase().includes(keyword.toLowerCase())) {
                        comments.push(topcomment.textDisplay);
                        break;
                    }
                }
            }
        }
    };
    http.send(null);

}