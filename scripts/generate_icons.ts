import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const generateSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
  <circle cx="7.5" cy="7.5" r="7" fill="${color}" />
</svg>
`;

const run = async () => {
  const iconsFolder = path.join(__dirname, "..", "resources", "color_icons");
  const pkg = path.join(__dirname, "..", "package.json");
  const { contributes } = JSON.parse(await readFile(pkg, "utf-8"));
  const colors = contributes.colors as Array<{
    id: string;
    description: string;
    defaults: {
      light: string;
      dark: string;
      highContrast: string;
      highContrastLight: string;
    };
  }>;

  await mkdir(iconsFolder, { recursive: true });

  await Promise.all(
    colors.map(async ({ id, defaults }) => {
      const svg = path.join(iconsFolder, `${id}.svg`);
      const png = path.join(iconsFolder, `${id}.png`);

      await writeFile(svg, generateSvg(defaults.light), "utf-8");
      await sharp(svg).png().toFile(png);
      await rm(svg);
    })
  )
    .then(() => {
      console.log("Done creating icons");
    })
    .catch(console.error);
};

run();
