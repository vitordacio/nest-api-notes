import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { NotesService } from "./notes.service";
import { CreateNoteDTO, UpdateNoteDTO } from "./note.dto";
import { Request } from "express";
import { NoteEntity } from "../db/entities/notes.entity";

@UseGuards(AuthGuard)
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() body: CreateNoteDTO,
  ): Promise<NoteEntity> {
    const note = await this.notesService.create(req.user, body);
    return note;
  }

  @Get("/:note_id")
  async findById(
    @Req() req: Request,
    @Param("note_id") note_id: string,
  ): Promise<NoteEntity> {
    const note = await this.notesService.findById(req.user, note_id);
    return note;
  }

  @Get()
  async findByUser(@Req() req: Request): Promise<NoteEntity[]> {
    const notes = await this.notesService.findByUser(req.user);
    return notes;
  }

  @Put()
  async update(
    @Req() req: Request,
    @Body() body: UpdateNoteDTO,
  ): Promise<NoteEntity> {
    const note = await this.notesService.update(req.user, body);
    return note;
  }

  @Delete("/:note_id")
  async delete(
    @Req() req: Request,
    @Param("note_id") note_id: string,
  ): Promise<void> {
    await this.notesService.delete(req.user, note_id);
  }
}
