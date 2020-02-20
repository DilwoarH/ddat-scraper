const cheerioReq = require("cheerio-req");
const { Parser } = require('json2csv');

const fields = [
  'job_family',
  'role',
  'role_level',
  'role_description_intro',
  'skills_they_need',
  'skill_name',
  'skill_description',
  'skill_level',
  'skill_level_description'
];
const opts = { fields };

cheerioReq("https://www.gov.uk/guidance/software-developer", (err, $) => {
    let role = {
      family: "Technical job",
      title: $("h1").text().trim(),
      levels: $('.govspeak h2')
        .map( (index, level) => {
          let description = $(level).next('p').text().split('.');

          return {
            title: $(level).text().trim(),
            description: description.slice(0, -1).join('. ') + ".",
            duties_pretext: (description[description.length - 1]).trim(),
            duties: $(level).next('p').next('ul').find('li').map( (i, duty) => {
              return $(duty).text().trim();
            }).toArray(),
            skills: $(level).nextAll('h3').first().next('ul').find('li').map( (i, duty) => {
              let name = $(duty).find('strong').text().trim();
              let skill_level_description = $(duty);
              skill_level_description.find('strong').remove();
              return {
                name: name,
                description: "TBC",
                skill_level: skill_level_description.text().substring(3).match(/\(Relevant skill level: (.*?)\)/)[1],
                skill_level_description: skill_level_description.text().substring(3).replace(/\(Relevant skill level: (.*?)\)/, '').trim(),
              };
            }).toArray()
          }
        })
        .toArray()
        //.slice(1, -1)
    };
    //console.log(JSON.stringify(role, null, 2)); return;
    //console.log(JSON.stringify(formatForCSV(role), null, 2)); return;

    const json2csvParser = new Parser(opts);
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
        skills_they_need: `${level.description}\n\n${level.duties_pretext}\n${level.duties.map(d => `- ${d}`).join('\n')}`,
        skill_name: skill.name,
        skill_description: skill.description,
        skill_level: skill.skill_level,
        skill_level_description: skill.skill_level_description
      });
    });
  });
  return data;
}