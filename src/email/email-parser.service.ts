import {
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { simpleParser } from 'mailparser';
  import * as fs from 'fs/promises';
  import axios from 'axios';
  import { JSDOM } from 'jsdom';
  
  @Injectable()
  export class EmailParserService {
    private readonly logger = new Logger(EmailParserService.name);
  
    async extractJsonFromEmail(path: string): Promise<any> {
      let rawEmail;
      try {
        rawEmail = await fs.readFile(path);
      } catch (error) {
        this.logger.error(`Could not read file at ${path}`, error);
        throw new NotFoundException(`File not found: ${path}`);
      }
  
      const parsed = await simpleParser(rawEmail);
  
      const jsonAttachment = parsed.attachments?.find(
        (att) => att.contentType === 'application/json',
      );
  
      if (jsonAttachment) {
        try {
          return JSON.parse(jsonAttachment.content.toString('utf-8'));
        } catch (error) {
          this.logger.warn(`Malformed JSON in attachment: ${error.message}`);
          throw new UnprocessableEntityException('Invalid JSON in attachment');
        }
      }
  
      const body = (parsed.text || parsed.html || '').toString();
      const jsonUrl = this.extractUrl(body);
      if (jsonUrl) {
        const json = await this.tryFetchJsonFromLink(jsonUrl);
        if (json) return json;
      }
      this.logger.error('No valid JSON found in email');
      throw new UnprocessableEntityException('No valid JSON found in email');
    }
  
    private extractUrl(content: string): string | null {
      const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
      const matches = content.match(urlRegex);
      return matches?.[0] || null;
    }
  
    private async tryFetchJsonFromLink(link: string): Promise<any | null> {
      try {
        const response = await axios.get(link, { responseType: 'json' });
        if (typeof response.data === 'object') return response.data;
      } catch (err) {
        this.logger.warn(`Direct JSON link failed: ${err.message}`);
      }
  
      try {
        const { data: html } = await axios.get(link);
        const dom = new JSDOM(html);
        const anchors = Array.from(dom.window.document.querySelectorAll('a'));
        

        for (const a of anchors) {
          const href = a.getAttribute('href');
          if (href) {
            const jsonRes = await axios.get(href);
            return jsonRes.data;
          }
        }
      } catch (err) {
        this.logger.warn(`Nested JSON link failed: ${err.message}`);
      }
  
      return null;
    }
  }
  