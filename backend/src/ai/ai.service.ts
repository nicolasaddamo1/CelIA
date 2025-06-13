import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'src/Entity/transaction.enetity';
import axios from 'axios';

@Injectable()
export class AiService {
    private readonly OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

    async analyzeTransactions(transactions: Transaction[], model = 'mistral') {
        const prompt = this.generatePrompt(transactions);

        const headers = {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        };

        const data = {
            model: model, // puedes cambiar a "gpt-4", "claude-3", etc.
            messages: [
                { role: 'system', content: 'Eres un asesor financiero inteligente.' },
                { role: 'user', content: prompt },
            ],
        };

        const response = await axios.post(this.OPENROUTER_URL, data, { headers });
        const result = response.data as {
            choices: { message: { content: string } }[];
        };
        return result.choices[0].message.content;
    }

    private generatePrompt(transactions: Transaction[]): string {
        const grouped = transactions
            .map(t => `${t.date.toISOString().split('T')[0]} - ${t.amount} - ${t.description || 'Sin descripción'} - Categoría: ${t.category?.name || 'N/A'}`)
            .join('\n');

        return `
Tengo estas transacciones recientes:

${grouped}

Por favor, analiza mis gastos y dime:
- ¿En qué estoy gastando más?
- ¿Hay algo que pueda optimizar o reducir?
- ¿Me conviene ahorrar en algún rubro específico?
Responde de forma clara y amigable.
`;
    }
}
