import { getLbData } from './functions';

module.exports = async (client) => {
  // Define types:
  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
  type user_data = ThenArg<ReturnType<typeof getLbData>>
  
  const update_data = async () => {
    const data: user_data = await getLbData(client)
    client.caches.set("lbData", data)
  };
  setInterval(update_data, 10000)
};
