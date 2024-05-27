module.exports = async (client) => {
  const update_data = async () => {
    const data = client.user_data.findMany({})
    client.caches.set("lbData", data)
  };
  setInterval(update_data, 10000)
};
