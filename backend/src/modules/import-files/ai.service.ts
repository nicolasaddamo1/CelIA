import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateAnswer(prompt: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });
        if (!completion.choices[0].message.content) {
            throw new Error('No content returned from OpenAI');
        }
        return completion.choices[0].message.content;
    }
}
