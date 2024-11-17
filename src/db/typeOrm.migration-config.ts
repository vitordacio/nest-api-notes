import "dotenv/config";
import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: configService.get<string>("DB_HOST"),
  port: +configService.get<string>("DB_PORT"),
  username: configService.get<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  entities: [__dirname + "/entities/**.ts"],
  migrations: [__dirname + "/migrations/**.ts"],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
