module.exports = {
  escapeRegex,
  delay
};

async function delay(delayInms) {
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

function escapeRegex(str) {
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
