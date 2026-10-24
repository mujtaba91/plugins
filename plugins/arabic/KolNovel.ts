import { load as loadCheerio, CheerioAPI } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { defaultCover } from '@libs/defaultCover';
import { Filters, FilterTypes } from '@libs/filterInputs';

type VolumeResponse = {
  success: boolean;
  data?: { html: string; page: number; pages: number };
};

class KolNovel implements Plugin.PluginBase {
  id = 'kolnovel';
  name = 'Kol Novel';
  version = '1.2.0';
  icon = 'src/ar/kolnovel/icon.png';
  site = 'https://kolnovel.com/';

  filters = {
    order: {
      label: 'الترتيب',
      value: 'popular',
      options: [
        { label: 'العنوان: أ–ي', value: 'title' },
        { label: 'العنوان: ي–أ', value: 'titlereverse' },
        { label: 'آخر التحديثات', value: 'update' },
        { label: 'المضاف حديثًا', value: 'latest' },
        { label: 'الأكثر رواجًا', value: 'popular' },
        { label: 'الأعلى تقييمًا', value: 'rating' },
      ],
      type: FilterTypes.Picker,
    },
    status: {
      label: 'الحالة',
      value: '',
      options: [
        { label: 'الكل', value: '' },
        { label: 'مستمرة', value: 'ongoing' },
        { label: 'متوقفة مؤقتًا', value: 'hiatus' },
        { label: 'مكتملة', value: 'completed' },
      ],
      type: FilterTypes.Picker,
    },
    'type[]': {
      label: 'النوع',
      value: [],
      options: [
        { label: 'أقصوصة', value: 'ون-شوت' },
        { label: 'إنجليزية', value: 'english' },
        { label: 'رواية خفيفة', value: 'light-novel' },
        { label: 'رواية شبكية', value: 'web-novel' },
        { label: 'صينية', value: 'chinese' },
        { label: 'عربية', value: 'arabic' },
        { label: 'كتاب ورقي', value: 'كتاب-ورقي' },
        { label: 'كورية', value: 'korean' },
        { label: 'مؤلفة', value: 'مؤلفة' },
        { label: 'يابانية', value: 'japanese' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    'genre[]': {
      label: 'التصنيف',
      value: [],
      options: [
        { label: 'أسرار', value: 'أسرار' },
        { label: 'أشباح', value: 'أشباح' },
        { label: 'أعراق', value: 'أعراق' },
        { label: 'أكشن', value: 'action' },
        { label: 'أكشن مغامرة', value: 'أكشن-مغامرة' },
        { label: 'ألعاب', value: 'ألعاب' },
        { label: 'ألغاز', value: 'ألغاز' },
        { label: 'إثارة', value: 'excitement' },
        { label: 'إثارة وتشويق', value: 'إثارة-وتشويق' },
        { label: 'إسلامي', value: 'إسلامي' },
        { label: 'إنتقال الى عالم أخر', value: 'isekai' },
        { label: 'إنتقام', value: 'إنتقام' },
        { label: 'إيسيكاي', value: 'إيسيكاي' },
        { label: 'استراتيجي', value: 'استراتيجي' },
        { label: 'اكشن', value: 'اكشن' },
        { label: 'اكشن مغامرات', value: 'اكشن-مغامرات' },
        { label: 'الخيال العلمي', value: 'sci-fi' },
        { label: 'العصر الحديث', value: 'العصر-الحديث' },
        { label: 'انتقال إلى عالم آخر', value: 'انتقال-إلى-عالم-آخر' },
        { label: 'انتقام', value: 'انتقام' },
        { label: 'ايسيكاي', value: 'ايسيكاي' },
        { label: 'بطل ذكي', value: 'بطل-ذكي' },
        { label: 'بطل رمادي', value: 'بطل-رمادي' },
        { label: 'بطل شرير', value: 'بطل-شرير' },
        { label: 'بطل مضاد', value: 'بطل-مضاد' },
        { label: 'بطل ناضج', value: 'بطل-ناضج' },
        { label: 'بطل وقح', value: 'بطل-وقح' },
        { label: 'بقاء', value: 'بقاء' },
        { label: 'بقاء على قيد الحياة', value: 'بقاء-على-قيد-الحياة' },
        { label: 'بناء إمبراطورية', value: 'بناء-إمبراطورية' },
        { label: 'بناء ممالك', value: 'بناء-ممالك' },
        { label: 'بناء مملكة', value: 'بناء-مملكة' },
        { label: 'بوليسي', value: 'policy' },
        { label: 'تاريخي', value: 'historical' },
        { label: 'تحقيقات', value: 'تحقيق' },
        { label: 'تدريب', value: 'تدريب' },
        { label: 'تشويق', value: 'تشويق' },
        { label: 'تطور شخصيات', value: 'تطور-شخصيات' },
        { label: 'تقمص شخصيات', value: 'rpg' },
        { label: 'تناسخ', value: 'تناسخ' },
        { label: 'جريمة', value: 'crime' },
        { label: 'جوسي', value: 'جوسي' },
        { label: 'حرب', value: 'حرب' },
        { label: 'حرب بين النجوم', value: 'حرب-بين-النجوم' },
        { label: 'حروب', value: 'حروب' },
        { label: 'حريم', value: 'harem' },
        { label: 'حل الألغاز', value: 'حل-الألغاز' },
        { label: 'حياة مدرسية', value: 'school-life' },
        { label: 'خارق للطبيعة', value: 'خارق-للطبيعة' },
        { label: 'خوارق', value: 'خوارق' },
        { label: 'خيال', value: 'خيال' },
        { label: 'خيال علمي', value: 'خيال-علمي' },
        { label: 'خيال مظلم', value: 'خيال-مظلم' },
        { label: 'داخل لعبة', value: 'داخل-لعبة' },
        { label: 'دراما', value: 'drama' },
        { label: 'دموي', value: 'دموي' },
        { label: 'دهاليز', value: 'دهاليز' },
        { label: 'رعب', value: 'horror' },
        { label: 'رعب كوني', value: 'رعب-كوني' },
        { label: 'رعب نفسي', value: 'رعب-نفسي' },
        { label: 'رومانسي', value: 'romantic' },
        { label: 'رومانسية', value: 'رومانسية' },
        { label: 'رياضة', value: 'رياضة' },
        { label: 'زراعة', value: 'زراعة' },
        { label: 'زنزانات', value: 'زنزانات' },
        { label: 'سحر', value: 'magic' },
        { label: 'سفر بالزمن', value: 'سفر-بالزمن' },
        { label: 'سفر عبر الزمن', value: 'سفر-عبر-الزمن' },
        { label: 'سلالة نادرة', value: 'سلالة-نادرة' },
        { label: 'سنين', value: 'سنين' },
        { label: 'سوداوي', value: 'سوداوي' },
        { label: 'سياسة', value: 'سياسة' },
        { label: 'سياسية', value: 'سياسية' },
        { label: 'سينن', value: 'senen' },
        { label: 'سينين', value: 'سينين' },
        { label: 'شريحة من الحياة', value: 'slice-of-life' },
        { label: 'شعر', value: 'شعر' },
        { label: 'شوانهوان', value: 'شوانهوان' },
        { label: 'شوجو', value: 'shojo' },
        { label: 'شونين', value: 'shonen' },
        { label: 'شياطين', value: 'شياطين' },
        { label: 'شيانشيا', value: 'شيانشيا' },
        { label: 'صراعات سياسية', value: 'صراعات-سياسية' },
        { label: 'طبي', value: 'medical' },
        { label: 'ظواهر خارقة للطبيعة', value: 'supernatural' },
        { label: 'عائلي', value: 'عائلي' },
        { label: 'عالم واسع', value: 'عالم-واسع' },
        { label: 'عسكري', value: 'عسكري' },
        { label: 'عسكرية', value: 'عسكرية' },
        { label: 'عشائر', value: 'عشائر' },
        { label: 'عموض', value: 'عموض' },
        { label: 'غموض', value: 'mysteries' },
        { label: 'غموض تدريجي', value: 'غموض-تدريجي' },
        { label: 'غموض نفسي', value: 'غموض-نفسي' },
        { label: 'غير بشري', value: 'غير-بشري' },
        { label: 'فان فيكشن', value: 'فان-فيكشن' },
        { label: 'فانتازي', value: 'فانتازي' },
        { label: 'فانتازيا', value: 'فانتازيا' },
        { label: 'فانفيك', value: 'فانفيك' },
        { label: 'فضاء', value: 'فضاء' },
        { label: 'فلسفي', value: 'فلسفي' },
        { label: 'فناء', value: 'فناء' },
        { label: 'فنتازيا', value: 'فنتازيا' },
        { label: 'فنون القتال', value: 'martial-arts' },
        { label: 'فنون قتال', value: 'فنون-قتال' },
        { label: 'فنون قتالية', value: 'فنون-قتالية' },
        { label: 'قصة قصيرة', value: 'قصة-قصيرة' },
        { label: 'قوة خارقة', value: 'قوة-خارقة' },
        { label: 'قوى خارقة', value: 'superpower' },
        { label: 'كوميدي', value: 'comedy' },
        { label: 'كوميديا', value: 'كوميديا' },
        { label: 'كوميدية', value: 'كوميدية' },
        { label: 'مأسأة', value: 'مأسأة' },
        { label: 'مأساة', value: 'مأساة' },
        { label: 'مأساوي', value: 'tragedy' },
        { label: 'مؤامرة', value: 'مؤامرة' },
        { label: 'ما بعد الكارثة', value: 'after-the-disaster' },
        { label: 'ما بعد نهاية العالم', value: 'ما-بعد-نهاية-العالم' },
        { label: 'ماساة', value: 'ماساة' },
        { label: 'مدرسي', value: 'مدرسي' },
        { label: 'مدرسية', value: 'مدرسية' },
        { label: 'مضاد البطل', value: 'مضاد-البطل' },
        { label: 'مظلمة', value: 'مظلمة' },
        { label: 'مغامرات', value: 'مغامرات' },
        { label: 'مغامرة', value: 'adventure' },
        { label: 'مكر و خداع', value: 'مكر-و-خداع' },
        { label: 'ميكا', value: 'mechanical' },
        { label: 'ناضج', value: 'mature' },
        { label: 'نظام', value: 'نظام' },
        { label: 'نفسي', value: 'psychological' },
        { label: 'هوية مخفية', value: 'هوية-مخفية' },
        { label: 'ون شوت', value: 'ون-شوت' },
        { label: 'ووشيا', value: 'ووشيا' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
  } satisfies Filters;

  private async fetchHtml(url: string): Promise<string> {
    const res = await fetchApi(url);
    if (!res.ok) {
      throw new Error(
        `Could not reach site (${res.status}) try to open in webview.`,
      );
    }
    return res.text();
  }

  // Archive and search pages past the last one answer 404.
  private async fetchListing(url: string): Promise<Plugin.NovelItem[]> {
    const res = await fetchApi(url);
    if (res.status === 404) return [];
    if (!res.ok) {
      throw new Error(
        `Could not reach site (${res.status}) try to open in webview.`,
      );
    }
    return this.parseNovels(loadCheerio(await res.text()));
  }

  private toPath(url: string): string {
    return url.replace(/^https?:\/\/[^/]+\//, '');
  }

  private parseNovels($: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    $('article.kol-series-archive__item').each((_, el) => {
      const item = $(el);
      const link = item.find('[data-kol-series-title-source]').first();
      const href = link.attr('href');
      const name = link.text().trim() || link.attr('title')?.trim();
      if (!href || !name) return;
      const img = item.find('.kol-series-archive__cover img').first();
      novels.push({
        name,
        path: this.toPath(href),
        cover: img.attr('data-src') || img.attr('src') || defaultCover,
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
    const params: string[] = [];
    if (showLatestNovels) {
      params.push('order=update');
    } else if (filters) {
      for (const key in filters) {
        const value = filters[key as keyof typeof filters].value;
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
          if (v)
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
        }
      }
    } else {
      params.push('order=popular');
    }
    // Page 1 must not carry /page/1/, the site redirects it away.
    const page = pageNo > 1 ? `page/${pageNo}/` : '';
    return this.fetchListing(`${this.site}series/${page}?${params.join('&')}`);
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const page = pageNo > 1 ? `page/${pageNo}/` : '';
    return this.fetchListing(
      `${this.site}${page}?s=${encodeURIComponent(searchTerm)}&post_type=series`,
    );
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const $ = loadCheerio(await this.fetchHtml(this.site + novelPath));

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $('h1.kol-series-editorial__title').text().trim() || 'Untitled',
    };

    const cover = $('.kol-series-editorial__cover img').first();
    novel.cover = cover.attr('data-src') || cover.attr('src') || defaultCover;
    novel.author = $('.kol-series-editorial__byline a')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(', ');
    novel.genres = $('.kol-series-editorial__genres a')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(',');
    // Direct <p> children only: the prose block also embeds a donation widget.
    novel.summary = $('.kol-series-editorial__prose')
      .first()
      .children('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join('\n\n');

    const status = $('.kol-series-editorial__status').first().text().trim();
    if (status.includes('مستمر')) novel.status = NovelStatus.Ongoing;
    else if (status.includes('مكتمل')) novel.status = NovelStatus.Completed;
    else if (status.includes('متوقف')) novel.status = NovelStatus.OnHiatus;
    else novel.status = NovelStatus.Unknown;

    novel.chapters = await this.fetchChapters($);
    return novel;
  }

  // Each volume's chapters are lazy-loaded 50 at a time through admin-ajax.
  private async fetchChapters($: CheerioAPI): Promise<Plugin.ChapterItem[]> {
    const index = $('[data-kol-chapter-index]').first();
    const ajaxUrl = index.attr('data-kol-volume-url');
    const nonce = index.attr('data-kol-volume-nonce');
    const seriesId = index.attr('data-kol-series-id');
    if (!ajaxUrl || !nonce || !seriesId) return [];

    const volumes = index
      .find('details[data-kol-chapter-volume]')
      .map((_, el) => $(el).attr('data-kol-chapter-volume') || '')
      .get();

    const fetchPage = async (volume: string, page: number) => {
      const url =
        `${ajaxUrl}?action=kol_series_volume_chapters` +
        `&nonce=${encodeURIComponent(nonce)}` +
        `&series_id=${encodeURIComponent(seriesId)}` +
        `&volume=${encodeURIComponent(volume)}` +
        `&page=${page}&anchor_id=0`;
      const res = await fetchApi(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Could not load chapters (${res.status})`);
      const json = (await res.json()) as VolumeResponse;
      if (!json.success || !json.data) {
        throw new Error('Could not load chapters, try to open in webview.');
      }
      return json.data;
    };

    // Batches keep large novels (30+ pages) from flooding the site.
    const runBatched = async <T, R>(
      items: T[],
      fn: (item: T) => Promise<R>,
    ) => {
      const results: R[] = [];
      for (let i = 0; i < items.length; i += 5) {
        results.push(...(await Promise.all(items.slice(i, i + 5).map(fn))));
      }
      return results;
    };

    const firstPages = await runBatched(volumes, v => fetchPage(v, 1));
    const rest: { volume: number; page: number }[] = [];
    firstPages.forEach((data, volume) => {
      for (let page = 2; page <= data.pages; page++)
        rest.push({ volume, page });
    });
    const restPages = await runBatched(rest, r =>
      fetchPage(volumes[r.volume], r.page),
    );

    const htmlByVolume: string[][] = firstPages.map(data => [data.html]);
    rest.forEach((r, i) => htmlByVolume[r.volume].push(restPages[i].html));

    // The site lists newest first, both across volumes and within each page.
    const chapters: Plugin.ChapterItem[] = [];
    for (const pages of htmlByVolume) {
      for (const html of pages) chapters.push(...this.parseChapterRows(html));
    }
    return chapters.reverse();
  }

  private parseChapterRows(html: string): Plugin.ChapterItem[] {
    const $ = loadCheerio(html);
    const chapters: Plugin.ChapterItem[] = [];
    $('li.kol-series-chapter').each((_, el) => {
      const row = $(el);
      const link = row.find('a.kol-series-chapter__link').first();
      const href = link.attr('href');
      if (!href) return;
      const label = row.find('.kol-series-chapter__number').text().trim();
      const title = row.find('[data-kol-chapter-title]').text().trim();
      const number = parseFloat(
        row.find('[data-kol-chapter-number]').attr('data-kol-chapter-number') ||
          '',
      );
      chapters.push({
        name: [label, title].filter(Boolean).join(' - ') || 'Chapter',
        path: this.toPath(href),
        chapterNumber: isNaN(number) ? undefined : number,
        releaseTime: row.find('time[datetime]').attr('datetime') || null,
      });
    });
    return chapters;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = loadCheerio(await this.fetchHtml(this.site + chapterPath));
    const content = $('.epcontent').first();
    // No content block means a login wall or error page, not a chapter.
    if (!content.length) return '';
    content.find('script, style, noscript, iframe, .code-block').remove();
    content.find('*').each((_, el) => {
      for (const name of Object.keys(el.attribs)) {
        if (/^on/i.test(name)) $(el).removeAttr(name);
      }
    });
    return content.html() || '';
  }

  resolveUrl = (path: string): string => this.site + path;
}

export default new KolNovel();
