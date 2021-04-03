import {
  lorem,
  datatype,
  name,
  date,
} from 'faker';

export default (total = 10) => new Array(total).fill(null).map(() => ({
  title: lorem.sentence(datatype.number({ min: 2, max: 4 })),
  author: name.findName(),
  sheet: datatype.number({ min: 120, max: 400 }),
  introduction: lorem.paragraphs(45),
  dateOffIssue: date.between(new Date(1945, 1), new Date(2018, 11)),
}));
