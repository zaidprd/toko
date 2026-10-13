'use client';

import React from 'react';

export type FilterOption = 
  | 'ALL' 
  | 'INSTANT_DOWNLOAD' 
  | 'PHYSICAL' 
  | 'AGE_1_3' 
  | 'AGE_4_6' 
  | 'AGE_7_10' 
  | 'UNDER_50K';

interface FilterPillsProps {
  activeFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
  totalResults: number;
}

export default function FilterPills({
  activeFilter,
  onSelectFilter,
  totalResults,
}: FilterPillsProps) {
  const pills: { id: FilterOption; label: string }[] = [
    { id: 'ALL', label: 'Semua Produk' },
    { id: 'INSTANT_DOWNLOAD', label: '⚡ Unduhan Instan' },
    { id: 'PHYSICAL', label: '📦 Produk Fisik (Kirim Kurir)' },
    { id: 'AGE_1_3', label: '👶 Usia 1-3 Tahun' },
    { id: 'AGE_4_6', label: '🧒 Usia 4-6 Tahun' },
    { id: 'AGE_7_10', label: '👦 Usia 7-10 Tahun' },
    { id: 'UNDER_50K', label: '🏷️ Di Bawah Rp 50.000' },
  ];

  return (
    <div className="py-4 border-b border-[#E6E1D8] bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#222222] tracking-wide">
              Filter Cepat:
            </h2>
            <span className="text-xs text-[#7A7A7A]">
              Menampilkan {totalResults} pilihan edukasi
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {pills.map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onSelectFilter(pill.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#222222] text-white border-[#222222] shadow-xs'
                    : 'bg-white hover:bg-[#F3EEE7] text-[#595959] hover:text-[#222222] border-[#E6E1D8]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
