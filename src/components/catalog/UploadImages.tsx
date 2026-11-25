"use client";

import Image from "next/image";
import { Check, Images, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { LoadImageType } from "@/types/loadImageType";

type UploadImagesProps = {
  images: LoadImageType[];
  selectedUrls?: string[];
  onSelect: (urls: string[]) => void;
  buttonLabel?: string;
  disabled?: boolean;
};

export default function UploadImages({
  images,
  selectedUrls = [],
  onSelect,
  buttonLabel = "Выбрать фото",
  disabled = false,
}: UploadImagesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(selectedUrls);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleImage = (url: string) => {
    setSelected((current) =>
      current.includes(url)
        ? current.filter((item) => item !== url)
        : [...current, url],
    );
  };

  const handleConfirm = () => {
    onSelect(selected);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSelected(selectedUrls);
          setIsOpen(true);
        }}
        disabled={disabled}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Images aria-hidden="true" size={16} />
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/35 px-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-images-title"
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-brand-border bg-brand-surface shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-brand-border px-5 py-4 phone:px-6">
              <div>
                <h2 id="upload-images-title" className="text-xl font-extrabold text-brand-ink">
                  Выбрать фото
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                  Выберите фото из уже загруженных. Можно отметить несколько.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть окно"
                className="grid size-10 flex-none place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-soft"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 phone:px-6">
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 phone:grid-cols-3 tablet:grid-cols-4">
                  {images.map((image) => {
                    const isSelected = selected.includes(image.url);

                    return (
                      <button
                        key={image.public_id}
                        type="button"
                        onClick={() => toggleImage(image.url)}
                        aria-pressed={isSelected}
                        aria-label={image.public_id}
                        className={`relative h-28 overflow-hidden rounded-2xl border-2 bg-brand-soft transition-all phone:h-32 ${
                          isSelected ? "border-brand-accent" : "border-transparent hover:border-brand-outline"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.public_id}
                          fill
                          sizes="(max-width: 600px) 50vw, 25vw"
                          className="object-cover"
                        />
                        {isSelected && (
                          <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-brand-accent text-white">
                            <Check aria-hidden="true" size={16} strokeWidth={3} />
                          </span>
                        )}
                        <span className="absolute inset-x-0 bottom-0 truncate bg-brand-ink/45 px-2 py-1.5 text-left text-[10px] font-semibold text-white">
                          {image.public_id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-brand-border bg-white px-5 py-12 text-center text-sm text-brand-muted">
                  Нет загруженных фото.
                </p>
              )}
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-brand-border px-5 py-4 phone:px-6">
              <span className="text-xs font-semibold text-brand-muted" role="status">
                Выбрано: {selected.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-10 rounded-xl border border-brand-border bg-white px-4 text-sm font-bold text-brand-subtle transition-colors hover:bg-brand-soft"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={selected.length === 0}
                  className="min-h-10 rounded-xl bg-brand-accent px-4 text-sm font-extrabold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Добавить
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
