import { Arg, Field, Mutation, Query, Resolver } from 'type-graphql';
import { Event } from './event.entity';
import { CreateEventInput } from './event.input';
import * as EventService from './event.service';

@Resolver()
export class EventResolver {
  @Query(() => Event, { nullable: true })
  async findOneEvent(@Arg('eventId') eventId: string): Promise<Event | null> {
    const response = await EventService.findById(eventId);
    return response;
  }

  @Mutation(() => Event)
  async createEvent(@Arg('input') input: CreateEventInput): Promise<Event> {
    const response = await EventService.create({ ...input });
    return response;
  }
}
