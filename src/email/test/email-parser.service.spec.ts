import { EmailParserService } from '../../../src/email/email-parser.service';
import * as fs from 'fs/promises';
import { simpleParser } from 'mailparser';

jest.mock('fs/promises');
jest.mock('mailparser', () => ({
  simpleParser: jest.fn(),
}));

describe('EmailParserService', () => {
  let service: EmailParserService;

  beforeEach(() => {
    service = new EmailParserService();
  });

  it('throws NotFoundException when file not found', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('no file'));

    await expect(service.extractJsonFromEmail('fake.eml')).rejects.toThrow(/File not found/);
  });

  it('returns JSON from attachment', async () => {
    const data = { hello: 'world' };
    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('email'));
    (simpleParser as jest.Mock).mockResolvedValue({
      attachments: [
        {
          contentType: 'application/json',
          content: Buffer.from(JSON.stringify(data)),
        },
      ],
    });

    const result = await service.extractJsonFromEmail('valid.eml');
    expect(result).toEqual(data);
  });

  it('throws UnprocessableEntity if invalid JSON', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('email'));
    (simpleParser as jest.Mock).mockResolvedValue({
      attachments: [
        {
          contentType: 'application/json',
          content: Buffer.from('{ invalid JSON }'),
        },
      ],
    });

    await expect(service.extractJsonFromEmail('bad-json.eml')).rejects.toThrow(/Invalid JSON/);
  });
});
