export default function processResponse(obj: { [key: string]: any }): any {
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === "object") {
      processResponse(obj[key]);
      continue;
    }

    // append static url to media resource
    if (key.includes("Path") && obj[key] !== null) {
      obj[key] = process.env.REACT_APP_STATIC_URL + obj[key];
    }

    // parse string date -> Date
    if (key.includes("At") && !isNaN(Date.parse(obj[key]))) {
      obj[key] = new Date(obj[key]);
    }
  }

  return obj;
}
