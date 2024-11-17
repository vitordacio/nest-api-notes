import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  IsUUID,
} from "class-validator";

export interface INoteDTO {
  id_note: string;
  title: string;
  content: string;
  type: NoteType;
  user_id: string;
}

export enum NoteType {
  Personal = "Personal",
  Work = "Work",
  Reminder = "Reminder",
}

export class CreateNoteDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(512)
  content: string;

  @ValidateIf((_, value) => value !== "")
  @IsEnum(NoteType)
  @IsOptional()
  type: NoteType;
}

export class UpdateNoteDTO {
  @IsUUID()
  note_id: string;

  @ValidateIf((_, value) => value !== "")
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  title: string;

  @ValidateIf((_, value) => value !== "")
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  @IsOptional()
  content: string;

  @ValidateIf((_, value) => value !== "")
  @IsEnum(NoteType)
  @IsOptional()
  type: NoteType;
}
