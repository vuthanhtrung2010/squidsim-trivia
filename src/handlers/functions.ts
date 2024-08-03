import { ExtendedClient } from "../types";

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

export async function getLbData(client: ExtendedClient) {
  return await client.database.userData.findMany({
    orderBy: {
      wins: 'desc'
    },
    take: 25
  });
}

Object.defineProperty(module.exports, "__esModule", {
  value: true,
});

export function calcProcessDurationTime(
  beforeHRTime: [number, number],
  format: boolean,
) {
  const timeAfter = process.hrtime(beforeHRTime);
  const calculated =
    Math.floor((timeAfter[0] * 100000000 + timeAfter[1]) / 10000) / 100;
  return format ? duration(calculated, true).join(", ") : calculated;
}

export function duration(duration: number, useMilli: boolean = false) {
  let remain = duration;
  const days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);
  const hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);
  const minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);
  const seconds = Math.floor(remain / 1000);
  remain = remain % 1000;
  const milliseconds = remain;
  const time = {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
  const parts = [];
  if (time.days) {
    let ret = time.days + " Day";
    if (time.days !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.hours) {
    let ret = time.hours + " Hr";
    if (time.hours !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.minutes) {
    let ret = time.minutes + " Min";
    if (time.minutes !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.seconds) {
    let ret = time.seconds + " Sec";
    if (time.seconds !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (useMilli && time.milliseconds) {
    const ret = time.milliseconds + " ms";
    parts.push(ret);
  }
  if (parts.length === 0) {
    return ["instantly"];
  } else {
    return parts;
  }
}