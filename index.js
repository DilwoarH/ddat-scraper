const cheerioReq = require("cheerio-req");

cheerioReq("https://www.gov.uk/guidance/software-developer", (err, $) => {
    let data = {
      title: $("h1").text().trim(),
      skills: $('.govspeak h2')
        .map( (index, skill) => {
          return {
            title: $(skill).text().trim(),
            description: $(skill).next('p').text().split('.')[0] + ".",
            duties: $(skill).next('p').next('ul').find('li').map( (i, duty) => {
              return $(duty).text().trim();
            }).toArray(),
          }
        })
        .toArray()
        .slice(1, -1)
    };
    console.log(data);
});
