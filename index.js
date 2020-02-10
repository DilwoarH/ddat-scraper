const cheerioReq = require("cheerio-req");

cheerioReq("https://www.gov.uk/guidance/software-developer", (err, $) => {
    let data = {
      role_title: $("h1").text().trim(),
      role_levels: $('.govspeak h2')
        .map( (index, role) => {
          return {
            title: $(role).text().trim(),
            description: $(role).next('p').text().split('.')[0] + ".",
            duties: $(role).next('p').next('ul').find('li').map( (i, duty) => {
              return $(duty).text().trim();
            }).toArray(),
            skills: $(role).next('p').next('ul').next('h3').next('ul').find('li').map( (i, duty) => {
              return {
                name: $(duty).find('strong').text().trim(),
                description: $(duty).text().trim()
              };
            }).toArray()
          }
        })
        .toArray()
        .slice(1, -1)
    };
    console.log(JSON.stringify(data, null, 2));
    //console.log(data);
});
