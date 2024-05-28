import { readdirSync } from 'fs';

const allevents: string[] = [];

const loadEvents = async (client: any): Promise<void> => {
  try {
    const dateNow = Date.now();
    console.log(`${String("[x] :: ")}Now loading the Events ...`);

    const load_dir = async (dir: string) => {
      const event_files = readdirSync(`${process.cwd()}/dist/events/${dir}`).filter((file) => file.endsWith(".js"));
      for (const file of event_files) {
        try {
          const event = require(`../events/${dir}/${file}`);
          let eventName = file.split(".")[0];
          if (eventName == "message") continue;
          allevents.push(eventName);
          client.on(eventName, event.bind(null, client));
        } catch (e) {
          console.log(String(e.stack));
        }
      }
    };

    ["client", "guild"].forEach((e) => load_dir(e));

    console.log(
      `[x] :: LOADED THE ${allevents.length} EVENTS after: ${Date.now() - dateNow}ms`
    );

    try {
      const stringlength2 = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`,
      );
      console.log(
        `     ┃ ` + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃",
      );
      console.log(
        `     ┃ ` +
          `Logging into the BOT...` +
          " ".repeat(
            -1 +
              stringlength2 -
              ` ┃ `.length -
              `Logging into the BOT...`.length,
          ) +
          "┃",
      );
      console.log(
        `     ┃ ` + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃",
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
      );
    } catch {
      /* */
    }
  } catch (e) {
    console.log(String(e.stack));
  }
};

export default loadEvents;
