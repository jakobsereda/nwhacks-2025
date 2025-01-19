class Event {
  title: string;
  time: string;
  location: string;
  description: string;

  constructor(
    title: string,
    time: string,
    location: string,
    description: string
  ) {
    this.title = title;
    this.time = time;
    this.location = location;
    this.description = description;
  }
}

export default Event