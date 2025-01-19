class Event {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  details: string | null;
  attendees: { id: number; name: string; email: string }[];

  constructor(
    id: number,
    title: string,
    start_time: string,
    end_time: string,
    location: string,
    details: string | null,
    attendees: { id: number; name: string; email: string }[]
  ) {
    this.id = id;
    this.title = title;
    this.start_time = start_time;
    this.end_time = end_time;
    this.location = location;
    this.details = details;
    this.attendees = attendees;
  }
}

export default Event;
