import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'src/Entity/transaction.enetity';
import axios from 'axios';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiService {
    private readonly OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
    private readonly apiKey: string;

    constructor(private configService: ConfigService,
        private readonly transactionService: TransactionsService,
        private readonly userService: UsersService
    ) {

        const apiKey = this.configService.get<string>('OPENROUTER_API_KEY') || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OpenRouter API Key is not defined.');
        }
        this.apiKey = apiKey;

        if (!this.apiKey) {
            throw new Error('OpenRouter API Key is not defined.');
        }
    }

    async analyzeTransactions(userId: string, model = 'openai/gpt-4.1') {
        const transactions = await this.transactionService.findAllByUser(userId);
        const userBudget = await this.userService.getUsersById(userId);
        if (userBudget === "User not found") {
            throw new Error('User not found');
        }
        const budget = typeof userBudget === 'object' && 'budget' in userBudget ? userBudget.budget : 0;
        const prompt = this.generatePrompt(transactions, budget);
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
        const data = {
            model: model,
            messages: [
                { role: 'system', content: 'Eres un asesor financiero inteligente.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 3500
        };

        try {
            const response = await axios.post(this.OPENROUTER_URL, data, { headers });

            if (!response.data) {
                throw new Error('Respuesta inesperada de OpenRouter');
            }

            return (response.data as any).choices[0].message.content;

        } catch (error: any) {
            console.error('Error al conectar con OpenRouter:', error.message);

            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Body:', error.response.data);
            }

            throw new Error('Falló la comunicación con la IA de OpenRouter');
        }
    }

    private generatePrompt(transactions: Transaction[], budget?: number): string {
        const grouped = transactions
            .map(t => {
                const dateStr = t.date instanceof Date ?
                    t.date.toISOString().split('T')[0] :
                    new Date(t.date).toISOString().split('T')[0];
                return `${dateStr} - ${t.amount} - ${t.description || 'Sin descripción'} - Categoría: ${t.category?.name || 'N/A'}`;
            }).join('\n');

        return `
Tengo estas transacciones recientes:

${grouped}

Por favor, analiza mis gastos y dime segun mi presupuesto de ${budget || 'no definido'}:
- ¿Cómo estoy administrando mi dinero?
- ¿En qué estoy gastando más?
- ¿Hay algo que pueda optimizar o reducir?
- ¿Me conviene ahorrar en algún rubro específico?
Responde de forma clara y amigable.


Además de lo que te acabo de decir, recuerda que te llamas Celia, y que eres un asesor financiero inteligente, y utilizas frases como "no metas todos los huevos en la misma canasta"(no siempre, sino cuando veas que puedes hacerlo) y no repreguntes, simplemente da una respuesta certera`;
    }
}
