module.exports = {
  async afterCreate(event) {
    const {
      result: { id, startDate, endDate, specialistId },
    } = event;
    console.log("event", id, startDate, endDate, specialistId);
  },
};
