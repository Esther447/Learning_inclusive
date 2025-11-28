/**
 * Captions and Transcripts Service
 * Provides caption functionality for deaf/hard of hearing learners
 */

export interface CaptionData {
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
}

export class CaptionService {
  /**
   * Parse WebVTT format captions
   */
  parseWebVTT(vttContent: string): CaptionData[] {
    const captions: CaptionData[] = [];
    const lines = vttContent.split('\n');
    
    let currentCaption: Partial<CaptionData> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip WebVTT header and empty lines
      if (line === 'WEBVTT' || line === '' || line.startsWith('NOTE')) {
        continue;
      }

      // Parse timestamp line (e.g., "00:00:01.000 --> 00:00:03.000")
      const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
      if (timestampMatch) {
        if (currentCaption) {
          captions.push(currentCaption as CaptionData);
        }
        currentCaption = {
          startTime: this.parseTimestamp(timestampMatch[1]),
          endTime: this.parseTimestamp(timestampMatch[2]),
          text: '',
        };
        continue;
      }

      // Parse text content
      if (currentCaption && line) {
        currentCaption.text = (currentCaption.text || '') + line + ' ';
      }
    }

    if (currentCaption) {
      captions.push(currentCaption as CaptionData);
    }

    return captions;
  }

  /**
   * Convert timestamp string to seconds
   */
  private parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Format seconds to timestamp string
   */
  formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`;
  }

  /**
   * Get caption for current time
   */
  getCaptionForTime(captions: CaptionData[], currentTime: number): CaptionData | null {
    return captions.find(
      (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
    ) || null;
  }
}

// Singleton instance
export const captionService = new CaptionService();

