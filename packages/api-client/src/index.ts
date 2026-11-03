import { ApiClient, type ClientConfig } from './client.js';
import { AuthApi } from './auth.js';
import { EventsApi } from './events.js';
import { SeriesApi } from './series.js';
import { MessagesApi } from './messages.js';
import { MediaApi } from './media.js';
import { NotificationsApi } from './notifications.js';
import { TicketmasterApi } from './ticketmaster.js';

export { ApiClient, ApiError, type ClientConfig } from './client.js';
export type {
  NearLocation,
  TicketmasterSearchResponse,
} from './ticketmaster.js';

export class GatherUpClient {
  private client: ApiClient;

  public auth: AuthApi;
  public events: EventsApi;
  public series: SeriesApi;
  public messages: MessagesApi;
  public media: MediaApi;
  public notifications: NotificationsApi;
  public ticketmaster: TicketmasterApi;

  constructor(config: ClientConfig) {
    this.client = new ApiClient(config);
    this.auth = new AuthApi(this.client);
    this.events = new EventsApi(this.client);
    this.series = new SeriesApi(this.client);
    this.messages = new MessagesApi(this.client);
    this.media = new MediaApi(this.client);
    this.notifications = new NotificationsApi(this.client);
    this.ticketmaster = new TicketmasterApi(this.client);
  }
}

export default GatherUpClient;
