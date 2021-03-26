let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"
let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
// request(url,cb);

// function cb(error, response, html)
// {
//     if(error)
//     {
//         console.log(error);
//     }
//     else{
//         extractTeam(html);
//     }
// }

// function extractTeam(html)
// {
//     let selectorTool = cheerio.load(html);
//     let teamName = selectorTool(".text-left.blue-text.pl-3");
//     for(let i=0; i<teamName.length; i++)
//     {
//         let folder = selectorTool(teamName[i]).text();
//         let dirpath = path.join(__dirname,"ipl 2020",folder.trim());
//         // console.log(dirpath);
//         dirCreator(dirpath);
//     }
// }
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results",cb1);
function cb1(error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else
    {
        extractMatches(html);
    }
}
function extractMatches(html)
{
    let selectorTool = cheerio.load(html);
    let matches = selectorTool("a.match-info-link-FIXTURES");
    for(let i=0; i<matches.length; i++)
    {
        let link = selectorTool(matches[i]).attr("href");
        link = "https://www.espncricinfo.com" + link;
        request(link,cb2);
    }
}
function cb2(error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else
    {
        extractPlayer(html);
    }
}
function extractPlayer(html)
{
    let selectorTool = cheerio.load(html);
    let teamNameArr = selectorTool(".header-title.label");
    let batsmanTableArr = selectorTool(".table.batsman tbody");
    let str = selectorTool(".match-info.match-info-MATCH>.description").text();
    let newstr = str.split(",");
    let venue = newstr[1].trim();
    let date = newstr[2].trim();
    let result = selectorTool(".match-info.match-info-MATCH>.status-text>span").text();
    let z = 1;
    for(let i=0; i<2; i++)
    {
        
        let teamName = selectorTool(teamNameArr[i]).text();
        let oppTeamName = selectorTool(teamNameArr[z]).text();
        teamName = teamName.substring(0, teamName.indexOf(" INNINGS"));
        oppTeamName = oppTeamName.substring(0, oppTeamName.indexOf(" INNINGS"));
        z--;
        // console.log("-----------"+teamName+" "+date+" "+venue+"-------------");
        // console.log(oppTeamName);

        let batsmanTableRowArr = selectorTool(batsmanTableArr[i]).find("tr");
        
        for(let j=0; j<batsmanTableRowArr.length - 2; j = j + 2)
        {
            let playerData = selectorTool(batsmanTableRowArr[j]).find("td");
            let arr = [];
            let playerName = selectorTool(playerData[0]).text();
            let runs = selectorTool(playerData[2]).text();
            let balls = selectorTool(playerData[3]).text();
            let fours = selectorTool(playerData[5]).text();
            let sixes = selectorTool(playerData[6]).text();
            let sr = selectorTool(playerData[7]).text();
            arr.push({
                "Date": date,
                "Venue": venue,
                "Opp Team": oppTeamName,
                "Runs": runs,
                "Balls": balls,
                "Fours": fours,
                "Sixes": sixes,
                "SR": sr,
                "Result": result
                
            });
            
            let dest = path.join(__dirname,"ipl 2020",teamName)
            dirCreator(dest);
            dest = path.join(dest,playerName+".json");
            var json = JSON.stringify(arr);
            fs.appendFile(dest, json , function (err) {
                if (err) throw err;
             });

        }
        
    }
    
}
function dirCreator(dirpath) {
    if (fs.existsSync(dirpath) == false) {
        fs.mkdirSync(dirpath);
    }
}