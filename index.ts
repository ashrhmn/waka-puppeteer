import express from "express";
import { scrapeData } from "./services/pup.service";
import { readFile } from "fs/promises";
import { join } from "path";
import { IJSONData } from "./types";

const app = express();

app.get("/waka/:username", async (req, res) => {
  const username = req.params.username;
  if (typeof username !== "string")
    return res.status(400).json({ msg: "Invalid Username" });

  const data: IJSONData = await readFile(
    join(__dirname, "data", `${username}.json`),
    "utf-8"
  )
    .then(JSON.parse)
    .catch(() => ({updated_at: +(Date.now()/1000).toFixed(0)-7200,languages:[]}));

  // if (!data) {
  //   scrapeData(username);
  //   return res.status(404).json({ msg: "Data not found" });
  // }

  if (data.updated_at < +(Date.now() / 1000).toFixed(0) - 3600)
    scrapeData(username);
  console.log(data.languages.length);

  return res.send(
    `<svg viewBox="0 0 400 ${data.languages.length * 7}" xmlns="http://www.w3.org/2000/svg" role="img">
      <style>
        .txt{
          font: 4px sans-serif;
          background-color: black;
        }
      </style>
      ${data.languages.map(
        (l, i) =>
          `<text y="${i * 6 + 6}" class="txt">${
            l.name + " : " + l.percentage + "%"
          }</text>`
      )}
    </svg>`
  );

  // return res.json(data.languages);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
