import { GoogleGenAI } from '@google/genai';
import Parser, { Item } from "rss-parser";
import * as crypto from 'crypto';
import * as fs from "node:fs";
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

async function Main() {
    const parser = new Parser();

    const lsmRss = await parser.parseURL('https://www.lsm.lv/rss/');
    const tvnetRss = await parser.parseURL('https://www.tvnet.lv/rss');
    const delfiRss = await parser.parseURL('https://www.delfi.lv/rss/index.xml');
    const apolloRss = await parser.parseURL('https://www.apollo.lv/rss');
    const jaunsRss = await parser.parseURL('https://jauns.lv/rss');

    interface RssObjectInterface {
        id: string,
        title: string,
        description: string,
        url: string,
        publishedAt: string,
        source: string
    }


    type ValidItem = Item & { content: string; link: string; isoDate: string; title: string; };

    function cleanString(text: string): string {
        return text.replace(/"/g, "'").trim();
    }

    function makeRss(items: Item[], source: string) {
        const validItems = items.filter((item: Item): item is ValidItem => !!( item.content && item.link && item.isoDate ));
        return validItems.map((item: ValidItem): RssObjectInterface => {
            const uniqueContentString = `${item.title}-${item.content}-${item.link}`;
            const articleId = crypto.createHash('sha256').update(uniqueContentString).digest('hex').substring(0, 10);
            return { id: articleId, title: cleanString(item.title), description: cleanString(item.content), url: item.link, publishedAt: item.isoDate, source: source }
        });
    }

    const lsmArticles = makeRss(lsmRss.items, 'LSM');
    const tvnetArticles = makeRss(tvnetRss.items, 'TVNET');
    const delfiArticles = makeRss(delfiRss.items, 'DELFI');
    const apolloArticles = makeRss(apolloRss.items, 'APOLLO');
    const jaunsArticles = makeRss(jaunsRss.items, 'JAUNS');

    const articles = [ ...lsmArticles, ...tvnetArticles, ...delfiArticles, ...apolloArticles, ...jaunsArticles ];
    const articleLookupMap = new Map<string, RssObjectInterface>();
    for (const article of articles) {
        articleLookupMap.set(article.id, article);
    }
    const articleTextArray = articles.map((article) => `
        ID: ${article.id}
        Source: ${article.source}
        Title: ${article.title}
        Description: ${article.description}
    `);
    const articleTextString = articleTextArray.join('---');

    const newsEditorPrompt = fs.readFileSync('./public/prompt.txt', 'utf-8');

    interface GeminiSourceIds {
        headline: string;
        source_ids: string[];
    }
    interface GeminiCategoryOutput {
        category_name: string;
        articles: GeminiSourceIds[];
    }

    let geminiCategorizedBriefing: GeminiCategoryOutput[] = [];

    try {
        console.log("Connecting to Gemini and sending news data...");

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const modelName = 'gemini-2.5-flash';
        const fullPrompt = newsEditorPrompt + articleTextString;

        const response = await genAI.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            // config: {
            //     thinkingConfig: {
            //         thinkingBudget: 0,
            //     },
            // },
        });

        const responseText = response.text;

        console.log('Successfully received response from Gemini!');

        if (!responseText) throw new Error('Error: Response text is empty!');

        let cleanedText = responseText;
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
        }

        geminiCategorizedBriefing = JSON.parse(cleanedText);
        console.log('Successfully parsed Gemini JSON!');

    } catch (error) {
        console.error('Failed to connect to Gemini or process its response:');
        console.error(error);
        return;
    }

    interface Source { name: string; title: string; url: string; published_at: string; }
    interface Article { headline: string; sources: Source[]; }
    interface Category { category_name: string; articles: Article[]; }

    const finalDailyBriefing: Category[] = [];
    const lastUpdatedAt = new Date().toISOString();

    for (const geminiCategory of geminiCategorizedBriefing) {
        const newCategory: Category = {
            category_name: geminiCategory.category_name as Category['category_name'],
            articles: []
        };

        for (const geminiArticle of geminiCategory.articles) {
            const newArticle: Article = {
                headline: geminiArticle.headline,
                sources: []
            };

            const uniqueSourceIds = [...new Set (geminiArticle.source_ids)];
            for (const sourceId of uniqueSourceIds) {
                const originalArticle = articleLookupMap.get(sourceId);

                if (originalArticle) {
                    const dateToFormat = new Date(originalArticle.publishedAt);

                    // LSM RSS dates are one hour before the actual date, so we fix that
                    if (originalArticle.source === 'LSM') {
                        dateToFormat.setHours(dateToFormat.getHours() + 1);
                    }

                    const formattedPublishedAt = dateToFormat.toLocaleString('lv-LV', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour12: false,
                        timeZone: 'Europe/Riga'
                    });

                    const newSource: Source = {
                        name: originalArticle.source,
                        title: originalArticle.title,
                        url: originalArticle.url,
                        published_at: formattedPublishedAt
                    };
                    newArticle.sources.push(newSource);
                } else {
                    console.warn(`Warning: Could not find original article for ID: ${sourceId}. Skipping this source.`);
                }
            }
            newCategory.articles.push(newArticle);
        }
        finalDailyBriefing.push(newCategory);
    }

    const outputData = {
        lastUpdatedAt: lastUpdatedAt,
        newsCategories: finalDailyBriefing
    };

    const outputFilePath = './public/article-data.json';
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2), 'utf8');
        console.log(`Successfully processed and saved news data to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing final output file: ${error}`);
    }
}

Main();