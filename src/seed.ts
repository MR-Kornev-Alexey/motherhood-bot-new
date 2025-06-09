import webinars from "./data/webinars.js"
import consultationsService from "./services/common-db.js";

await consultationsService.seed(webinars);
