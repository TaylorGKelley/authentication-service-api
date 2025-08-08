import { EventEmitter } from 'node:events';
import { type UUID } from 'node:crypto';

type UserCreatedEvent = {
  type: 'user-created';
  payload: {
    id: UUID;
  };
  retries: number;
};

class UserEventWorker extends EventEmitter {
  userCreatedQueue: UserCreatedEvent[] = [];
  _maxRetries = 5;

  constructor() {
    super();
    console.log('Setup User Webhook Worker');
    this.setupListeners();
    this.startUserCreatedWorker();
  }

  private setupListeners() {
    this.on('user-created', async (userId: UUID) => {
      this.queueUserCreated({
        type: 'user-created',
        payload: {
          id: userId,
        },
        retries: 0,
      });
    });
  }

  private queueUserCreated = (event: UserCreatedEvent) => {
    this.userCreatedQueue.push(event);
  };

  private async startUserCreatedWorker() {
    setInterval(async () => {
      if (this.userCreatedQueue.length === 0) return;
      const event = this.userCreatedQueue.filter(
        (event) => event.retries < this._maxRetries
      )[0];

      try {
        const res = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': process.env.WEB_HOOK_INTERNAL_SECRET!,
          },
          body: JSON.stringify({
            query: `
           mutation CreateUser($input: CreateUserInput!) {
             createUser(input: $input) {
               id
             }
           }
         `,
            variables: {
              input: event.payload,
            },
          }),
        });
        const result = await res.json();
        if (res.ok && !result.errors) {
          this.userCreatedQueue.shift(); // Success
          console.log(
            `✅ Synced user (id: ${event.payload.id}) to WebHook endpoint`
          );
        } else {
          this.userCreatedQueue[0].retries += 1;
          console.error('❌ GraphQL Error:', result.errors);
        }
      } catch (err) {
        console.error('❌ Network Error:', err);
      }
    }, 5000);
  }
}

export const userEvent = new UserEventWorker();
