import {NewspaperIcon} from "@phosphor-icons/react/ssr";
import Article from "@/components/Article";
import WeatherWidget from "@/components/WeatherWidget";
import path from "node:path";
import fs from 'fs/promises';
import {DailyBriefing} from "@/types";

export default async function Home() {
    const filePath = path.join(process.cwd(), 'article-data.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const articleData: DailyBriefing = JSON.parse(jsonData);
    return (
        <div className='w-full min-h-dvh bg-zinc-200 dark:bg-zinc-900 text-black dark:text-white'>
          <div className='w-full h-full max-w-3xl mx-auto flex flex-col items-center gap-16 px-8 pt-32 pb-12'>
              <WeatherWidget />
              <header className='flex flex-col items-center gap-2'>
                  <div className='flex items-center gap-5'>
                      <NewspaperIcon size={60} weight='bold' className='text-blue-500' />
                      <a href='https://zinas.dvx.lv/' className='text-5xl font-bold'>ZIŅAS<small>_dvx</small></a>
                  </div>
                  <small>Pēdējo reizi atjaunināts: {new Date(articleData.lastUpdatedAt).toLocaleString('lv-LV', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric', hour12: false, timeZone: 'Europe/Riga' })}</small>
              </header>
              <small className='bg-blue-500/10 px-6 py-4 border border-white/20 rounded-md text-[14px]'>Šis ziņu apkopojums ir veidots un kategorizēts ar mākslīgā intelekta (Google Gemini 2.5 Flash) palīdzību. Lūdzu, ņemiet vērā, ka MI modeļi var saturēt neprecizitātes vai interpretācijas kļūdas. Lai pārliecinātos par informācijas precizitāti, vienmēr pārbaudiet oriģinālos ziņu avotus, kas norādīti pie katras ziņas.</small>
              <div className='flex flex-col gap-24 sm:gap-16'>
                  {articleData.newsCategories.map((category) => (
                      <div key={category.category_name} className='w-full flex flex-col gap-5'>
                          <h2 className='text-white text-xl font-bold bg-blue-500 px-7 py-2 rounded-md mb-2 w-full sm:w-fit text-center sm:text-left'>{category.category_name}</h2>
                          {category.articles.filter(article => article.sources[0]).map((article) => (
                              <Article key={article.sources[0].url} article={article} />
                          ))}
                      </div>
                  ))}
              </div>
              <hr className='w-full text-blue-500' />
              <footer>
                  <h2 className='text-lg font-semibold text-pretty md:px-8'>
                      Šī vietne piedāvā automatizētu un kategorizētu jaunāko ziņu apkopojumu no vadošajiem Latvijas ziņu portāliem.
                  </h2>
                  <ul className='mt-8 flex flex-col gap-6 md:px-16'>
                      <li>
                          <h3 className='text-[17px] font-semibold'>Kā tas darbojas?</h3>
                          <p className='mt-1 text-[15px]'>Mēs automātiski apkopojam ziņas no vairākām RSS plūsmām. Tās apstrādā Google Gemini mākslīgais intelekts (MI), kas noņem ziņu dublikātus, veido kopsavilkumus, piešķir kategorijas un atfiltrē nepiemērotu saturu (piemēram, reklāmas, horoskopus, intervijas).</p>
                      </li>
                      <li>
                          <h3 className='text-[17px] font-semibold'>Svarīgi par precizitāti:</h3>
                          <p className='mt-1 text-[15px]'>Lai gan mēs esam rūpīgi izstrādājuši instrukcijas MI modelim, tas var kļūdīties vai nepareizi interpretēt informāciju. Tādēļ mēs nevaram garantēt 100% precizitāti un aicinām jūs vienmēr pārbaudīt informāciju oriģinālajā ziņu avotā. Saite uz to ir pievienota zem katra virsraksta.</p>
                      </li>
                      <li>
                          <h3 className='text-[17px] font-semibold'>Kādus avotus mēs izmantojam?</h3>
                          <p className='mt-1 text-[15px]'>Mēs apkopojam ziņas no vadošajiem Latvijas ziņu portāliem: <a href='https://lsm.lv/' className='text-blue-500 hover:underline'>lsm.lv</a>, <a href='https://tvnet.lv/' className='text-blue-500 hover:underline'>tvnet.lv</a>, <a href='https://delfi.lv/' className='text-blue-500 hover:underline'>delfi.lv</a>, <a href='https://apollo.lv/' className='text-blue-500 hover:underline'>apollo.lv</a> un <a href='https://jauns.lv/' className='text-blue-500 hover:underline'>jauns.lv</a>.</p>
                      </li>
                      <li>
                          <h3 className='text-[17px] font-semibold'>Jautājumi vai ieteikumi?</h3>
                          <p className='mt-1 text-[15px]'>Ja jums ir jautājumi vai ierosinājumi, sazinieties ar mums, rakstot uz e-pastu <a href='mailto:info@dvx.lv' className='text-blue-500 hover:underline'>info@dvx.lv</a>.</p>
                      </li>
                  </ul>
                  <hr className='mt-12 w-full text-blue-500' />
                  <div className='mt-12 flex justify-center gap-4'>
                      <a href='http://192.168.8.90:35200/'>dvx_lv</a>
                      |
                      <span>2025</span>
                  </div>
              </footer>
          </div>
        </div>
    );
}
