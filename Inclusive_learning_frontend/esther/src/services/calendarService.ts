export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  attendees?: string[];
}

export class CalendarService {
  static generateICSFile(event: CalendarEvent): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeText = (text: string): string => {
      return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Inclusive Learning Platform//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@inclusivelearning.com`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      event.location ? `LOCATION:${escapeText(event.location)}` : '',
      event.attendees ? `ATTENDEE:${event.attendees.map(email => `mailto:${email}`).join(';')}` : '',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(line => line !== '').join('\r\n');

    return icsContent;
  }

  static downloadICSFile(event: CalendarEvent, filename: string = 'session.ics'): void {
    const icsContent = this.generateICSFile(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static generateGoogleCalendarUrl(event: CalendarEvent): string {
    const formatGoogleDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
      details: event.description,
      location: event.location || '',
      add: event.attendees?.join(',') || ''
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  static generateOutlookUrl(event: CalendarEvent): string {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: event.startDate.toISOString(),
      enddt: event.endDate.toISOString(),
      body: event.description,
      location: event.location || '',
      to: event.attendees?.join(';') || ''
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  static sendEmailInvite(event: CalendarEvent, userEmail: string, mentorEmail: string): void {
      this.generateICSFile({
          ...event,
          attendees: [userEmail, mentorEmail]
      });
      const subject = encodeURIComponent(`Learning Session: ${event.title}`);
    const body = encodeURIComponent(
      `You have a learning session scheduled:\n\n` +
      `Title: ${event.title}\n` +
      `Date: ${event.startDate.toLocaleDateString()}\n` +
      `Time: ${event.startDate.toLocaleTimeString()} - ${event.endDate.toLocaleTimeString()}\n` +
      `Location: ${event.location || 'Online'}\n\n` +
      `Description:\n${event.description}\n\n` +
      `Please find the calendar invite attached.`
    );

    // Create mailto link with ICS attachment (limited browser support)
    const mailtoUrl = `mailto:${mentorEmail}?cc=${userEmail}&subject=${subject}&body=${body}`;
    window.open(mailtoUrl);

    // Also download ICS file as backup
    this.downloadICSFile(event, `session-${event.startDate.toISOString().split('T')[0]}.ics`);
  }
}