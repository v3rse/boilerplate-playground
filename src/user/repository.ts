import { Connection } from 'mongoose';
import { Inject, Service } from 'typedi';

@Service()
export class UserRepository {
  @Inject('db')
  db: Connection

  constructor() {
      
  }
}