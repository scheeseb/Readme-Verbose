import { makeBadge } from 'badge-maker'
import { readFile } from 'node:fs/promises';

// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
async function renderKnownBadge(license) {
  // Check if the license is a string and doesn't contain invalid characters. Returns error if not
  if (typeof license != "string") { return console.error("License argument must be a string") };

  const dataString = await readFile("assets/data/badges.json", "utf-8")

  // Parse the JSON file
  const data = JSON.parse(dataString)

  // Extract the relevent information
  const svg = data[license].svg;
  const url = data[license].url;

  return `[![License](${svg})](${url})`

}




function renderCustomBadge(licenseString, url) {
  // Check if the title is a string and doesn't contain invalid characters. Returns error if not
  if (typeof licenseString != "string") { return console.error("LicenseString argument must be a string") };
  // Check if the URL is a string and is a valid url format. Returns error if not
  if (typeof url != "string") { return console.error("License URL argument must be a string") };

  // I just wanted to try regex
  // if (!/^[a-zA-Z0-9., / _ - ()]*$/.test(licenseString)) { return console.error("LicenseString contains an unallowed character") };
  // if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/.test(url)) { return console.error("License URL contains an unallowed character") };

  // This is the required format for the makeBadge
  const format = {
    label: "License",
    message: licenseString,
    color: 'green',
    // Options: 'plastic', 'flat', 'flat-square', 'for-the-badge' or 'social'
    style: 'plastic',

  }

  const svg = makeBadge(format)
  return `[${svg}](${url})`
}
// Test Code
// console.log(renderCustomBadge("MIT", 'https://opensource.org/licenses/BSD-2-Clause'))

// A function that returns the license section of README
// If there is no license, return an empty string
export default async function renderLicenseSection(licenseData) {
  if (licenseData.length <= 0) { return '' }

  // Create an empty array that will contain the markdown badges
  const graphicsUpdate = [];
  // This will be returned
  let finalTemplate = ``;

  // Loop through everything that was input

  for (const license of licenseData) {
    if (typeof license === "string") {     // If the index returns a string it is a known badge
      const badge = await renderKnownBadge(license);
      graphicsUpdate.push(badge);
    } else if (typeof license === "object") { //If it is an object it is a new badge. Render a new badge
      const badge = renderCustomBadge(license.name, license.url);
      graphicsUpdate.push(badge);
    }
  };

  // Add everyting from the graphics update into the finalTemplate
  for (const string of graphicsUpdate) {
    finalTemplate += `${string}\n`
  }

  return finalTemplate;
}