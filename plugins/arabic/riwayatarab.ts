import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { Filters, FilterTypes } from '@libs/filterInputs';

type NovelJSON = {
  title: string;
  slug: string;
  author: string | null;
  description: string | null;
  cover_image: string | null;
  status: string;
  category_name: string | null;
  tags?: string[] | null;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
};

type NovelsResponse = {
  novels: NovelJSON[];
  pagination: Pagination;
};

type ChapterJSON = {
  title: string;
  chapter_number: number;
  created_at: string;
};

type ChaptersResponse = {
  chapters: ChapterJSON[];
  pagination: Pagination;
};

type ChapterResponse = {
  chapter: { title: string; content: string };
};

const statusMap: Record<string, string> = {
  ongoing: NovelStatus.Ongoing,
  completed: NovelStatus.Completed,
  hiatus: NovelStatus.OnHiatus,
};

class RiwayatArab implements Plugin.PluginBase {
  id = 'riwayatarab';
  name = 'Riwayat Arab';
  version = '1.0.0';
  icon = 'src/ar/riwayatarab/icon.png';
  site = 'https://riwayatarab.com/';

  private apiUrl = 'https://api.riwayatarab.com/api';

  filters = {
    sort: {
      label: 'الترتيب',
      value: 'views',
      options: [
        { label: 'الأكثر مشاهدة', value: 'views' },
        { label: 'آخر تحديث', value: 'updated_at' },
        { label: 'الأحدث', value: 'created_at' },
        { label: 'الأعلى تقييماً', value: 'rating' },
      ],
      type: FilterTypes.Picker,
    },
    status: {
      label: 'الحالة',
      value: '',
      options: [
        { label: 'الكل', value: '' },
        { label: 'مستمرة', value: 'ongoing' },
        { label: 'مكتملة', value: 'completed' },
        { label: 'متوقفة', value: 'hiatus' },
      ],
      type: FilterTypes.Picker,
    },
    category: {
      label: 'التصنيف',
      value: '',
      options: [
        { label: 'الكل', value: '' },
        { label: '+18', value: '18' },
        { label: 'إثارة', value: 'thriller' },
        { label: 'اعادة ولادة', value: 'اعادة-ولادة' },
        { label: 'اكشن', value: 'action' },
        { label: 'التناسخ', value: 'التناسخ' },
        { label: 'حريم', value: 'harem' },
        { label: 'حيوان مرافق', value: 'حيوان-مرافق' },
        { label: 'خيال', value: 'fantasy' },
        { label: 'دراما', value: 'drama' },
        { label: 'رعب', value: 'رعب' },
        { label: 'رومانسي', value: 'رومانسي' },
        { label: 'رومانسية', value: 'romance' },
        { label: 'زراعة', value: 'زراعة' },
        { label: 'سحر', value: 'سحر' },
        { label: 'سوداوي', value: 'سوداوي' },
        { label: 'ضعيف الى قوي', value: 'ضعيف-الى-قوي' },
        { label: 'عالم حديث', value: 'عالم-حديث' },
        { label: 'عام', value: 'عام' },
        { label: 'غموض', value: 'غموض' },
        { label: 'فنون قتالية', value: 'martial-arts' },
        { label: 'قوي الى اقوى', value: 'قوي-الى-اقوى' },
        { label: 'كوميدي', value: 'كوميدي' },
        { label: 'كوميديا', value: 'comedy' },
        { label: 'لعبة', value: 'لعبة' },
        { label: 'مدرسية', value: 'مدرسية' },
        { label: 'مغامرة', value: 'مغامرة' },
        { label: 'مولفة', value: 'مولفة' },
        { label: 'نظام', value: 'نظام' },
        { label: 'نفسي', value: 'نفسي' },
        { label: 'نهاية عالم', value: 'نهاية-عالم' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;

  private async fetchJson<T>(url: string): Promise<T> {
    const res = await fetchApi(url);
    if (!res.ok) {
      throw new Error(`Could not reach site (${res.status})`);
    }
    return res.json() as Promise<T>;
  }

  // "novel/<slug>/..." -> "<slug>"
  private slugFromPath(path: string): string {
    return path.split('/')[1];
  }

  private toNovelItems(novels: NovelJSON[]): Plugin.NovelItem[] {
    return (
      novels
        // Percent-encoded slugs are broken on the site itself.
        .filter(novel => !novel.slug.includes('%'))
        .map(novel => ({
          name: novel.title,
          path: `novel/${novel.slug}`,
          cover: novel.cover_image || undefined,
        }))
    );
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const sort = showLatestNovels ? 'updated_at' : filters.sort.value;
    let url = `${this.apiUrl}/novels?limit=24&page=${pageNo}&sort=${sort}`;
    if (filters.status.value) {
      url += `&status=${filters.status.value}`;
    }
    if (filters.category.value) {
      url += `&category=${encodeURIComponent(filters.category.value)}`;
    }
    const data = await this.fetchJson<NovelsResponse>(url);
    return this.toNovelItems(data.novels);
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.apiUrl}/novels?limit=24&page=${pageNo}&search=${encodeURIComponent(searchTerm)}`;
    const data = await this.fetchJson<NovelsResponse>(url);
    return this.toNovelItems(data.novels);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const slug = encodeURIComponent(this.slugFromPath(novelPath));
    const novel = await this.fetchJson<NovelJSON>(
      `${this.apiUrl}/novels/${slug}`,
    );

    const genres = novel.tags?.length
      ? novel.tags
      : novel.category_name
        ? [novel.category_name]
        : [];

    const chapters: Plugin.ChapterItem[] = [];
    const chaptersUrl = `${this.apiUrl}/novels/${slug}/chapters?limit=100`;
    const first = await this.fetchJson<ChaptersResponse>(
      `${chaptersUrl}&page=1`,
    );
    const pages = [first];
    const rest: Promise<ChaptersResponse>[] = [];
    for (let page = 2; page <= first.pagination.totalPages; page++) {
      rest.push(
        this.fetchJson<ChaptersResponse>(`${chaptersUrl}&page=${page}`),
      );
    }
    pages.push(...(await Promise.all(rest)));

    for (const page of pages) {
      for (const chapter of page.chapters) {
        chapters.push({
          name: chapter.title,
          // The chapter endpoint is keyed by number, not slug.
          path: `novel/${novel.slug}/chapter/${chapter.chapter_number}`,
          chapterNumber: Number(chapter.chapter_number) || undefined,
          releaseTime: chapter.created_at,
        });
      }
    }

    return {
      path: novelPath,
      name: novel.title,
      cover: novel.cover_image || undefined,
      author: novel.author || undefined,
      summary: novel.description || undefined,
      genres: genres.join(', '),
      status: statusMap[novel.status] || NovelStatus.Unknown,
      chapters,
    };
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const parts = chapterPath.split('/');
    const slug = encodeURIComponent(parts[1]);
    const chapterNumber = encodeURIComponent(parts[3]);
    const data = await this.fetchJson<ChapterResponse>(
      `${this.apiUrl}/novels/${slug}/chapter/${chapterNumber}`,
    );

    // Content is plain text; wrap each non-empty line in a paragraph.
    return data.chapter.content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(
        line =>
          `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`,
      )
      .join('\n');
  }

  resolveUrl = (path: string) => this.site + path;
}

export default new RiwayatArab();
