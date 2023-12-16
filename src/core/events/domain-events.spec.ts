/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    // CustomAggregateCreated.name => O nome da classe como o nome do evento
    // Registra o evento
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // criar o evento
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // O repositório que lida com o bando de dados, depois de
    // persistir o dado deve chamar o método dispatch

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(aggregate.domainEvents).toHaveLength(0)
    expect(callbackSpy).toHaveBeenCalled()
  })
})
