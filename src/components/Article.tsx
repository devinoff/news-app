import {ReactElement} from "react";
import LsmLogo from "@/components/LsmLogo";
import TvnetLogo from "@/components/TvnetLogo";
import DelfiLogo from "@/components/DelfiLogo";
import JaunsLogo from "@/components/JaunsLogo";
import ApolloLogo from "@/components/ApolloLogo";
import {Article as ArticleInterface} from "@/types";

const logos: Record<string, ReactElement> = {
    LSM: <LsmLogo className='w-3 h-3' />,
    TVNET: <TvnetLogo className='w-3 h-3' />,
    DELFI: <DelfiLogo className='w-6 h-3' />,
    JAUNS: <JaunsLogo className='w-3 h-3' />,
    APOLLO: <ApolloLogo className='w-3 h-3' />
};

const labels: Record<string, string> = {
    LSM: 'lsm.lv',
    TVNET: 'tvnet.lv',
    DELFI: 'delfi.lv',
    JAUNS: 'jauns.lv',
    APOLLO: 'apollo.lv'
};

export default function Article({ article }: { article: ArticleInterface }): ReactElement {
    return (
        <div key={`${article.headline}–${article.sources[0]?.url || 'no-url'}`} className='flex flex-col gap-2 sm:gap-1 group'>
            <p className='text-pretty text-[17px] font-medium leading-7'>
                {article.headline}
            </p>
            {article.sources[0]?.title ? (
                <div className='flex flex-wrap items-center gap-3 transition-[opacity,max-height] duration-200 ease-in-out sm:opacity-0 sm:max-h-2 sm:group-hover:opacity-100 sm:group-hover:max-h-7 mb-2 sm:mb-0'>
                    <small>Avoti:</small>
                    <div className='flex flex-wrap items-center gap-2'>
                        {article.sources.map((source) => (
                            <a key={`${article.headline}-${source.url}`} href={source.url} target='_blank' rel='noopener noreferrer' aria-label={labels[source.name]} className='w-fit h-7 p-2 bg-zinc-300 dark:bg-zinc-800 rounded-full cursor-pointer group/source flex items-center relative'>
                                {logos[source.name]}
                                <small className='max-sm:hidden h-3 leading-3 transition-all duration-200 ease-in-out opacity-100 sm:opacity-0 group-hover/source:opacity-100 max-w-24 sm:max-w-0 group-hover/source:max-w-24 pl-2 sm:pl-0 group-hover/source:pl-2 pointer-events-none'>
                                    {labels[source.name]}
                                </small>
                                <div className='absolute hidden lg:flex left-0 bottom-9 w-72 flex-col gap-2 p-4 bg-zinc-300/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-md transition-all duration-200 ease-in-out opacity-0 group-hover/source:opacity-100 translate-y-4 group-hover/source:translate-y-0 pointer-events-none'>
                                    <h3>{source.title}</h3>
                                    <h4 className='text-xs'>Publicēts: {source.published_at}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='transition-[opacity,max-height] duration-200 ease-in-out sm:opacity-0 sm:max-h-2 sm:group-hover:opacity-100 sm:group-hover:max-h-7 mb-2 sm:mb-0'>
                    <small>Avotu nav</small>
                </div>
            )}
        </div>
    );
}