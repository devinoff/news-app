import { GoogleGenAI } from '@google/genai';
import Parser, { Item } from "rss-parser";
import * as crypto from 'crypto';
import * as fs from "node:fs";
import { Category, Source, Article, DailyBriefing } from "@/types";


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function Main() {
    const parser = new Parser();

    const lsmRss = await parser.parseURL(process.env.LSM_RSS_URL!);
    const tvnetRss = await parser.parseURL(process.env.TVNET_RSS_URL!);
    const delfiRss = await parser.parseURL(process.env.DELFI_RSS_URL!);
    const apolloRss = await parser.parseURL(process.env.APOLLO_RSS_URL!);
    const jaunsRss = await parser.parseURL(process.env.JAUNS_RSS_URL!);

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

    const newsEditorPrompt = fs.readFileSync('./prompt.txt', 'utf-8');

    interface GeminiSourceIds {
        headline: string;
        source_ids: string[];
    }
    interface GeminiCategoryOutput {
        category_name: string;
        articles: GeminiSourceIds[];
    }

    let geminiCategorizedBriefing: GeminiCategoryOutput[] = [];

    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 5000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${MAX_RETRIES}: Connecting to Gemini and sending news data...`);

            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

            let modelName = process.env.GEMINI_MODEL_NAME;
            if (!modelName) {
                console.warn("WARNING: 'GEMINI_MODEL_NAME' not found in environment variables.");
                modelName = 'gemini-1.5-flash';
                console.warn(`--> Falling back to default model: '${modelName}'\n`);
            }

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

            if (!responseText) {
                throw new Error('Error: Response text is empty!');
            }

            let cleanedText = responseText;
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
            }

            geminiCategorizedBriefing = JSON.parse(cleanedText);
            console.log('Successfully parsed Gemini JSON!');
            break;
        } catch (error: unknown) {
            console.error(`Attempt ${attempt} failed:`);
            console.error(error);

            if (error instanceof SyntaxError) {
                console.error('JSON parsing failed. Retrying...');
            } else if (error instanceof Error && error.message.includes('API key')) {
                console.error('API Key error. Retrying might not help. Exiting...');
                process.exit(1);
            } else {
                console.error('Non-JSON parsing error. Retrying...');
            }

            if (attempt < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS);
            } else {
                console.error('Max retry attempts reached. Failing to process news data.');
                process.exit(1);
            }
        }
    }

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

    const outputData: DailyBriefing = {
        lastUpdatedAt: lastUpdatedAt,
        newsCategories: finalDailyBriefing
    };

    const outputFilePath = './data/article-data.json';
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2), 'utf8');
        console.log(`Successfully processed and saved news data to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing final output file: ${error}`);
        process.exit(1);
    }

    console.log('Attempting to trigger Next.js revalidation...');
    const revalidateHost = process.env.APP_INTERNAL_URL || 'http://web:3000';
    const revalidateSecret = process.env.MY_REVALIDATE_SECRET;
    if (!revalidateHost || !revalidateSecret) {
        console.error('ERROR: APP_INTERNAL_URL or MY_REVALIDATE_SECRET not set. Cannot revalidate.');
        return;
    }

    const revalidateEndpoint = `${revalidateHost}/api/revalidate?secret=${revalidateSecret}`;
    try {
        const revalidateResponse = await fetch(revalidateEndpoint);
        if (revalidateResponse.ok) {
            console.log('Successfully triggered Next.js revalidation!');
        } else {
            const errorText = await revalidateResponse.text();
            console.error(`Failed to trigger revalidation: ${revalidateResponse.status} - ${errorText}`);
        }
    } catch (fetchError) {
        console.error('Network error during revalidation call:', fetchError);
    }
}

Main();