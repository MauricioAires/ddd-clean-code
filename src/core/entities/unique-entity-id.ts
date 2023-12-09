import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toSting() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
}
