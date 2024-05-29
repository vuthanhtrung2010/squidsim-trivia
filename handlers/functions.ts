export async function delay(delayInms: number) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack));
  }
}

export function escapeRegex(str: string): string {
  try {
    if (!str || typeof str != "string") return "";
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack));
  }
}

export async function getLbData(client) {
  return await client.user_data.findMany({
    orderBy: {
      wins: 'desc'
    },
    take: 25
  });
}

Object.defineProperty(module.exports, "__esModule", {
  value: true,
});
