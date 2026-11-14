import fs from "fs";
const html = fs.readFileSync(process.argv[2], "utf8");
const keys = [
  "about_doctor",
  "upload_attachments",
  "description",
  "experience",
  "certification",
  "awards",
  "medical_school",
  "languages_spoken",
  "session_price",
];
for (const k of keys) {
  console.log(k, (html.match(new RegExp(k, "g")) || []).length);
}
