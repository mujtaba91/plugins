import { load as loadCheerio, CheerioAPI } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { defaultCover } from '@libs/defaultCover';
import { Filters, FilterTypes } from '@libs/filterInputs';

class NovelsParadise implements Plugin.PluginBase {
  id = 'novelsparadise';
  name = 'Novels Paradise';
  version = '1.2.0';
  icon = 'src/ar/novelsparadise/icon.png';
  // Old WordPress "series/<slug>/" paths still resolve under /np-light/.
  site = 'https://novelsparadise.site/np-light/';

  filters = {
    order: {
      label: 'ترتيب حسب',
      value: 'popular',
      options: [
        { label: 'المضاف حديثًا', value: 'latest' },
        { label: 'آخر التحديثات', value: 'updated' },
        { label: 'عدد الفصول', value: 'chapters' },
        { label: 'عدد المشاهدات', value: 'popular' },
        { label: 'A-Z', value: 'az' },
        { label: 'Z-A', value: 'za' },
        { label: 'التقييم', value: 'rating' },
      ],
      type: FilterTypes.Picker,
    },
    status: {
      label: 'الحالة',
      value: 'all',
      options: [
        { label: 'الكل', value: 'all' },
        { label: 'مكتملة', value: 'Completed' },
        { label: 'متوقفة', value: 'Hiatus' },
        { label: 'مستمرة', value: 'Ongoing' },
        { label: 'مستمرة (OnGoing)', value: 'OnGoing' },
      ],
      type: FilterTypes.Picker,
    },
    'languages[]': {
      label: 'اللغة',
      value: [],
      options: [
        { label: 'الإنجليزية', value: 'الإنجليزية' },
        { label: 'الصينية', value: 'الصينية' },
        { label: 'العربية', value: 'العربية' },
        { label: 'الكورية', value: 'الكورية' },
        { label: 'اليابانية', value: 'اليابانية' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    'types[]': {
      label: 'النوع',
      value: [],
      options: [
        { label: 'الإنجليزية', value: 'الإنجليزية' },
        { label: 'الصينية', value: 'الصينية' },
        { label: 'العربية', value: 'العربية' },
        { label: 'الكورية', value: 'الكورية' },
        { label: 'روايات انجليزية', value: 'روايات انجليزية' },
        { label: 'روايات صينيه', value: 'روايات صينيه' },
        { label: 'روايات كوريه', value: 'روايات كوريه' },
        { label: 'روايات ويب', value: 'روايات ويب' },
        { label: 'روايات يابانية', value: 'روايات يابانية' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    'genres[]': {
      label: 'التصنيف',
      value: [],
      options: [
        { label: '+18', value: '+18' },
        { label: '920', value: '920' },
        { label: '1973', value: '1973' },
        { label: 'Action', value: 'Action' },
        { label: 'Adopted', value: 'Adopted' },
        { label: 'Advancedtechnology', value: 'Advancedtechnology' },
        { label: 'Adventure', value: 'Adventure' },
        { label: 'Age Progression', value: 'Age Progression' },
        { label: 'Age Regression', value: 'Age Regression' },
        { label: 'Alchemy', value: 'Alchemy' },
        { label: 'Anime', value: 'Anime' },
        { label: 'Anime & Comics', value: 'Anime &amp; Comics' },
        { label: 'Antihero', value: 'Antihero' },
        { label: 'Arrogant Characters', value: 'Arrogant Characters' },
        { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
        { label: 'Beautiful Female Lead', value: 'Beautiful Female Lead' },
        {
          label: 'Behind The Scenes Mastermind',
          value: 'Behind The Scenes Mastermind',
        },
        { label: 'Black Belly', value: 'Black Belly' },
        { label: 'Bleach', value: 'Bleach' },
        { label: 'Body Tempering', value: 'Body Tempering' },
        { label: 'Business Management', value: 'Business Management' },
        { label: 'Businessmen', value: 'Businessmen' },
        { label: 'Calm', value: 'Calm' },
        { label: 'Caring', value: 'Caring' },
        { label: 'Cautious', value: 'Cautious' },
        { label: 'Celebrities', value: 'Celebrities' },
        { label: 'Character Growth', value: 'Character Growth' },
        { label: 'Charismatic', value: 'Charismatic' },
        { label: 'Charming', value: 'Charming' },
        { label: 'Cheats', value: 'Cheats' },
        { label: 'Child', value: 'Child' },
        { label: 'Class Awakening', value: 'Class Awakening' },
        { label: 'Clever', value: 'Clever' },
        { label: 'Coming Of Age', value: 'Coming Of Age' },
        { label: 'Confinement', value: 'Confinement' },
        { label: 'Counterattack', value: 'Counterattack' },
        { label: 'Cowardly', value: 'Cowardly' },
        { label: 'Cross', value: 'Cross' },
        { label: 'Crossover', value: 'Crossover' },
        { label: 'Cultivation', value: 'Cultivation' },
        { label: 'Cunning', value: 'Cunning' },
        { label: 'Dao Comprehension', value: 'Dao Comprehension' },
        { label: 'Dark', value: 'Dark' },
        { label: 'Dc', value: 'Dc' },
        { label: 'Delinquents', value: 'Delinquents' },
        { label: 'Demon Slayer', value: 'Demon Slayer' },
        { label: 'Determined', value: 'Determined' },
        { label: 'Douluo Dalu', value: 'Douluo Dalu' },
        { label: 'Dragon Ball', value: 'Dragon Ball' },
        { label: 'Evil', value: 'Evil' },
        { label: 'Evolution', value: 'Evolution' },
        { label: 'Fallen Nobility', value: 'Fallen Nobility' },
        { label: 'Family Business', value: 'Family Business' },
        { label: 'Fan-fic', value: 'Fan-fic' },
        { label: 'Fan Fiction', value: 'Fan Fiction' },
        { label: 'FanMTL', value: 'FanMTL' },
        { label: 'Fantasybrainhole', value: 'Fantasybrainhole' },
        { label: 'Fantasy World', value: 'Fantasy World' },
        { label: 'Farming', value: 'Farming' },
        { label: 'Fast Learner', value: 'Fast Learner' },
        { label: 'Fastpaced', value: 'Fastpaced' },
        { label: 'Female', value: 'Female' },
        { label: 'Football', value: 'Football' },
        { label: 'Futuristic Setting', value: 'Futuristic Setting' },
        { label: 'Game Elements', value: 'Game Elements' },
        { label: 'Genetic Modifications', value: 'Genetic Modifications' },
        { label: 'Genius', value: 'Genius' },
        { label: 'Godly Powers', value: 'Godly Powers' },
        {
          label: 'Graphic Depictions Of Violence',
          value: 'Graphic Depictions Of Violence',
        },
        { label: 'Handsome Male Lead', value: 'Handsome Male Lead' },
        { label: 'Hard Working', value: 'Hard Working' },
        { label: 'Harem', value: 'Harem' },
        { label: 'Harry Potter', value: 'Harry Potter' },
        { label: 'Hated', value: 'Hated' },
        { label: 'Hero', value: 'Hero' },
        { label: 'Hiding True Abilities', value: 'Hiding True Abilities' },
        { label: 'Hiding True Identity', value: 'Hiding True Identity' },
        { label: 'High School Dxd', value: 'High School Dxd' },
        { label: 'Hunter × Hunter', value: 'Hunter × Hunter' },
        { label: 'Immortal', value: 'Immortal' },
        { label: 'Isekai', value: 'Isekai' },
        { label: 'Jujutsu Kaisen', value: 'Jujutsu Kaisen' },
        { label: 'Kingdom Building', value: 'Kingdom Building' },
        { label: 'Kingdombuilding', value: 'Kingdombuilding' },
        { label: 'Leadership', value: 'Leadership' },
        { label: 'Level System', value: 'Level System' },
        { label: 'Levelup', value: 'Levelup' },
        { label: 'Loli', value: 'Loli' },
        { label: 'Loner', value: 'Loner' },
        { label: 'Magic', value: 'Magic' },
        { label: 'Male', value: 'Male' },
        { label: 'Manipulative Characters', value: 'Manipulative Characters' },
        { label: 'Martial arts', value: 'Martial arts' },
        { label: 'Marvel', value: 'Marvel' },
        { label: 'Military', value: 'Military' },
        { label: 'Modern Day', value: 'Modern Day' },
        { label: 'Modern Knowledge', value: 'Modern Knowledge' },
        { label: 'Mortal Flow', value: 'Mortal Flow' },
        { label: 'Multiple Realms', value: 'Multiple Realms' },
        { label: 'My Hero Academia', value: 'My Hero Academia' },
        {
          label: 'Mysterious Family Background',
          value: 'Mysterious Family Background',
        },
        { label: 'Naruto', value: 'Naruto' },
        { label: 'No-Harem', value: 'No-Harem' },
        { label: 'Nonhuman', value: 'Nonhuman' },
        { label: 'Obsessive Love', value: 'Obsessive Love' },
        { label: 'Official Circles', value: 'Official Circles' },
        { label: 'Omegaverse', value: 'Omegaverse' },
        { label: 'One Piece', value: 'One Piece' },
        { label: 'One Punch Man', value: 'One Punch Man' },
        { label: 'OrientalFantasy', value: 'OrientalFantasy' },
        { label: 'Orphans', value: 'Orphans' },
        { label: 'Outer Space', value: 'Outer Space' },
        { label: 'Overhead', value: 'Overhead' },
        { label: 'Overpowered', value: 'Overpowered' },
        { label: 'Past Trauma', value: 'Past Trauma' },
        { label: 'Poor', value: 'Poor' },
        { label: 'Pragmatic', value: 'Pragmatic' },
        { label: 'Previous Life Talent', value: 'Previous Life Talent' },
        { label: 'Proactive', value: 'Proactive' },
        {
          label: 'Protagonist Strong From The Start',
          value: 'Protagonist Strong From The Start',
        },
        { label: 'R18', value: 'R18' },
        { label: 'Reborn', value: 'Reborn' },
        {
          label: 'Reincarnated In Another World',
          value: 'Reincarnated In Another World',
        },
        { label: 'Reincarnation', value: 'Reincarnation' },
        { label: 'Righteous', value: 'Righteous' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Romantic Subplot', value: 'Romantic Subplot' },
        { label: 'Royalty', value: 'Royalty' },
        { label: 'Ruthless', value: 'Ruthless' },
        { label: 'Secretive', value: 'Secretive' },
        { label: 'Showbiz', value: 'Showbiz' },
        { label: 'Slice Of Life', value: 'Slice Of Life' },
        { label: 'Sliceoflife', value: 'Sliceoflife' },
        { label: 'Smut', value: 'Smut' },
        { label: 'Special Abilities', value: 'Special Abilities' },
        {
          label: 'Strength Based Social Hierarchy',
          value: 'Strength Based Social Hierarchy',
        },
        { label: 'Sudden Strength Gain', value: 'Sudden Strength Gain' },
        { label: 'Superpowers', value: 'Superpowers' },
        { label: 'Survival', value: 'Survival' },
        { label: 'System', value: 'System' },
        { label: 'Thestrongactingweak', value: 'Thestrongactingweak' },
        { label: 'Time Travel', value: 'Time Travel' },
        { label: 'Tragic Past', value: 'Tragic Past' },
        { label: 'Transmigration', value: 'Transmigration' },
        {
          label: 'Transported To Another World',
          value: 'Transported To Another World',
        },
        { label: 'Underestimated', value: 'Underestimated' },
        { label: 'Unprincipled', value: 'Unprincipled' },
        { label: 'Urban Life', value: 'Urban Life' },
        { label: 'Villain', value: 'Villain' },
        { label: 'Weak To Strong', value: 'Weak To Strong' },
        { label: 'Weaktostrong', value: 'Weaktostrong' },
        { label: 'Wizards', value: 'Wizards' },
        { label: 'World Hopping', value: 'World Hopping' },
        { label: 'آليه', value: 'آليه' },
        { label: 'أزلي', value: 'أزلي' },
        { label: 'أكشن', value: 'أكشن' },
        { label: 'ألعاب', value: 'ألعاب' },
        { label: 'إعادة بعث', value: 'إعادة بعث' },
        { label: 'اكشن', value: 'اكشن' },
        { label: 'العاب', value: 'العاب' },
        { label: 'ايتشي', value: 'ايتشي' },
        { label: 'بالغ', value: 'بالغ' },
        { label: 'بطل', value: 'بطل' },
        { label: 'تاريخي', value: 'تاريخي' },
        { label: 'تغيير الجنس', value: 'تغيير الجنس' },
        { label: 'جوسي', value: 'جوسي' },
        { label: 'حريم', value: 'حريم' },
        { label: 'حياة مدرسية', value: 'حياة مدرسية' },
        { label: 'خارق للطبيعة', value: 'خارق للطبيعة' },
        { label: 'خيال', value: 'خيال' },
        { label: 'خيال علمي', value: 'خيال علمي' },
        { label: 'دراما', value: 'دراما' },
        { label: 'دمويا', value: 'دمويا' },
        { label: 'رعب', value: 'رعب' },
        { label: 'رومانسي', value: 'رومانسي' },
        { label: 'رياضي', value: 'رياضي' },
        { label: 'ستدعاء', value: 'ستدعاء' },
        { label: 'سحر', value: 'سحر' },
        { label: 'سنين', value: 'سنين' },
        { label: 'سينين', value: 'سينين' },
        { label: 'شبه بشريه', value: 'شبه بشريه' },
        { label: 'شرقي', value: 'شرقي' },
        { label: 'شريحة من الحياة', value: 'شريحة من الحياة' },
        { label: 'شريحة من الحياه', value: 'شريحة من الحياه' },
        { label: 'شرير', value: 'شرير' },
        { label: 'شوانهوان', value: 'شوانهوان' },
        { label: 'شوجو', value: 'شوجو' },
        { label: 'شونين', value: 'شونين' },
        { label: 'شونين آي', value: 'شونين آي' },
        { label: 'شيانشيا', value: 'شيانشيا' },
        { label: 'صيني', value: 'صيني' },
        { label: 'غموض', value: 'غموض' },
        { label: 'فاحش', value: 'فاحش' },
        { label: 'فان فيكشن', value: 'فان فيكشن' },
        { label: 'فنون', value: 'فنون' },
        { label: 'فنون قتالية', value: 'فنون قتالية' },
        { label: 'فنون قتاليه', value: 'فنون قتاليه' },
        { label: 'قتالية', value: 'قتالية' },
        { label: 'قوة', value: 'قوة' },
        { label: 'كائنات', value: 'كائنات' },
        { label: 'كوميدي', value: 'كوميدي' },
        { label: 'كوميديا', value: 'كوميديا' },
        { label: 'كوني', value: 'كوني' },
        { label: 'مأساة', value: 'مأساة' },
        { label: 'مأساوي', value: 'مأساوي' },
        { label: 'مترجمة', value: 'مترجمة' },
        { label: 'مظلم', value: 'مظلم' },
        { label: 'مغامرات', value: 'مغامرات' },
        { label: 'مغامرة', value: 'مغامرة' },
        { label: 'مغامره', value: 'مغامره' },
        { label: 'مفرطة', value: 'مفرطة' },
        { label: 'ميكا', value: 'ميكا' },
        { label: 'ميكانيكي', value: 'ميكانيكي' },
        { label: 'نظام', value: 'نظام' },
        { label: 'نفسي', value: 'نفسي' },
        { label: 'وإثارة', value: 'وإثارة' },
        { label: 'وسيف', value: 'وسيف' },
        { label: 'وصناعة', value: 'وصناعة' },
        { label: 'ومأساة', value: 'ومأساة' },
        { label: 'ووشيا', value: 'ووشيا' },
        { label: 'يقتال', value: 'يقتال' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
  } satisfies Filters;

  private async fetchDoc(url: string): Promise<CheerioAPI> {
    const res = await fetchApi(url);
    const html = await res.text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() || '';
    if (
      title === 'Just a moment...' ||
      title.startsWith('Attention Required')
    ) {
      throw new Error('Cloudflare check, please open in webview.');
    }
    if (!res.ok) {
      throw new Error(
        `Could not reach site (${res.status}) try to open in webview.`,
      );
    }
    return loadCheerio(html);
  }

  private toPath(href: string): string {
    return href.replace(/^(https?:\/\/[^/]+)?\/np-light\//, '');
  }

  private absolute(src: string | undefined): string {
    if (!src) return defaultCover;
    return new URL(src, this.site).href;
  }

  private parseNovels($: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    $('article.series-card').each((_, el) => {
      const link = $(el).find('a.series-card-main').first();
      const href = link.attr('href');
      const name = link.find('h2').text().trim();
      if (!href || !name) return;
      const img = link.find('img').first();
      novels.push({
        name,
        path: this.toPath(href),
        cover: this.absolute(img.attr('data-src') || img.attr('src')),
      });
    });
    return novels;
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const params = [`page=${pageNo}`];
    if (showLatestNovels) {
      params.push('order=updated');
    } else if (filters) {
      for (const key in filters) {
        const value = filters[key as keyof typeof filters].value;
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
          if (v && v !== 'all') {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
          }
        }
      }
    } else {
      params.push('order=popular');
    }
    const $ = await this.fetchDoc(
      `${this.site}series-list/?${params.join('&')}`,
    );
    return this.parseNovels($);
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const $ = await this.fetchDoc(
      `${this.site}search/?q=${encodeURIComponent(searchTerm)}&page=${pageNo}`,
    );
    return this.parseNovels($);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const $ = await this.fetchDoc(this.site + novelPath);
    const page = $('article.series-page');

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: page.find('.series-hero h1').first().text().trim() || 'Untitled',
      cover: this.absolute(page.find('img.series-cover-poster').attr('src')),
    };

    page.find('.series-info-list > div').each((_, el) => {
      if ($(el).find('dt').text().trim() === 'المؤلف') {
        novel.author = $(el).find('dd').text().trim();
      }
    });
    novel.genres = page
      .find('.tag-list a.tag-link')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(',');

    const description = page.find('.description-full').length
      ? page.find('.description-full')
      : page.find('.description-short');
    novel.summary = description
      .find('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join('\n\n');

    const status = (
      page.find('[data-series-status]').attr('data-series-status') || ''
    ).toLowerCase();
    if (status === 'completed') novel.status = NovelStatus.Completed;
    else if (status === 'ongoing') novel.status = NovelStatus.Ongoing;
    else if (status === 'hiatus') novel.status = NovelStatus.OnHiatus;
    else novel.status = NovelStatus.Unknown;

    const chapters: Plugin.ChapterItem[] = [];
    page.find('a.chapter-row').each((_, el) => {
      const row = $(el);
      const href = row.attr('href');
      if (!href) return;
      const number = parseFloat(
        row.attr('data-chapter-sort') || row.attr('data-chapter-number') || '',
      );
      chapters.push({
        name: row.find('span').first().text().trim() || 'Chapter',
        path: this.toPath(href),
        chapterNumber: isNaN(number) ? undefined : number,
        releaseTime: row.find('time').text().trim() || null,
      });
    });
    // The site lists newest first.
    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = await this.fetchDoc(this.site + chapterPath);
    const content = $('article.reader div.chapter-content').first();
    if (!content.length) return '';
    content.find('script, style, noscript, iframe, .ad-placeholder').remove();
    content.find('*').each((_, el) => {
      for (const name of Object.keys(el.attribs)) {
        if (/^on/i.test(name)) $(el).removeAttr(name);
      }
    });
    return content.html()?.trim() || '';
  }

  resolveUrl = (path: string): string => this.site + path;
}

export default new NovelsParadise();
