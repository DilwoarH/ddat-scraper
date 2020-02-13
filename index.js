const cheerioReq = require("cheerio-req");
const { Parser } = require('json2csv');

const fields = [
  'job_family',
  'role',
  'role_level',
  'role_description_intro',
  'skills_they_need',
  'skill_name',
  'skill_description'
];
const opts = { fields };

cheerioReq("https://www.gov.uk/guidance/software-developer", (err, $) => {
    let role = {
      family: "Technical job",
      title: $("h1").text().trim(),
      levels: $('.govspeak h2')
        .map( (index, level) => {
          return {
            title: $(level).text().trim(),
            description: $(level).next('p').text().split('.')[0] + ".",
            duties: $(level).next('p').next('ul').find('li').map( (i, duty) => {
              return $(duty).text().trim();
            }).toArray(),
            skills: $(level).next('p').next('ul').next('h3').next('ul').find('li').map( (i, duty) => {
              return {
                name: $(duty).find('strong').text().trim(),
                description: $(duty).text().trim()
              };
            }).toArray()
          }
        })
        .toArray()
        //.slice(1, -1)
    };
    //console.log(JSON.stringify(role, null, 2));
    //console.log(JSON.stringify(formatForCSV(role), null, 2));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formatForCSV(role));
    console.log(csv);
    //console.log(data);
});


function formatForCSV(role) {
  var data = [];
  role.levels.forEach( level => {
    level.skills.forEach( skill => {
      data.push({
        job_family: role.family,
        role: role.title,
        role_level: level.title,
        role_description_intro: role.levels[0].description,
        skills_they_need: level.description,
        skill_name: skill.name,
        skill_description: skill.description
      });
    });
  });
  return data;
}