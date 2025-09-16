'use client';

export default function LangSwitcher() {
  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload(); // recharge pour appliquer la langue
  };

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => changeLocale('en')}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        EN
      </button>
      <button
        onClick={() => changeLocale('fr')}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        FR
      </button>
      <button
        onClick={() => changeLocale('de')}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        DE
      </button>
    </div>
  );
}
