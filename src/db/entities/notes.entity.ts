import { Exclude } from "class-transformer";
import { NoteType } from "../../notes/note.dto";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./users.entity";

@Entity("notes")
export class NoteEntity {
  @PrimaryColumn("uuid")
  id_note: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ type: "enum", enum: NoteType, default: NoteType.Personal })
  type: NoteType;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.notes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: string;
}
