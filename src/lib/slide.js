import * as fs from "node:fs";
import * as platPath from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const slidesDir = './src/components/content/'
const slidePrefix = 'contentPage';


export function addSlide(res) {
  const template = fs.readFileSync(platPath.resolve(__dirname, "./blank.vue"), {
    encoding: "utf8",
    flag: "r",
  });

  const lastIndex = Number(fs
    .readdirSync(slidesDir)
    .filter((file) => file.startsWith(slidePrefix) && file.endsWith(".vue")).at(-1).split('.')[0].slice(slidePrefix.length))

    console.log(lastIndex)

  let currIndex = lastIndex + 1;
  
  for (let i = 0; i < res.quantity; i++) {
    let path = `${slidesDir}${slidePrefix}${currIndex}.vue`;

    fs.writeFile(path, template, (err) => {
      if (err) {
        console.error(err);
      }
    });

    if (res.index != -1) {
      let info = {
        index: currIndex,
        moveIndex: res.index
      }
      moveSlide(info);
      res.index++
    }
    currIndex++;
  }
}

export function moveSlide(res) {
  const tempName = `${slidesDir}TEMP__${slidePrefix}${res.moveIndex}.vue`;
  const finalName = `${slidesDir}${slidePrefix}${res.moveIndex}.vue`;

  fs.renameSync(`${slidesDir}${slidePrefix}${res.index}.vue`, tempName);

  const compare =
    res.index != res.moveIndex ? (res.moveIndex - res.index < 0 ? -1 : 1) : 0;

  const slides = fs
    .readdirSync(slidesDir)
    .filter((file) => file.startsWith(slidePrefix) && file.endsWith(".vue"));

  switch (compare) {
    case 1: {
      // Move slide forward | moveIndex > index

      for (let i = 0; i < res.moveIndex - 1; ++i) {
        fs.renameSync(
          `${slidesDir}${slides[i]}`,
          `${slidesDir}${slidePrefix}${i + 1}.vue`
        );
      }

      
    }

    case -1: {
      // Move slide back | moveIndex < index
      for (let i = res.index-2; i > res.moveIndex-2; --i) {
        fs.renameSync(
          `${slidesDir}${slides[i]}`,
          `${slidesDir}${slidePrefix}${i + 2}.vue`
        );
      }
    }
  }

  fs.renameSync(`${tempName}`, `${finalName}`);
}
