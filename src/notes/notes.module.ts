import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { NoteEntity } from "../db/entities/notes.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity]), UsersModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
