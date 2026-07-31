import rarcCrosswalk from "data/rarcCrosswalk.js";

export default function handler(req, res) {
  res.status(200).json(rarcCrosswalk);
}
