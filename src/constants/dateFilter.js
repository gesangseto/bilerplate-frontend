import moment from 'moment';

export const dateFilter = {
  today: {
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  this_week: {
    start: moment().startOf('isoweek'),
    end: moment().format('YYYY-MM-DD'),
  },
  last_1_week: {
    start: moment().add(-6, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  last_2_week: {
    start: moment().add(-13, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  this_month: {
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  last_month: {
    start: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
    end: moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD'),
  },
  last_1_month: {
    start: moment().add(1, 'days').subtract(1, 'month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  last_3_month: {
    start: moment().add(1, 'days').subtract(2, 'month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  last_6_month: {
    start: moment().add(1, 'days').subtract(5, 'month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  this_year: {
    start: moment().startOf('year').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  all: {
    start: '',
    end: '',
  },
};
