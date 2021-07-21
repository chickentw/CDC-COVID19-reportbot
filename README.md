# CDC-COVID19-reportbot

此為LineBot，可部署在heroku並啟用heroku scheduler，每天下午兩點啟動“NPM START“

可自動擷取疾管署最新確診新聞稿標題並廣播給所有Linebot好友

# 需要的module

npm install linebot express --save

npm install request

npm install cheerio

# 限制
無法傳送至群組，若需傳送至群組可變更以下代碼

bot.broadcast(today_date + " " + today_case);

改為

bot.push('群組ID', today_date + " " + today_case);
