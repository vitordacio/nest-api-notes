import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NoteEntity } from "../db/entities/notes.entity";
import { Repository } from "typeorm";
import { CreateNoteDTO, INoteDTO, UpdateNoteDTO } from "./note.dto";
import { v4 } from "uuid";
import { UsersService } from "../users/users.service";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepositoty: Repository<NoteEntity>,
    private readonly userService: UsersService,
  ) {}

  async create(reqUser: ExpressUser, body: CreateNoteDTO): Promise<NoteEntity> {
    const foundUser = await this.userService.findById(reqUser.id);

    const noteToSave: INoteDTO = {
      id_note: v4(),
      title: body.title,
      content: body.content,
      type: body.type || undefined,
      user_id: foundUser.id_user,
    };

    const createdNote = await this.noteRepositoty.save(noteToSave);
    return createdNote;
  }

  async findById(reqUser: ExpressUser, note_id: string): Promise<NoteEntity> {
    const foundUser = await this.userService.findById(reqUser.id);

    const foundNote = await this.noteRepositoty.findOne({
      where: { id_note: note_id },
    });

    if (!foundNote || foundUser.id_user !== foundNote.user_id) {
      throw new NotFoundException();
    }

    return foundNote;
  }

  async findByUser(reqUser: ExpressUser): Promise<NoteEntity[]> {
    const foundUser = await this.userService.findById(reqUser.id);

    const foundNotes = await this.noteRepositoty.find({
      where: { user_id: foundUser.id_user },
    });

    return foundNotes;
  }

  async update(reqUser: ExpressUser, body: UpdateNoteDTO): Promise<NoteEntity> {
    const foundNote = await this.findById(reqUser, body.note_id);

    if (body.title) foundNote.title = body.title;
    if (body.content) foundNote.content = body.content;
    if (body.type) foundNote.type = body.type;

    const updatedNote = await this.noteRepositoty.save(foundNote);

    return updatedNote;
  }

  async delete(reqUser: ExpressUser, note_id: string): Promise<void> {
    const foundNote = await this.findById(reqUser, note_id);

    await this.noteRepositoty.softRemove(foundNote);
  }
}
