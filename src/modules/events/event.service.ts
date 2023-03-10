import { AppDataSource } from '../../config/data-source';
import { Event } from './event.entity';
import { CreateEventInput } from './event.input';

export const findById = async (id: string): Promise<Event | null> => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    const event = await eventRepo.findOne({ where: { id }, relations: { editBy: true } });
    return event;
  } catch (error) {
    return null;
  }
};

export const create = async (input: CreateEventInput): Promise<Event> => {
  const eventRepo = AppDataSource.getRepository(Event);
  const event = eventRepo.create({ ...input });
  await eventRepo.save(event);
  return event;
};
