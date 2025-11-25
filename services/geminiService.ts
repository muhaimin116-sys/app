import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Transaction, TransactionType } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API 密钥缺失");
  }
  return new GoogleGenAI({ apiKey });
};

// Schema for parsing a transaction
const parsingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    amount: { type: Type.NUMBER, description: "Transaction amount." },
    type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"], description: "Transaction type." },
    category: { 
      type: Type.STRING, 
      description: "Level 1 Heading/Main Category (e.g., '餐饮', '交通', '购物', '居住', '娱乐', '医疗', '工资', '理财'). Keep it concise (2-4 chars)." 
    },
    summary: { type: Type.STRING, description: "Specific detail of the item (e.g., '牛肉面', '地铁卡充值')." },
  },
  required: ["amount", "type", "category", "summary"],
};

export const parseLedgerEntry = async (input: string): Promise<any> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `分析这条记账输入： "${input}"。
      1. 提取金额。
      2. 判断是收入(INCOME)还是支出(EXPENSE)。
      3. 归纳出一个标准的【一级分类】(Category)，例如：餐饮、交通、购物、居住、娱乐、医疗、教育、人情、工资、奖金、理财等。确保分类标准且统一。
      4. 生成一个简短的具体摘要(Summary)。
      
      如果没有指定货币，默认为人民币。只返回 JSON。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: parsingSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("无法解析内容");
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const generateRoyalReport = async (transactions: Transaction[], period: string): Promise<string> => {
  const ai = getAiClient();
  
  const dataSummary = transactions.map(t => 
    `${t.date.split('T')[0]}: ${t.type} ${t.amount} (${t.category} - ${t.summary})`
  ).join('\n');

  const prompt = `
    作为一名专业的私人财务顾问，请分析以下${period}的收支记录：
    
    ${dataSummary}
    
    请生成一份优雅、简洁、有洞察力的财务简报。
    1. **资金流向**：简要概述收支情况。
    2. **消费洞察**：分析主要支出的一级分类，指出消费习惯。
    3. **理财建议**：给出一句温暖而理性的建议。
    
    风格要求：清新、专业、有温度（类似生活方式杂志的专栏风格）。
    字数控制在 250 字以内。使用 Markdown 格式，重点数据加粗。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "暂无分析数据。";
  } catch (error) {
    console.error("Report Error:", error);
    return "暂时无法生成分析报告，请稍后再试。";
  }
};