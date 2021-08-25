var linebot = require('linebot');
var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
const { data } = require('cheerio/lib/api/attributes');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

var bot = linebot({
  channelId: 輸入channelId,
  channelSecret: "輸入channelSecret",
  channelAccessToken: "輸入channelAccessToken"
});
var timer;
_covid19();

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

function _covid19() {
  clearTimeout(timer);
  let ts = Date.now();

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  console.log(year + "." + month + "." + date);
  let today = year + "." + month + "." + date;
  let today_date = year + "/" + month + "/" + date;
  request({
    url: "https://www.cdc.gov.tw/Bulletin/List/MmgtpeidAR5Ooai4-fgHzQ?startTime=" + today + "&endTime=" + today,
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      console.log(error);
      return;
    } else {
      try {
        var $ = cheerio.load(body);
        var target = $(".JQdotdotdot");
        for (i in target) {
          try {
            today_case = target[i].children[0].data;
            if (today_case.indexOf("新增") != -1 && today_case.indexOf("COVID-19") != -1 && today_case.indexOf("病例") !=-1) {
              console.log(today_date + " " + today_case);
              bot.broadcast(today_date + " " + today_case)
              sleep(10000).then(() => {
                process.exit(1);
              });
            }
          } catch (error) {
            console.log("不是不報，時候未到");
            break;
          }
        }
      } catch (error) {
        console.log("疾管署官網又死掉了");
      }
      timer = setInterval(_covid19, 300000);

    }
  });
}
