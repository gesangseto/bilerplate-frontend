import moment from "moment";

export const dateFilter = {
  today: {
    start: moment().format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  },
  this_week: {
    start: moment().startOf("isoweek"),
    end: moment().format("YYYY-MM-DD"),
  },
  this_month: {
    start: moment()
      .startOf("month")
      .format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  },
  last_month: {
    start: moment()
      .add(-1, "month")
      .startOf("month")
      .format("YYYY-MM-DD"),
    end: moment()
      .add(-1, "month")
      .endOf("month")
      .format("YYYY-MM-DD"),
  },
  last_3_month: {
    start: moment()
      .add(-2, "month")
      .startOf("month")
      .format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  },
  last_6_month: {
    start: moment()
      .add(-5, "month")
      .startOf("month")
      .format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  },
  this_year: {
    start: moment()
      .startOf("year")
      .format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  },
};
