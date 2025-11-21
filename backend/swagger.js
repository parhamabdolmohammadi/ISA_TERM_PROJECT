import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger/swagger.yaml");

export { swaggerUi, swaggerDocument };