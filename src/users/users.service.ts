import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users, type NewUser } from '../db/schema.js';

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: NodePgDatabase) {}

  findAll() {
    return this.db.select().from(users);
  }

  async findOne(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(data: NewUser) {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  async update(id: number, data: Partial<NewUser>) {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async remove(id: number) {
    const [user] = await this.db.delete(users).where(eq(users.id, id)).returning();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
