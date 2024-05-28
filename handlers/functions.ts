export {
  escapeRegex,
  delay,
};

async function delay(delayInms: number) {
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

function escapeRegex(str: string): string {
  try {
    if (!str || typeof str != "string") return "";
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack));
  }
}

Object.defineProperty(module.exports, "__esModule", {
  value: true,
});
